package com.nom.restaurant_service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.restaurant_service.DTO.OrderDTO;
import com.nom.restaurant_service.enums.OrderStatus;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderPlacedListener {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaTemplate kafkaTemplate;

    private static final String ORDER_CONFIRMED_TOPIC = "order_confirmed";

    private static final Logger log = LoggerFactory.getLogger(OrderPlacedListener.class);

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @KafkaListener(topics = "order_placed", groupId = "restaurant-group")
    public void handleOrderPlaced(String message){
        try{
            // Convert JSON to DTO or Order entity
            OrderDTO orderDTO = objectMapper.readValue(message, OrderDTO.class);
            log.info("Received new order: {}", orderDTO);
            kafkaProducerService.sendOrderConfirmedMessage(orderDTO);
        } catch (Exception e){
            log.error("Failed to process order_placed message: {}", message, e);
        }
    }
}
