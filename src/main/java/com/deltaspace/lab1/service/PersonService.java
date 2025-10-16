package com.deltaspace.lab1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.deltaspace.lab1.model.Coordinates;
import com.deltaspace.lab1.model.Location;
import com.deltaspace.lab1.model.Person;
import com.deltaspace.lab1.repository.CoordinatesRepository;
import com.deltaspace.lab1.repository.LocationRepository;
import com.deltaspace.lab1.repository.PersonRepository;

@Service
public class PersonService {
    
    private final PersonRepository personRepository;
    private final CoordinatesRepository coordinatesRepository;
    private final LocationRepository locationRepository;

    public PersonService(
        PersonRepository personRepository,
        CoordinatesRepository coordinatesRepository,
        LocationRepository locationRepository
    ) {
        this.personRepository = personRepository;
        this.coordinatesRepository = coordinatesRepository;
        this.locationRepository = locationRepository;
    }

    private Coordinates handleCoordinates(Coordinates coordinates) {
        return coordinatesRepository.save(coordinates);
    }

    private Location handleLocation(Location location) {
        Integer id = location.getId();
        if (id != null && id > 0) {
            return locationRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("No location"));
        }
        return locationRepository.save(location);
    }

    public List<Person> getPersonList() {
        return personRepository.findAll();
    }

    public Person getPerson(Integer id) {
        return personRepository
            .findById(id)
            .orElseThrow(RuntimeException::new);
    }

    public Person addPerson(Person person) {
        if (person.getCoordinates() != null) {
            Coordinates coordinates = handleCoordinates(person.getCoordinates());
            person.setCoordinates(coordinates);
        }
        if (person.getLocation() != null) {
            Location location = handleLocation(person.getLocation());
            person.setLocation(location);
        }
       return personRepository.save(person);
    }

    public Person updatePerson(Integer id, Person person) {
        Person currentPerson = personRepository
            .findById(id)
            .orElseThrow(RuntimeException::new);
        Coordinates coordinates = person.getCoordinates();
        if (coordinates != null) {
            Coordinates currentCoordinates = currentPerson.getCoordinates();
            currentCoordinates.setX(coordinates.getX());
            currentCoordinates.setY(coordinates.getY());
            coordinatesRepository.save(currentCoordinates);
        }
        if (person.getLocation() != null) {
            Location location = handleLocation(person.getLocation());
            person.setLocation(location);
        }
        currentPerson.setName(person.getName());
        currentPerson.setEyeColor(person.getEyeColor());
        currentPerson.setHairColor(person.getHairColor());
        currentPerson.setHeight(person.getHeight());
        currentPerson.setBirthday(person.getBirthday());
        currentPerson.setWeight(person.getWeight());
        currentPerson.setNationality(person.getNationality());
        return personRepository.save(currentPerson);
    }

    public void deletePerson(Integer id) {
        personRepository.deleteById(id);
    }

}
