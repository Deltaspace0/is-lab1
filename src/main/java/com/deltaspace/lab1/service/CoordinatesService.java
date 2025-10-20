package com.deltaspace.lab1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.deltaspace.lab1.model.Coordinates;
import com.deltaspace.lab1.repository.CoordinatesRepository;

@Service
public class CoordinatesService {

    public final CoordinatesRepository coordinatesRepository;

    public CoordinatesService(CoordinatesRepository coordinatesRepository) {
        this.coordinatesRepository = coordinatesRepository;
    }

    public List<Coordinates> getList() {
        return coordinatesRepository.findAll();
    }

    public Coordinates getById(Integer id) {
        return coordinatesRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("No coordinates"));
    }

    public Coordinates update(Coordinates coordinates) {
        if (coordinates == null) {
            return null;
        }
        return coordinatesRepository.save(coordinates);
    }

}
