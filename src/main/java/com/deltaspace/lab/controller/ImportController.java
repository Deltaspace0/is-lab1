package com.deltaspace.lab.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
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
import com.deltaspace.lab.service.PageService;

@RestController
@RequestMapping("/import")
public class ImportController {

    private final ImportService importService;
    private final PageService pageService;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "status", "username", "count"
    );

    public ImportController(
        ImportService importService,
        PageService pageService
    ) {
        this.importService = importService;
        this.pageService = pageService;
    }

    @GetMapping("/amount")
    public Long getAmount(@CookieValue("uname") String username) {
        return importService.getAmount(username);
    }

    @GetMapping
    public ResponseEntity<List<ImportData>> getImportHistory(
        @RequestParam(required = true) Integer pageNumber,
        @RequestParam(required = true) Integer pageSize,
        @RequestParam(required = false) String sortField,
        @RequestParam(required = false) String sortOrder,
        @CookieValue("uname") String username
    ) {
        try {
            Pageable pageable = pageService.getPageable(
                pageNumber,
                pageSize,
                sortField,
                sortOrder,
                ALLOWED_SORT_FIELDS
            );
            List<ImportData> list = importService.getImportHistory(
                pageable,
                username
            );
            return ResponseEntity.ok(list);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
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
