package com.deltaspace.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.deltaspace.lab.model.Coordinates;

public interface CoordinatesRepository extends JpaRepository<Coordinates, Integer> {
    @Modifying
    @Query(
        value = "ALTER SEQUENCE coordinates_id_seq RESTART WITH 1",
        nativeQuery = true
    )
    void resetSequence();
}
