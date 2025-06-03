package com.nom.payment_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nom.payment_service.dto.PaymentStatusDTO;
import com.nom.payment_service.enums.PaymentStatus;
import com.nom.payment_service.kafka.producer.PaymentProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    @Autowired
    private PaymentProducer paymentProducer;
    public void processPayment(Long id) throws JsonProcessingException {
        boolean paymentSuccess = new Random().nextBoolean(); // simulate random success/failure

        PaymentStatusDTO statusDTO = new PaymentStatusDTO();
        statusDTO.setOrderId(id);
        statusDTO.setStatus(paymentSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);

        paymentProducer.sendPaymentStatus(statusDTO);

        log.info("Processed payment for order " + id + " | Status: " + statusDTO.getStatus());
    }
}
