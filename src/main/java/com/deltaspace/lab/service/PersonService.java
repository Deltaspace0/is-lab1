package com.deltaspace.lab.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deltaspace.lab.annotation.RetryableTransactional;
import com.deltaspace.lab.enums.Color;
import com.deltaspace.lab.exception.FieldValidationException;
import com.deltaspace.lab.model.Coordinates;
import com.deltaspace.lab.model.Location;
import com.deltaspace.lab.model.Person;
import com.deltaspace.lab.repository.PersonRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final CoordinatesService coordinatesService;
    private final LocationService locationService;
    private final Validator validator;

    public PersonService(
        PersonRepository personRepository,
        CoordinatesService coordinatesService,
        LocationService locationService,
        Validator validator
    ) {
        this.personRepository = personRepository;
        this.coordinatesService = coordinatesService;
        this.locationService = locationService;
        this.validator = validator;
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

    public void validate(Person person) {
        if (locationService.hasDuplicateName(person.getLocation())) {
            throw new FieldValidationException(
                "location.name",
                "Already exists",
                person.getName()
            );
        }
        Integer id = person.getId();
        String name = person.getName();
        if (personRepository.existsByNameAndIdNot(name, id)) {
            throw new FieldValidationException(
                "name",
                "Already exists",
                person.getName()
            );
        }
        Set<ConstraintViolation<Person>> viols = validator.validate(person);
        if (!viols.isEmpty()) {
            Iterator<ConstraintViolation<Person>> iterator = viols.iterator();
            ConstraintViolation<Person> violation = iterator.next();
            throw new FieldValidationException(
                violation.getPropertyPath().toString(),
                violation.getMessage(),
                person.getName()
            );
        }
    }

    public List<Person> getList(Pageable pageable, String nameFilter) {
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

    @Cacheable("personCache")
    public Person getById(Integer id) {
        return personRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("No person"));
    }

    @CachePut(value = "personCache", key = "#result.id")
    @RetryableTransactional
    public Person add(Person person) {
        person.setId(null);
        validate(person);
        return personRepository.save(handleHelperObjects(person));
    }

    @CachePut(value = "personCache", key = "#id")
    @RetryableTransactional
    public Person update(Integer id, Person person) {
        validate(person);
        Optional<Person> existingPerson = personRepository.findById(id);
        if (!existingPerson.isPresent()) {
            throw new FieldValidationException("id", "No person");
        }
        person.setId(id);
        person.setCreationDate(existingPerson.get().getCreationDate());
        return personRepository.save(handleHelperObjects(person));
    }

    @CacheEvict(value = "personCache", allEntries = true)
    @Transactional
    public void deleteAll() {
        personRepository.deleteAll();
        personRepository.resetSequence();
        coordinatesService.deleteAll();
        locationService.deleteAll();
    }

    @CacheEvict(value = "personCache", key = "#id")
    public void delete(Integer id) {
        personRepository.deleteById(id);
    }

}
