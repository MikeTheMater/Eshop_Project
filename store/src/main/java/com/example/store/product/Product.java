package com.example.store.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price; //calculate price in cents to avoid floating point issues

    @Column(length=1000)
    private String description;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String type;

    // Constructors
    public Product() {}

    public Product(String name, Double price, String description, String color, String type) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.color = color;
        this.type = type;

    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color){
        this.color = color;
    }

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type = type;
    }
}