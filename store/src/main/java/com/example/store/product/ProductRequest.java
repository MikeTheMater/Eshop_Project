package com.example.store.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProductRequest {

    @NotBlank
    private String name;

    @NotNull
    @Positive
    private Double price;

    private String description;

    @NotBlank
    private String color;

    @NotBlank
    private String type;

    // Getters & Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}