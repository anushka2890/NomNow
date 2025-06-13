package com.nom.order_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nom.order_service.DTO.OrderRequestDTO;
import com.nom.order_service.DTO.OrderResponseDTO;
import com.nom.order_service.DTO.UpdateStatusRequest;
import com.nom.order_service.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Controller", description = "Manage food orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new order")
    public ResponseEntity<OrderResponseDTO> placeOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO) throws JsonProcessingException {
        return ResponseEntity.ok(orderService.placeOrder(orderRequestDTO));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get orders for user by ID")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{orderId}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long orderId, @RequestParam UpdateStatusRequest request) {
        orderService.updateOrderStatus(orderId, request.getNewStatus());
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @DeleteMapping
    @Operation(summary = "Delete order by ID")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{orderId}/cancel")
    @Operation(summary = "Cancel order")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }
}
