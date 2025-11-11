package com.deltaspace.lab.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.deltaspace.lab.annotation.RetryableTransactional;
import com.deltaspace.lab.model.Person;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class FileService {

    private final PersonService personService;

    public FileService(PersonService personService) {
        this.personService = personService;
    }

    @RetryableTransactional
    public Integer processFile(
        MultipartFile file,
        String username
    ) throws IOException {
        String json = new String(file.getBytes(), StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Person[] persons = mapper.readValue(json, Person[].class);
        for (int i = 0; i < persons.length; i++) {
            persons[i] = personService.add(persons[i]);
        }
        return persons.length;
    }

}
