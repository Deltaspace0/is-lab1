package com.deltaspace.lab.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deltaspace.lab.model.Location;
import com.deltaspace.lab.repository.LocationRepository;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public boolean hasDuplicateName(Location location) {
        Integer id = location.getId();
        String name = location.getName();
        return locationRepository.existsByNameAndIdNot(name, id);
    }

    public List<Location> getList(Pageable pageable) {
        return locationRepository.findAll(pageable).getContent();
    }

    public Long getAmount() {
        return locationRepository.count();
    }

    @Cacheable("locationCache")
    public Location getById(Integer id) {
        return locationRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("No location"));
    }

    @CachePut(value = "locationCache", key = "#result.id")
    public Location update(Location location) {
        if (location == null) {
            return null;
        }
        return locationRepository.save(location);
    }

    @CacheEvict(value = "locationCache", allEntries = true)
    @Transactional
    public void deleteAll() {
        locationRepository.deleteAll();
        locationRepository.resetSequence();
    }

    @CacheEvict(value = "locationCache", key = "#id")
    public void delete(Integer id) {
        locationRepository.deleteById(id);
    }

}
