package com.deltaspace.lab1.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deltaspace.lab1.model.Location;

public interface LocationRepository extends JpaRepository<Location, Integer> {
}
