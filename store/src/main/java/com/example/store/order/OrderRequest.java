package com.example.store.order;

import java.util.List;

public class OrderRequest {
    private Long addressId;
    private List<OrderItemRequest> items;

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}