package com.deltaspace.lab.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
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

    @Cacheable("coordinatesCache")
    public Coordinates getById(Integer id) {
        return coordinatesRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("No coordinates"));
    }

    @CachePut(value = "coordinatesCache", key = "#result.id")
    public Coordinates update(Coordinates coordinates) {
        if (coordinates == null) {
            return null;
        }
        return coordinatesRepository.save(coordinates);
    }

    @CacheEvict(value = "coordinatesCache", allEntries = true)
    @Transactional
    public void deleteAll() {
        coordinatesRepository.deleteAll();
        coordinatesRepository.resetSequence();
    }

    @CacheEvict(value = "coordinatesCache", key = "#id")
    public void delete(Integer id) {
        coordinatesRepository.deleteById(id);
    }

}
