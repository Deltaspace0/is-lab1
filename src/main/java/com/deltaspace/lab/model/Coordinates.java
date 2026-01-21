package com.deltaspace.lab.model;

import java.io.Serializable;

import org.eclipse.persistence.annotations.Cache;
import org.eclipse.persistence.annotations.CacheCoordinationType;
import org.eclipse.persistence.annotations.CacheType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

@Entity
@Table(name = "coordinates")
@Cache(
    type = CacheType.SOFT,
    size = 1000,
    expiry = 3600000,
    coordinationType = CacheCoordinationType.SEND_NEW_OBJECTS_WITH_CHANGES
)
public class Coordinates implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @DecimalMin(value = "-860", inclusive = false)
    private double x;

    @Column(nullable = false)
    @DecimalMax(value = "396")
    private Float y;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public Float getY() {
        return y;
    }

    public void setY(Float y) {
        this.y = y;
    }

}
