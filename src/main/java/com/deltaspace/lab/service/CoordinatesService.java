package com.deltaspace.lab.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deltaspace.lab.model.Coordinates;
import com.deltaspace.lab.repository.CoordinatesRepository;

@Service
public class CoordinatesService {

    private final CoordinatesRepository coordinatesRepository;

    public CoordinatesService(CoordinatesRepository coordinatesRepository) {
        this.coordinatesRepository = coordinatesRepository;
    }

    public List<Coordinates> getList(Pageable pageable) {
        return coordinatesRepository.findAll(pageable).getContent();
    }

    public Long getAmount() {
        return coordinatesRepository.count();
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

    @Transactional
    public void deleteAll() {
        coordinatesRepository.deleteAll();
        coordinatesRepository.resetSequence();
    }

    public void delete(Integer id) {
        coordinatesRepository.deleteById(id);
    }

}
