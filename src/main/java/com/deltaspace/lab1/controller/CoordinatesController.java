package com.deltaspace.lab1.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deltaspace.lab1.model.Coordinates;
import com.deltaspace.lab1.service.CoordinatesService;

@RestController
@RequestMapping("/coordinates")
public class CoordinatesController {

    private final CoordinatesService coordinatesService;

    public CoordinatesController(CoordinatesService coordinatesService) {
        this.coordinatesService = coordinatesService;
    }

    @GetMapping
    public List<Coordinates> getCoordinatesList() {
        return coordinatesService.getList();
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
