package com.nom.order_service.DTO;

import lombok.Data;

import java.util.List;
@Data
public class OrderRequestDTO {
    private Long userId;
    private List<OrderItemDTO> items;
    private String address;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
