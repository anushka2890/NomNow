package com.nom.order_service.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.order_service.DTO.OrderResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class RestaurantRequestProducer {
    private static final Logger log = LoggerFactory.getLogger(RestaurantRequestProducer.class);
    private static final String TOPIC = "order_placed";
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;
    public void sendRestaurantRequest(OrderResponseDTO orderResponseDTO) throws JsonProcessingException {
        String jsonPayload = objectMapper.writeValueAsString(orderResponseDTO);
        kafkaTemplate.send(TOPIC, jsonPayload);
        log.info("Sent restaurant request for Order ID: {}", orderResponseDTO.getOrderId());
    }
}
