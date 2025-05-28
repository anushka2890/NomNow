package com.nom.order_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @NotNull(message = "Order is required")
    private Order order;

    @Column(nullable = false)
    @NotNull(message = "Product Id is required")
    private Long productId;

    @Column(nullable = false)
    @NotNull(message = "Quantity is required")
    private int quantity;

    @Column(nullable = false)
    @NotNull(message = "Price is required")
    private double price;

    public void setOrder(Order order) {
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull(message = "Order is required") Order getOrder() {
        return order;
    }

    public @NotNull(message = "Product Id is required") Long getProductId() {
        return productId;
    }

    public void setProductId(@NotNull(message = "Product Id is required") Long productId) {
        this.productId = productId;
    }

    @NotNull(message = "Quantity is required")
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(@NotNull(message = "Quantity is required") int quantity) {
        this.quantity = quantity;
    }

    @NotNull(message = "Price is required")
    public double getPrice() {
        return price;
    }

    public void setPrice(@NotNull(message = "Price is required") double price) {
        this.price = price;
    }
}
