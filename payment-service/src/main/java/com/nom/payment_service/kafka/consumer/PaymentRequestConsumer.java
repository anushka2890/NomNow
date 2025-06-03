package com.nom.payment_service.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.payment_service.dto.PaymentRequestDTO;
import com.nom.payment_service.enums.OrderStatus;
import com.nom.payment_service.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class PaymentRequestConsumer {
    private static final Logger log = LoggerFactory.getLogger(PaymentRequestConsumer.class);
    private static final String TOPIC = "payment_request";

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = TOPIC, groupId = "payment-group")
    public void consumeOrderConfirmedForPayment(String message) throws JsonProcessingException {
        PaymentRequestDTO paymentRequestDTO = objectMapper.readValue(message, PaymentRequestDTO.class);
        if(paymentRequestDTO.getStatus() == OrderStatus.PAYMENT_PENDING){
            paymentService.processPayment(paymentRequestDTO.getOrderId());
        } else {
            log.info("Skipping payment for cancelled order: " + paymentRequestDTO.getOrderId());
        }
    }
}
