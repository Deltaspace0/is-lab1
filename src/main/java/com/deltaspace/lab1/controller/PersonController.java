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

import com.deltaspace.lab1.model.Person;
import com.deltaspace.lab1.service.PersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public List<Person> getPersonList() {
        return personService.getPersonList();
    }

    @GetMapping("/{id}")
    public Person getPerson(@PathVariable Integer id) {
        return personService.getPerson(id);
    }

    @PostMapping
    public ResponseEntity<Person> addPerson(
        @Valid @RequestBody Person person
    ) throws URISyntaxException {
        Person savedPerson = personService.addPerson(person);
        URI uri = new URI("/person/"+savedPerson.getId());
        return ResponseEntity.created(uri).body(savedPerson);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Person> updatePerson(
        @PathVariable Integer id,
        @Valid @RequestBody Person person
    ) {
        Person currentPerson = personService.updatePerson(id, person);
        return ResponseEntity.ok(currentPerson);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Integer id) {
        personService.deletePerson(id);
        return ResponseEntity.ok().build();
    }

}
