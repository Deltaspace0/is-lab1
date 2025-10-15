package com.deltaspace.lab1.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deltaspace.lab1.model.Person;

public interface PersonRepository extends JpaRepository<Person, Integer> {
}
