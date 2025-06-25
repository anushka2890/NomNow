package com.nom.order_service.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
@Data
public class OrderRequestDTO {
    @NotNull(message = "User Id is required")
    private Long userId;
    @NotEmpty(message = "Order Items are required")
    private List<OrderItemDTO> items;
    @NotBlank(message = "Delivery Address is required")
    private String address;
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    private double totalAmount;

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public @NotNull(message = "Restaurant ID is required") Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(@NotNull(message = "Restaurant ID is required") Long restaurantId) {
        this.restaurantId = restaurantId;
    }

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
