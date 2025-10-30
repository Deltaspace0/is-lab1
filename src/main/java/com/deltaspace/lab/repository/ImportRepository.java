package com.deltaspace.lab.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.deltaspace.lab.model.ImportData;

public interface ImportRepository extends JpaRepository<ImportData, Integer> {
    Page<ImportData> findByUsername(String username, Pageable pageable);
    Long countByUsername(String username);
}
