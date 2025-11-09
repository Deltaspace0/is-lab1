package com.deltaspace.lab.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    public Location getById(Integer id) {
        return locationRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("No location"));
    }

    public Location update(Location location) {
        if (location == null) {
            return null;
        }
        return locationRepository.save(location);
    }

    public void deleteAll() {
        locationRepository.deleteAll();
    }

}
