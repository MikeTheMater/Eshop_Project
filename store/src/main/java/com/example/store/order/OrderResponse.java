package com.example.store.order;

import java.time.LocalDateTime;
import java.util.List;

import com.example.store.address.AddressResponse;

public class OrderResponse {
    private Long id;
    private Double total;
    private LocalDateTime createdAt;
    private String username;
    private AddressResponse address;
    private List<OrderItemResponse> items;

    public OrderResponse(Long id, Double total, LocalDateTime createdAt,
                         String username, AddressResponse address,
                         List<OrderItemResponse> items) {
        this.id = id;
        this.total = total;
        this.createdAt = createdAt;
        this.username = username;
        this.address = address;
        this.items = items;
    }

    public Long getId() { return id; }
    public Double getTotal() { return total; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getUsername() { return username; }
    public AddressResponse getAddress() { return address; }
    public List<OrderItemResponse> getItems() { return items; }
}