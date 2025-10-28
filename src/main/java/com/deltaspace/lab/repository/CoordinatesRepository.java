package com.deltaspace.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deltaspace.lab.model.Coordinates;

public interface CoordinatesRepository extends JpaRepository<Coordinates, Integer> {
}
