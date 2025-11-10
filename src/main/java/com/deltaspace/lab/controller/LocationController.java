package com.deltaspace.lab.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.deltaspace.lab.model.Location;
import com.deltaspace.lab.service.LocationService;
import com.deltaspace.lab.service.PageService;

@RestController
@RequestMapping("/location")
public class LocationController {

    private final LocationService locationService;
    private final PageService pageService;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "name", "x", "y"
    );

    public LocationController(
        LocationService locationService,
        PageService pageService
    ) {
        this.locationService = locationService;
        this.pageService = pageService;
    }

    @GetMapping("/amount")
    public Long getAmount() {
        return locationService.getAmount();
    }

    @GetMapping
    public ResponseEntity<List<Location>> getLocationList(
        @RequestParam(required = true) Integer pageNumber,
        @RequestParam(required = true) Integer pageSize,
        @RequestParam(required = false) String sortField,
        @RequestParam(required = false) String sortOrder
    ) {
        try {
            Pageable pageable = pageService.getPageable(
                pageNumber,
                pageSize,
                sortField,
                sortOrder,
                ALLOWED_SORT_FIELDS
            );
            List<Location> list = locationService.getList(pageable);
            return ResponseEntity.ok(list);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocation(@PathVariable Integer id) {
        try {
            Location location = locationService.getById(id);
            return ResponseEntity.ok(location);
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Integer id) {
        try {
            locationService.delete(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}
