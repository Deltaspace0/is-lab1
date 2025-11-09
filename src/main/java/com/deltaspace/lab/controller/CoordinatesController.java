package com.deltaspace.lab.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.deltaspace.lab.model.Coordinates;
import com.deltaspace.lab.service.CoordinatesService;
import com.deltaspace.lab.service.PageService;

@RestController
@RequestMapping("/coordinates")
public class CoordinatesController {

    private final CoordinatesService coordinatesService;
    private final PageService pageService;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "x", "y"
    );

    public CoordinatesController(
        CoordinatesService coordinatesService,
        PageService pageService
    ) {
        this.coordinatesService = coordinatesService;
        this.pageService = pageService;
    }

    @GetMapping("/amount")
    public Long getAmount() {
        return coordinatesService.getAmount();
    }

    @GetMapping
    public ResponseEntity<List<Coordinates>> getCoordinatesList(
        @RequestParam(required = true) Integer pageNumber,
        @RequestParam(required = true) Integer pageSize,
        @RequestParam(required = false) String sortField,
        @RequestParam(required = false) String sortOrder
    ) {
        try {
            Pageable pageable = pageService.getPageable(
                pageNumber,
                pageSize,
                sortField,
                sortOrder,
                ALLOWED_SORT_FIELDS
            );
            List<Coordinates> list = coordinatesService.getList(pageable);
            return ResponseEntity.ok(list);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coordinates> getCoordinates(
        @PathVariable Integer id
    ) {
        try {
            Coordinates coordinates = coordinatesService.getById(id);
            return ResponseEntity.ok(coordinates);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}
