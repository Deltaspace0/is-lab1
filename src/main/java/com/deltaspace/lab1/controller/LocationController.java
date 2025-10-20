package com.deltaspace.lab1.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deltaspace.lab1.model.Location;
import com.deltaspace.lab1.service.LocationService;

@RestController
@RequestMapping("/location")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public List<Location> getLocationList() {
        return locationService.getList();
    }

    @GetMapping("/{id}")
    public Location getLocation(@PathVariable Integer id) {
        return locationService.getById(id);
    }

}
