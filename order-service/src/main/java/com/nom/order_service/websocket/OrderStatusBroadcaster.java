package com.nom.order_service.websocket;

import com.nom.order_service.DTO.OrderResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderStatusBroadcaster {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendStatusUpdate(OrderResponseDTO orderDTO) {
        messagingTemplate.convertAndSend("/topic/order-status/" + orderDTO.getOrderId(), orderDTO);
    }
}
