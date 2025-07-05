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
                orderRepository.save(order);
                orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(order));
                new Thread(() -> {
                    try {
                        Thread.sleep(30000);

                        // 🔐 Check latest status before proceeding
                        Optional<Order> maybe = orderRepository.findByIdWithItems(order.getId());
                        if (maybe.isEmpty() || maybe.get().getOrderStatus().equals(OrderStatus.CANCELLED)) return;

                        Order updated = maybe.get();
                        updated.setOrderStatus(OrderStatus.PREPARING);
                        orderRepository.save(updated);
                        orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(updated));

                        Thread.sleep(30000);

                        updated = maybe.get();
                        updated.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);
                        orderRepository.save(updated);
                        orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(updated));

                        Thread.sleep(50000);

                        updated = maybe.get();
                        updated.setOrderStatus(OrderStatus.DELIVERED);
                        orderRepository.save(updated);
                        orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(updated));

                        log.info("Order {} has been delivered", updated.getId());
                    } catch (InterruptedException e) {
                        log.error("Error simulating order lifecycle", e);
                    }
                }).start();
            }else{
                order.setOrderStatus(OrderStatus.PAYMENT_FAILED);
                orderRepository.save(order);
                orderStatusBroadcaster.sendStatusUpdate(OrderMapper.toDTO(order));
                log.info("Updated order status to PAYMENT_FAILED");
            }
        } else {
            log.error("Order ID not found: {}", paymentStatus.getOrderId());
        }
    }
}
