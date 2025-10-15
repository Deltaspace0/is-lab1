package com.deltaspace.lab1.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deltaspace.lab1.model.Coordinates;

public interface CoordinatesRepository extends JpaRepository<Coordinates, Integer> {
}
