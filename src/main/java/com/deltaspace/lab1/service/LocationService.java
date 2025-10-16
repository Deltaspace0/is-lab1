package com.deltaspace.lab1.service;

import org.springframework.stereotype.Service;

import com.deltaspace.lab1.model.Location;
import com.deltaspace.lab1.repository.LocationRepository;

@Service
public class LocationService {

    public final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location getById(Integer id) {
        return locationRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("No location"));
    }

    public Location add(Location location) {
        if (location == null) {
            return null;
        }
        location.setId(null);
        return locationRepository.save(location);
    }

    public Location addOrGet(Location location) {
        if (location == null) {
            return null;
        }
        Integer id = location.getId();
        if (id != null && id > 0) {
            return getById(id);
        }
        return add(location);
    }

}
