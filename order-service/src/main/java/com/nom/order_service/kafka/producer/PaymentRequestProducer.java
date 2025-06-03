package com.nom.order_service.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.order_service.DTO.PaymentRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentRequestProducer {
    private static final Logger log = LoggerFactory.getLogger(PaymentRequestProducer.class);

    private static final String TOPIC = "payment_request";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendPaymentRequest(PaymentRequestDTO paymentRequestDTO) throws JsonProcessingException {
        String jsonPayload = objectMapper.writeValueAsString(paymentRequestDTO);
        kafkaTemplate.send(TOPIC, jsonPayload);
        log.info("Sent payment request for Order ID: {}", paymentRequestDTO.getOrderId());
    }
}
