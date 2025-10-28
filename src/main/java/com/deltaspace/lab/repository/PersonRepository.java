package com.deltaspace.lab.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.deltaspace.lab.model.Person;

public interface PersonRepository extends JpaRepository<Person, Integer> {
    Page<Person> findByNameContaining(String name, Pageable pageable);
}
