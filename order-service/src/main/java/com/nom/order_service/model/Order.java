package com.nom.order_service.model;

import com.nom.order_service.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User Id is required")
    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Order Status is required")
    private OrderStatus orderStatus;

    @Column(nullable = false)
    @NotNull(message = "Order Date is required")
    private LocalDateTime orderDate;

    @Column(nullable = false)
    @NotNull(message = "Total Amount is required")
    private double totalAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @NotEmpty(message = "Order Items are required")
    private List<OrderItem> orderItems;

    @Column(nullable = false)
    @NotEmpty(message = "Delivery Address is required")
    private String deliveryAddress;

    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull(message = "User Id is required") Long getUserId() {
        return userId;
    }

    public void setUserId(@NotNull(message = "User Id is required") Long userId) {
        this.userId = userId;
    }

    public @NotNull(message = "Order Status is required") OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(@NotNull(message = "Order Status is required") OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public @NotNull(message = "Order Date is required") LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(@NotNull(message = "Order Date is required") LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    @NotNull(message = "Total Amount is required")
    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(@NotNull(message = "Total Amount is required") double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public @NotEmpty(message = "Order Items are required") List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(@NotEmpty(message = "Order Items are required") List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public @NotEmpty(message = "Delivery Address is required") String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(@NotEmpty(message = "Delivery Address is required") String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
