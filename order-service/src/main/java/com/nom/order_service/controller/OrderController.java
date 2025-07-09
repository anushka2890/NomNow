package com.nom.order_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nom.order_service.DTO.OrderRequestDTO;
import com.nom.order_service.DTO.OrderResponseDTO;
import com.nom.order_service.DTO.UpdateStatusRequest;
import com.nom.order_service.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<OrderResponseDTO> placeOrder(
            @Valid @RequestBody OrderRequestDTO orderRequestDTO,
            @RequestHeader(value = "X-User-Id") String userIdHeader)
            throws JsonProcessingException
    {
        long userId;
        try {
            userId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // or throw exception
        }
        OrderResponseDTO createdOrder = orderService.placeOrder(orderRequestDTO, userId);
        return ResponseEntity.ok(createdOrder);
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

    @GetMapping("/test")
    public String testGateway(HttpServletRequest request) {
        String fromGateway = request.getHeader("X-From-Gateway");
        System.out.println("🔍 Was request from API Gateway? => " + fromGateway);
        return "Order service reached. From gateway: " + fromGateway;
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<String> fetchOrderStatus(@PathVariable Long orderId){
        return ResponseEntity.ok(orderService.getOrderById(orderId).getStatus().toString());
    }
}
