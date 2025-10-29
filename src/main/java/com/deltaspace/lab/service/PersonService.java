package com.deltaspace.lab.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.deltaspace.lab.enums.Color;
import com.deltaspace.lab.model.Coordinates;
import com.deltaspace.lab.model.Location;
import com.deltaspace.lab.model.Person;
import com.deltaspace.lab.repository.PersonRepository;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final CoordinatesService coordinatesService;
    private final LocationService locationService;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "name", "creationDate", "eyeColor", "hairColor", 
        "height", "birthday", "weight", "nationality"
    );

    public PersonService(
        PersonRepository personRepository,
        CoordinatesService coordinatesService,
        LocationService locationService
    ) {
        this.personRepository = personRepository;
        this.coordinatesService = coordinatesService;
        this.locationService = locationService;
    }

    private Person handleHelperObjects(Person person) {
        Coordinates newCoordinates = person.getCoordinates();
        Coordinates coordinates = coordinatesService.update(newCoordinates);
        person.setCoordinates(coordinates);
        Location newLocation = person.getLocation();
        Location location = locationService.update(newLocation);
        person.setLocation(location);
        return person;
    }

    public List<Person> getList(
        Integer pageNumber,
        Integer pageSize,
        String nameFilter
    ) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return personRepository.findByNameContaining(
            nameFilter,
            pageable
        ).getContent();
    }

    public List<Person> getList(
        Integer pageNumber,
        Integer pageSize,
        String nameFilter,
        String field,
        String sortOrder
    ) {
        if (!ALLOWED_SORT_FIELDS.contains(field)) {
            throw new RuntimeException("Wrong field: "+field);
        }
        if (!"desc".equals(sortOrder) && !"asc".equals(sortOrder)) {
            throw new RuntimeException("Wrong sort order: "+field);
        }
        Sort sort = "asc".equals(sortOrder)
            ? Sort.by(field).ascending()
            : Sort.by(field).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        return personRepository.findByNameContaining(
            nameFilter,
            pageable
        ).getContent();
    }

    public Long getAmount() {
        return personRepository.count();
    }

    public Long getAmount(String nameFilter) {
        return (long)personRepository.findByNameContaining(nameFilter).size();
    }

    public Long getHeightSum() {
        List<Person> personList = personRepository.findAll();
        Long heightSum = 0L;
        for (Person person : personList) {
            heightSum += person.getHeight();
        }
        return heightSum;
    }

    public Long getAmountLessWeight(Integer weight) {
        List<Person> personList = personRepository.findAll();
        Long amount = 0L;
        for (Person person : personList) {
            if (person.getWeight() < weight) {
                amount++;
            }
        }
        return amount;
    }

    public List<Person> getListLessBirthday(java.time.ZonedDateTime birthday) {
        List<Person> allPersonList = personRepository.findAll();
        List<Person> personList = new ArrayList<Person>();
        for (Person person : allPersonList) {
            if (person.getBirthday().isBefore(birthday)) {
                personList.add(person);
            }
        }
        return personList;
    }

    public Double getHairColorPercentage(Color hairColor) {
        List<Person> personList = personRepository.findAll();
        Double colorAmount = 0d;
        Double amount = 0d; 
        for (Person person : personList) {
            if (person.getHairColor() == hairColor) {
                colorAmount++;
            }
            amount++;
        }
        return colorAmount*100/amount;
    }

    public Double getEyeColorPercentage(Color eyeColor) {
        List<Person> personList = personRepository.findAll();
        Double colorAmount = 0d;
        Double amount = 0d; 
        for (Person person : personList) {
            if (person.getEyeColor() == eyeColor) {
                colorAmount++;
            }
            amount++;
        }
        return colorAmount*100/amount;
    }

    public Person getById(Integer id) {
        return personRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("No person"));
    }

    public Person add(Person person) {
        person.setId(null);
        return personRepository.save(handleHelperObjects(person));
    }

    public Person update(Integer id, Person person) {
        if (!personRepository.existsById(id)) {
            return null;
        }
        person.setId(id);
        return personRepository.save(handleHelperObjects(person));
    }

    public void delete(Integer id) {
        personRepository.deleteById(id);
    }

}
