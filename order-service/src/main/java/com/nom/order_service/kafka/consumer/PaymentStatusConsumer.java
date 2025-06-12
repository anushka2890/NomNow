package com.nom.order_service.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.order_service.DTO.PaymentStatusDTO;
import com.nom.order_service.enums.OrderStatus;
import com.nom.order_service.enums.PaymentStatus;
import com.nom.order_service.model.Order;
import com.nom.order_service.repository.OrderRepository;
import org.aspectj.weaver.ast.Or;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentStatusConsumer {

    private static final Logger log = LoggerFactory.getLogger(PaymentStatusConsumer.class);
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "payment_status", groupId = "nomnow-group")
    public void consumePaymentStatus(String message) throws JsonProcessingException {
        PaymentStatusDTO paymentStatus = objectMapper.readValue(message, PaymentStatusDTO.class);
        Optional<Order> optionalOrder = orderRepository.findById(paymentStatus.getOrderId());
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (paymentStatus.getStatus().equals(PaymentStatus.SUCCESS)){
                order.setOrderStatus(OrderStatus.PAYMENT_SUCCESS);
            }else{
                order.setOrderStatus(OrderStatus.PAYMENT_FAILED);
            }
            orderRepository.save(order);
            log.info("Updated order status to {}", paymentStatus.getStatus());
        } else {
            log.error("Order ID not found: {}", paymentStatus.getOrderId());
        }
    }
}
