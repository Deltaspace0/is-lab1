package com.deltaspace.lab.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "import")
public class ImportData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Boolean status;

    @Column(nullable = false)
    private String username;

    @Min(value = 0)
    private Integer count;

    public ImportData() {}

    public ImportData(Boolean status, String username, Integer count) {
        this.status = status;
        this.username = username;
        this.count = count;
    }

    public Integer getId() {
        return id;
    }

    public Boolean getStatus() {
        return status;
    }

    public String getUsername() {
        return username;
    }

    public Integer getCount() {
        return count;
    }

}
