package com.deltaspace.lab.service;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.deltaspace.lab.model.ImportData;
import com.deltaspace.lab.model.Person;
import com.deltaspace.lab.repository.ImportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.validation.Validator;

@Service
public class ImportService {

    private final ImportRepository importRepository;
    private final PersonService personService;
    private final Validator validator;

    public ImportService(
        ImportRepository importRepository,
        PersonService personService,
        Validator validator
    ) {
        this.importRepository = importRepository;
        this.personService = personService;
        this.validator = validator;
    }

    private boolean isValid(Person person) {
        return validator.validate(person).isEmpty();
    }

    public Integer processFile(
        MultipartFile file,
        String username
    ) {
        try {
            String json = new String(file.getBytes(), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            Person[] persons = mapper.readValue(json, Person[].class);
            for (Person person : persons) {
                if (!isValid(person)) {
                    throw new RuntimeException("Invalid person");
                }
            }
            for (Person person : persons) {
                personService.add(person);
            }
            ImportData data = new ImportData(true, username, persons.length);
            importRepository.save(data);
            return persons.length;
        } catch (Exception exception) {
            ImportData data = new ImportData(false, username, null);
            importRepository.save(data);
            throw new RuntimeException();
        }
    }

    public Long getAmount(String username) {
        if ("admin".equals(username)) {
            return importRepository.count();
        }
        return importRepository.countByUsername(username);
    }

    public List<ImportData> getImportHistory(
        Integer pageNumber,
        Integer pageSize,
        String username
    ) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        if ("admin".equals(username)) {
            return importRepository.findAll(pageable).getContent();
        }
        return importRepository.findByUsername(username, pageable).getContent();
    }

}
