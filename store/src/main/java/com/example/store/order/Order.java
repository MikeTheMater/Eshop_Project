package com.example.store.order;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double total;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    //Constructor
    public Order() {
        this.createdAt = LocalDateTime.now();
        this.total = 0.0; 
    }
}
