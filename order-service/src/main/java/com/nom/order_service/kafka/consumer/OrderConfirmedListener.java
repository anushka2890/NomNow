package com.nom.order_service.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.order_service.DTO.OrderStatusFromRestaurantDTO;
import com.nom.order_service.DTO.PaymentRequestDTO;
import com.nom.order_service.enums.OrderStatus;
import com.nom.order_service.kafka.producer.PaymentRequestProducer;
import com.nom.order_service.model.Order;
import com.nom.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
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

    @Autowired
    private PaymentRequestProducer paymentRequestProducer;

    private static final Logger log = LoggerFactory.getLogger(OrderConfirmedListener.class);

    @KafkaListener(topics = "order_confirmed", groupId = "order-group")
    public void handleOrderConfirmed(String message){
        OrderStatusFromRestaurantDTO confirmedOrder = new OrderStatusFromRestaurantDTO();
        try {
            confirmedOrder = objectMapper.readValue(message, OrderStatusFromRestaurantDTO.class);
            log.info("Received order confirmation: {}", confirmedOrder);
            Optional<Order> optionalOrder = orderRepository.findById(confirmedOrder.getId());
            if (optionalOrder.isPresent()){
                Order order = optionalOrder.get();
                if(OrderStatus.CONFIRMED.equals(confirmedOrder.getStatus())){
                    order.setOrderStatus(OrderStatus.CONFIRMED);
                    order.setOrderStatus(OrderStatus.PAYMENT_PENDING);
                    orderRepository.save(order);

                    PaymentRequestDTO paymentDTO = new PaymentRequestDTO();
                    paymentDTO.setOrderId(order.getId());
                    paymentDTO.setAmount(order.getTotalAmount());
                    paymentDTO.setPaymentMethod("CARD");
                    paymentDTO.setStatus(order.getOrderStatus());
                    paymentRequestProducer.sendPaymentRequest(paymentDTO);
                } else if ("REJECTED".equals(confirmedOrder.getStatus())) {
                    order.setOrderStatus(OrderStatus.REJECTED);
                    orderRepository.save(order);
                } else {
                    order.setOrderStatus(OrderStatus.CANCELLED);
                    orderRepository.save(order);
                }
            } else {
                log.warn("Order ID {} not found in DB", confirmedOrder.getId());
            }
        } catch (Exception e) {
            log.error("Failed to handle order_confirmed message", e);
        }
    }
}
