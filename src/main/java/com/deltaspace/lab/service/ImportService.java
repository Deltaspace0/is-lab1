package com.deltaspace.lab.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.deltaspace.lab.model.Person;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.validation.Validator;

@Service
public class ImportService {

    private final PersonService personService;
    private final Validator validator;

    public ImportService(PersonService personService, Validator validator) {
        this.personService = personService;
        this.validator = validator;
    }

    private boolean isValid(Person person) {
        return validator.validate(person).isEmpty();
    }

    public Integer processFile(
        MultipartFile file,
        String username
    ) throws IOException {
        String jsonContent = new String(file.getBytes(), StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Person[] persons = mapper.readValue(jsonContent, Person[].class);
        for (Person person : persons) {
            if (!isValid(person)) {
                throw new RuntimeException("Invalid person");
            }
        }
        for (Person person : persons) {
            personService.add(person);
        }
        return persons.length;
    }

}
