package com.example.store.product;
//Database access layer for product Entity (abstraction)
//Repository = generated implementation, not just abstraction
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // JpaRepository already provides basic CRUD methods
}