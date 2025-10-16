package com.deltaspace.lab1.service;

import org.springframework.stereotype.Service;

import com.deltaspace.lab1.model.Coordinates;
import com.deltaspace.lab1.repository.CoordinatesRepository;

@Service
public class CoordinatesService {

    public final CoordinatesRepository coordinatesRepository;

    public CoordinatesService(CoordinatesRepository coordinatesRepository) {
        this.coordinatesRepository = coordinatesRepository;
    }

    public Coordinates add(Coordinates coordinates) {
        if (coordinates == null) {
            return null;
        }
        coordinates.setId(null);
        return coordinatesRepository.save(coordinates);
    }

    public Coordinates update(Integer id, Coordinates coordinates) {
        if (coordinates == null) {
            return null;
        }
        coordinates.setId(id);
        return coordinatesRepository.save(coordinates);
    }

}
