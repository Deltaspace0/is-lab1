package com.deltaspace.lab.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.deltaspace.lab.enums.Color;
import com.deltaspace.lab.exception.FieldValidationException;
import com.deltaspace.lab.model.Person;
import com.deltaspace.lab.service.PageService;
import com.deltaspace.lab.service.PersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonService personService;
    private final PageService pageService;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "name", "creationDate", "eyeColor", "hairColor", 
        "height", "birthday", "weight", "nationality"
    );

    public PersonController(
        PersonService personService,
        PageService pageService
    ) {
        this.personService = personService;
        this.pageService = pageService;
    }

    @GetMapping("/amount")
    public Long getAmount(
        @RequestParam(required = false) String nameFilter
    ) {
        if (nameFilter != null) {
            return personService.getAmount(nameFilter);
        }
        return personService.getAmount();
    }

    @GetMapping("/sumHeight")
    public Long getHeightSum() {
        return personService.getHeightSum();
    }

    @GetMapping("/weightLess")
    public Long getAmountLessWeight(
        @RequestParam(required = true) Integer weight
    ) {
        return personService.getAmountLessWeight(weight);
    }

    @PutMapping("/birthdayLess")
    public List<Person> getListLessBirthday(
        @RequestBody java.time.ZonedDateTime birthday
    ) {
        return personService.getListLessBirthday(birthday);
    }

    @GetMapping("/hairColorPercentage")
    public Double getHairColorPercentage(
        @RequestParam(required = true) Color hairColor
    ) {
        return personService.getHairColorPercentage(hairColor);
    }

    @GetMapping("/eyeColorPercentage")
    public Double getEyeColorPercentage(
        @RequestParam(required = true) Color eyeColor
    ) {
        return personService.getEyeColorPercentage(eyeColor);
    }

    @GetMapping
    public ResponseEntity<List<Person>> getPersonList(
        @RequestParam(required = true) Integer pageNumber,
        @RequestParam(required = true) Integer pageSize,
        @RequestParam(required = false) String nameFilter,
        @RequestParam(required = false) String sortField,
        @RequestParam(required = false) String sortOrder
    ) {
        if (nameFilter == null) {
            nameFilter = "";
        }
        try {
            Pageable pageable = pageService.getPageable(
                pageNumber,
                pageSize,
                sortField,
                sortOrder,
                ALLOWED_SORT_FIELDS
            );
            List<Person> list = personService.getList(pageable, nameFilter);
            return ResponseEntity.ok(list);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getPerson(@PathVariable Integer id) {
        try {
            Person person = personService.getById(id);
            return ResponseEntity.ok(person);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Object> addPerson(
        @Valid @RequestBody Person person
    ) throws URISyntaxException {
        try {
            Person savedPerson = personService.add(person);
            URI uri = new URI("/person/"+savedPerson.getId());
            return ResponseEntity.created(uri).body(savedPerson);
        } catch (FieldValidationException exception) {
            Object body = exception.getFieldErrors();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePerson(
        @PathVariable Integer id,
        @Valid @RequestBody Person person
    ) {
        try {
            Person currentPerson = personService.update(id, person);
            return ResponseEntity.ok(currentPerson);
        } catch (FieldValidationException exception) {
            Object body = exception.getFieldErrors();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll(
        @CookieValue("uname") String username
    ) {
        if ("admin".equals(username)) {
            personService.deleteAll();
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Integer id) {
        personService.delete(id);
        return ResponseEntity.ok().build();
    }

}
