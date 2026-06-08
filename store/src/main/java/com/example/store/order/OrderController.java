package com.example.store.order;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public OrderResponse create(@RequestBody OrderRequest request) {
        return service.createOrder(request);
    }

    // Current user's orders only
    @GetMapping("/my")
    public List<OrderResponse> getMyOrders() {
        return service.getMyOrders();
    }

    // All orders — will be admin-only in the next step
    @GetMapping
    public List<OrderResponse> getAll() {
        return service.getAll();
    }
}