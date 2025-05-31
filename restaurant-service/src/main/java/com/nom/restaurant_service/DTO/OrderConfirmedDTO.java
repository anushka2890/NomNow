package com.nom.restaurant_service.DTO;

import com.nom.restaurant_service.enums.OrderStatus;
import lombok.Data;

public class OrderConfirmedDTO {
    private Long id;
    private OrderStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
