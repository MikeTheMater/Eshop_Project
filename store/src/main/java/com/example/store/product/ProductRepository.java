package com.example.store.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // duplicate check (case insensitive)
    boolean existsByNameIgnoreCaseAndColorIgnoreCase(String name, String color);

    // filtering
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}