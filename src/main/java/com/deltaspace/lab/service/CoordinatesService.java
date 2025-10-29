package com.deltaspace.lab.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.deltaspace.lab.model.Coordinates;
import com.deltaspace.lab.repository.CoordinatesRepository;

@Service
public class CoordinatesService {

    public final CoordinatesRepository coordinatesRepository;

    public CoordinatesService(CoordinatesRepository coordinatesRepository) {
        this.coordinatesRepository = coordinatesRepository;
    }

    public List<Coordinates> getList(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
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

    public void deleteAll() {
        coordinatesRepository.deleteAll();
    }

}
