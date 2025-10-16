package com.deltaspace.lab1.service;

import java.util.List;

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

    public List<Person> getList() {
        return personRepository.findAll();
    }

    public Person getById(Integer id) {
        return personRepository
            .findById(id)
            .orElseThrow(RuntimeException::new);
    }

    public Person add(Person person) {
        person.setId(null);
        Coordinates newCoordinates = person.getCoordinates();
        Coordinates coordinates = coordinatesService.add(newCoordinates);
        person.setCoordinates(coordinates);
        Location newLocation = person.getLocation();
        Location location = locationService.addOrGet(newLocation);
        person.setLocation(location);
        return personRepository.save(person);
    }

    public Person update(Integer id, Person person) {
        person.setId(id);
        Person currentPerson = getById(id);
        Coordinates coordinates = coordinatesService.update(
            currentPerson.getCoordinates().getId(),
            person.getCoordinates()
        );
        person.setCoordinates(coordinates);
        Location location = locationService.add(person.getLocation());
        person.setLocation(location);
        return personRepository.save(person);
    }

    public void delete(Integer id) {
        personRepository.deleteById(id);
    }

}
