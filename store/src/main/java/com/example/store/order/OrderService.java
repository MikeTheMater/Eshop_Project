package com.example.store.order;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<Order> getAll() {
        return orderRepo.findAll();
    }

    @Transactional
    public Order createOrder(List<OrderItemRequest> itemsRequest) {

        if (itemsRequest == null || itemsRequest.isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }
        Order order = new Order();

        double total = 0;

        for (OrderItemRequest itemReq : itemsRequest) {

            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }

            Product product = productRepo.findById(itemReq.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(product.getPrice());

            item.setOrder(order);

            total += product.getPrice() * itemReq.getQuantity();

            order.getItems().add(item);
        }

        order.setTotal(total);

        return orderRepo.save(order);
    }
}