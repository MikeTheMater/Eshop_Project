package com.example.store;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.store.product.Product;
import com.example.store.product.ProductRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepo;

    public DataSeeder(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    @Override
    public void run(String... args) {
        // Only seed if the table is empty — safe to leave in during development
        if (productRepo.count() > 0) return;

        productRepo.save(new Product("Classic T-Shirt",  19.99, "A comfortable everyday t-shirt.", "White", "Shirt"));
        productRepo.save(new Product("Classic T-Shirt",  19.99, "A comfortable everyday t-shirt.", "Black", "Shirt"));
        productRepo.save(new Product("Slim Chinos",      49.99, "Smart slim-fit chino trousers.",   "Beige", "Pants"));
        productRepo.save(new Product("Slim Chinos",      49.99, "Smart slim-fit chino trousers.",   "Navy",  "Pants"));
        productRepo.save(new Product("Hoodie",           59.99, "Warm pullover hoodie.",            "Grey",  "Hoodie"));
        productRepo.save(new Product("Hoodie",           59.99, "Warm pullover hoodie.",            "Black", "Hoodie"));
        productRepo.save(new Product("Denim Jacket",     89.99, "Classic denim jacket.",            "Blue",  "Jacket"));
        productRepo.save(new Product("Running Shorts",   29.99, "Lightweight running shorts.",      "Black", "Shorts"));

        System.out.println("✅ Seeded " + productRepo.count() + " products.");
    }
}