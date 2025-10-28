package com.deltaspace.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deltaspace.lab.model.Location;

public interface LocationRepository extends JpaRepository<Location, Integer> {
}
