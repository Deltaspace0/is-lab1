package com.deltaspace.lab1.controller;

import java.util.List;

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
    public Coordinates getCoordinates(@PathVariable Integer id) {
        return coordinatesService.getById(id);
    }

}
