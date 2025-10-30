package com.deltaspace.lab.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.deltaspace.lab.service.ImportService;

@RestController
@RequestMapping("/import")
public class ImportController {

    private final ImportService importService;

    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @PostMapping
    public ResponseEntity<Integer> uploadFile(
        @RequestBody MultipartFile file,
        @CookieValue("uname") String username
    ) {
        try {
            Integer count = importService.processFile(file, username);
            return ResponseEntity.ok().body(count);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}
