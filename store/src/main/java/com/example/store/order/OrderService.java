package com.example.store.order;

import org.springframework.stereotype.Service;

import com.example.store.product.Product;
import com.example.store.product.ProductRepository;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    public Order createOrder(List<OrderItemRequest> itemsRequest) {

        Order order = new Order();

        double total = 0;

        for (OrderItemRequest itemReq : itemsRequest) {

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