package com.deltaspace.lab1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.deltaspace.lab1.model.Location;
import com.deltaspace.lab1.repository.LocationRepository;

@Service
public class LocationService {

    public final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getList() {
        return locationRepository.findAll();
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

}
