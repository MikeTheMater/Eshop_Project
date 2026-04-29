package com.example.store.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.store.exception.DuplicateProductException;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Product create(ProductRequest request) {

        if (repository.existsByNameIgnoreCaseAndColorIgnoreCase(
                request.getName(), request.getColor())) {

            throw new DuplicateProductException("Product with same name and color already exists");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setColor(request.getColor());
        product.setType(request.getType());

        return repository.save(product);
    }

    public Page<Product> getAll(int page, int size, String sortBy, String name) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        if (name != null && !name.isEmpty()) {
            return repository.findByNameContainingIgnoreCase(name, pageable);
        }

        return repository.findAll(pageable);
    }
}