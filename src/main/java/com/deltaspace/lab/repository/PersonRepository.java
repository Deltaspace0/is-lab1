package com.deltaspace.lab.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.deltaspace.lab.model.Person;

public interface PersonRepository extends JpaRepository<Person, Integer> {
    @Modifying
    @Query(
        value = "ALTER SEQUENCE person_id_seq RESTART WITH 1",
        nativeQuery = true
    )
    void resetSequence();
    boolean existsByNameAndIdNot(String name, Integer id);
    List<Person> findByNameContaining(String name);
    Page<Person> findByNameContaining(String name, Pageable pageable);
}
