package com.deltaspace.lab.service;

import java.io.IOException;
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

import jakarta.transaction.Transactional;

@Service
public class ImportService {

    private final ImportRepository importRepository;
    private final PersonService personService;

    public ImportService(
        ImportRepository importRepository,
        PersonService personService
    ) {
        this.importRepository = importRepository;
        this.personService = personService;
    }

    @Transactional
    private Integer processFile(
        MultipartFile file,
        String username
    ) throws IOException {
        String json = new String(file.getBytes(), StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Person[] persons = mapper.readValue(json, Person[].class);
        for (Person person : persons) {
            personService.validate(person);
        }
        for (Person person : persons) {
            personService.add(person);
        }
        return persons.length;
    }

    public Integer importFile(MultipartFile file, String username) {
        try {
            Integer count = processFile(file, username);
            ImportData data = new ImportData(true, username, count);
            importRepository.save(data);
            return count;
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
