package com.deltaspace.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.deltaspace.lab.model.Location;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    @Modifying
    @Query(
        value = "ALTER SEQUENCE location_id_seq RESTART WITH 1",
        nativeQuery = true
    )
    void resetSequence();
    boolean existsByNameAndIdNot(String name, Integer id);
}
