package com.example.store.order;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.store.address.Address;
import com.example.store.address.AddressRepository;
import com.example.store.address.AddressResponse;
import com.example.store.exception.InvalidOrderException;
import com.example.store.exception.ProductNotFoundException;
import com.example.store.product.Product;
import com.example.store.product.ProductRepository;
import com.example.store.user.User;
import com.example.store.user.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final AddressRepository addressRepo;

    public OrderService(OrderRepository orderRepo, ProductRepository productRepo,
                        UserRepository userRepo, AddressRepository addressRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.addressRepo = addressRepo;
    }

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional  // ← keeps the session open while items are mapped
    public List<OrderResponse> getAll() {
        return orderRepo.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional  // ← same fix here
    public List<OrderResponse> getMyOrders() {
        return orderRepo.findByUser(currentUser()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new InvalidOrderException("Order must contain at least one item");
        }

        User user = currentUser();

        Address address = addressRepo.findById(request.getAddressId())
                .orElseThrow(() -> new InvalidOrderException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new InvalidOrderException("Address does not belong to current user");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new InvalidOrderException("Quantity must be greater than 0");
            }
            Product product = productRepo.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(product.getPrice());
            order.addItem(item);
        }

        order.calculateTotal();
        return mapToResponse(orderRepo.save(order));
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getTotal(),
                order.getCreatedAt(),
                order.getUser().getUsername(),
                new AddressResponse(order.getAddress()),
                items
        );
    }
}