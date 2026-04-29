package com.example.store.order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    //Constructor
    public Order() {
        this.createdAt = LocalDateTime.now();
        this.total = 0.0; 
        this.items = new ArrayList<>();
    }

    // public Order(double total, LocalDateTime createdAt, List<OrderItem> items) {
    //     this.createdAt = LocalDateTime.now();
    //     this.total = 0.0; 
    //     this.items = new ArrayList<>();
    // }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void calculateTotal() {
        this.total = items.stream()
            .mapToDouble(i -> i.getPriceAtPurchase() * i.getQuantity())
            .sum();
    }

    //Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
