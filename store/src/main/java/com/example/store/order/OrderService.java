package com.example.store.order;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.store.exception.InvalidOrderException;
import com.example.store.exception.ProductNotFoundException;
import com.example.store.product.Product;
import com.example.store.product.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    public List<OrderResponse> getAll() {
        return orderRepo.findAll()
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Transactional
    public OrderResponse createOrder(List<OrderItemRequest> itemsRequest) {

        if (itemsRequest == null || itemsRequest.isEmpty()) {
            throw new InvalidOrderException("Order must contain at least one item");
        }
        Order order = new Order();

        for (OrderItemRequest itemReq : itemsRequest) {

            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new InvalidOrderException("Quantity must be greater than 0");
            }

            Product product = productRepo.findById(itemReq.getProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

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
                items
        );
    }
}