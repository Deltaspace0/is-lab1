package com.deltaspace.lab1.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.deltaspace.lab1.model.Coordinates;
import com.deltaspace.lab1.model.Location;
import com.deltaspace.lab1.model.Person;
import com.deltaspace.lab1.repository.PersonRepository;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final CoordinatesService coordinatesService;
    private final LocationService locationService;

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

    public List<Person> getList(Integer pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 20);
        return personRepository.findAll(pageable).getContent();
    }

    public List<Person> getList(
        Integer pageNumber,
        String field,
        boolean sorting
    ) {
        Sort sort = sorting
            ? Sort.by(field).ascending()
            : Sort.by(field).descending();
        Pageable pageable = PageRequest.of(pageNumber, 20, sort);
        return personRepository.findAll(pageable).getContent();
    }

    public Long getAmount() {
        return personRepository.count();
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
