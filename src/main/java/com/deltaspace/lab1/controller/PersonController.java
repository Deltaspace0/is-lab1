package com.deltaspace.lab1.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deltaspace.lab1.model.Coordinates;
import com.deltaspace.lab1.model.Location;
import com.deltaspace.lab1.model.Person;
import com.deltaspace.lab1.repository.CoordinatesRepository;
import com.deltaspace.lab1.repository.LocationRepository;
import com.deltaspace.lab1.repository.PersonRepository;

@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonRepository personRepository;
    private final CoordinatesRepository coordinatesRepository;
    private final LocationRepository locationRepository;

    public PersonController(
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

    @GetMapping
    public List<Person> getPersons() {
        return personRepository.findAll();
    }

    @GetMapping("/{id}")
    public Person getPerson(@PathVariable Integer id) {
        return personRepository
            .findById(id)
            .orElseThrow(RuntimeException::new);
    }

    @PostMapping
    public ResponseEntity<Person> createPerson(
        @RequestBody Person person
    ) throws URISyntaxException {
        if (person.getCoordinates() != null) {
            Coordinates coordinates = handleCoordinates(person.getCoordinates());
            person.setCoordinates(coordinates);
        }
        if (person.getLocation() != null) {
            Location location = handleLocation(person.getLocation());
            person.setLocation(location);
        }
        Person savedPerson = personRepository.save(person);
        URI uri = new URI("/person/"+savedPerson.getId());
        return ResponseEntity.created(uri).body(savedPerson);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Person> updatePerson(
        @PathVariable Integer id,
        @RequestBody Person person
    ) {
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
        personRepository.save(currentPerson);
        return ResponseEntity.ok(currentPerson);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Integer id) {
        personRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
