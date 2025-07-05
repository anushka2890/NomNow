package com.nom.order_service.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.order_service.DTO.PaymentStatusDTO;
import com.nom.order_service.enums.OrderStatus;
import com.nom.order_service.enums.PaymentStatus;
import com.nom.order_service.mapper.OrderMapper;
import com.nom.order_service.model.Order;
import com.nom.order_service.repository.OrderRepository;
import com.nom.order_service.websocket.OrderStatusBroadcaster;
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

    @Autowired
    private OrderStatusBroadcaster orderStatusBroadcaster;

    @KafkaListener(topics = "payment_status", groupId = "nomnow-group")
    public void consumePaymentStatus(String message) throws JsonProcessingException {
        PaymentStatusDTO paymentStatus = objectMapper.readValue(message, PaymentStatusDTO.class);
        Optional<Order> optionalOrder = orderRepository.findByIdWithItems(paymentStatus.getOrderId());
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (paymentStatus.getStatus().equals(PaymentStatus.SUCCESS)){
                order.setOrderStatus(OrderStatus.PAYMENT_SUCCESS);
            }else{
                order.setOrderStatus(OrderStatus.PAYMENT_FAILED);
            }
            orderRepository.save(order);
            orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(order));
            log.info("Updated order status to {}", paymentStatus.getStatus());
            if(order.getOrderStatus().equals(OrderStatus.PAYMENT_SUCCESS)){
                // After setting PAYMENT_SUCCESS
                new Thread(() -> {
                    try {
                        Thread.sleep(30000); // 3s delay - preparing
                        order.setOrderStatus(OrderStatus.PREPARING);
                        orderRepository.save(order);
                        orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(order));

                        Thread.sleep(30000); // 3s delay - out for delivery
                        order.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);
                        orderRepository.save(order);
                        orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(order));

                        Thread.sleep(50000); // 5s delay - delivered
                        order.setOrderStatus(OrderStatus.DELIVERED);
                        orderRepository.save(order);
                        orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(order));

                        log.info("Order {} has been delivered", order.getId());
                    } catch (InterruptedException e) {
                        log.error("Error simulating order lifecycle", e);
                    }
                }).start();
            }
        } else {
            log.error("Order ID not found: {}", paymentStatus.getOrderId());
        }
    }
}
