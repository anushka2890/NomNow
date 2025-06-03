package com.nom.restaurant_service.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.restaurant_service.DTO.OrderDTO;
import com.nom.restaurant_service.kafka.producer.KafkaProducerService;
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
        OrderDTO orderDTO = new OrderDTO();
        try{
            orderDTO = objectMapper.readValue(message, OrderDTO.class);
            log.info("Received new order: {}", orderDTO);
            kafkaProducerService.sendOrderConfirmedMessage(orderDTO);
        } catch (Exception e){
            log.error("Failed to process order_placed message: {}", orderDTO, e);
        }
    }
}
