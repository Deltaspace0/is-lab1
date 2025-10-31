package com.deltaspace.lab.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.deltaspace.lab.model.ImportData;
import com.deltaspace.lab.service.ImportService;

@RestController
@RequestMapping("/import")
public class ImportController {

    private final ImportService importService;

    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @GetMapping("/amount")
    public Long getAmount(@CookieValue("uname") String username) {
        return importService.getAmount(username);
    }

    @GetMapping
    public List<ImportData> getImportHistory(
        @RequestParam(required = true) Integer pageNumber,
        @RequestParam(required = true) Integer pageSize,
        @CookieValue("uname") String username
    ) {
        return importService.getImportHistory(pageNumber, pageSize, username);
    }

    @PostMapping
    public ResponseEntity<Integer> uploadFile(
        @RequestBody MultipartFile file,
        @CookieValue("uname") String username
    ) {
        try {
            Integer count = importService.importFile(file, username);
            return ResponseEntity.ok().body(count);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}
