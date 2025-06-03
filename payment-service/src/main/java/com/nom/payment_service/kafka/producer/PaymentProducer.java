package com.nom.payment_service.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.payment_service.dto.PaymentStatusDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentProducer {
    private static final String TOPIC_PAYMENT_STATUS = "payment_status";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendPaymentStatus(PaymentStatusDTO statusDTO) throws JsonProcessingException {
        String jsonPayload = objectMapper.writeValueAsString(statusDTO);
        kafkaTemplate.send(TOPIC_PAYMENT_STATUS, jsonPayload);
    }
}
