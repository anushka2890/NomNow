package com.nom.order_service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.order_service.DTO.OrderResponseDTO;
import com.nom.order_service.DTO.OrderStatusFromRestaurantDTO;
import com.nom.order_service.model.Order;
import com.nom.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderConfirmedListener {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepository orderRepository;

    private static final Logger log = LoggerFactory.getLogger(OrderConfirmedListener.class);

    @KafkaListener(topics = "order_confirmed", groupId = "order-group")
    public void handleOrderConfirmed(String message){
        try {
            OrderStatusFromRestaurantDTO confirmedOrder = objectMapper.readValue(message, OrderStatusFromRestaurantDTO.class);
            log.info("Received order confirmation: {}", confirmedOrder);
            Optional<Order> optionalOrder = orderRepository.findById(confirmedOrder.getId());
            if (optionalOrder.isPresent()){
                Order order = optionalOrder.get();
                order.setOrderStatus(confirmedOrder.getStatus());
                orderRepository.save(order);
                log.info("Order {} status updated to {} ", order.getId(), order.getOrderStatus());
            } else {
                log.warn("Order ID {} not found in DB", confirmedOrder.getId());
            }
        } catch (Exception e) {
            log.error("Failed to handle order_confirmed message", e);
        }
    }
}
