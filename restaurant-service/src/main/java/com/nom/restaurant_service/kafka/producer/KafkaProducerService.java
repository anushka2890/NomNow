package com.nom.restaurant_service.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.restaurant_service.DTO.OrderConfirmedDTO;
import com.nom.restaurant_service.DTO.OrderDTO;
import com.nom.restaurant_service.DTO.OrderItemDTO;
import com.nom.restaurant_service.enums.OrderStatus;
import com.nom.restaurant_service.model.MenuItem;
import com.nom.restaurant_service.repository.MenuItemRepository;
import com.nom.restaurant_service.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);
    private static final String TOPIC_ORDER_CONFIRMED = "order_confirmed";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendOrderConfirmedMessage(OrderDTO orderDTO) throws JsonProcessingException {
        OrderConfirmedDTO confirmedDTO = new OrderConfirmedDTO();
        confirmedDTO.setId(orderDTO.getOrderId());

        if (orderDTO.getRestaurantId() != null && restaurantRepository.existsById(orderDTO.getRestaurantId())) {
            boolean allItemsAvailable = processOrderItems(orderDTO.getItems(), orderDTO.getRestaurantId());
            confirmedDTO.setStatus(allItemsAvailable ? OrderStatus.CONFIRMED : OrderStatus.REJECTED);
        } else {
            confirmedDTO.setStatus(OrderStatus.CANCELLED);
        }
        String jsonPayload = objectMapper.writeValueAsString(confirmedDTO);
        kafkaTemplate.send(TOPIC_ORDER_CONFIRMED, jsonPayload);
        log.info("Sent order confirmation with status: " + confirmedDTO.getStatus());
    }


    @Transactional
    public boolean processOrderItems(List<OrderItemDTO> orderItems, Long restaurantId) {
        for (OrderItemDTO item : orderItems) {
            Optional<MenuItem> menuItemOpt = menuItemRepository.findByIdAndRestaurant_Id(item.getProductId(), restaurantId);
            if (menuItemOpt.isEmpty()) {
                log.warn("Menu item with productId={} not found for restaurantId={}", item.getProductId(), restaurantId);
                return false;
            }
            MenuItem menuItem = menuItemOpt.get();

            int availableQuantity = menuItem.getAvailableQuantity();
            int orderedQuantity = item.getQuantity();

            if (availableQuantity < orderedQuantity) {
                log.warn("Insufficient quantity for productId={} in restaurantId={}. Available={}, Ordered={}",
                        item.getProductId(), restaurantId, availableQuantity, orderedQuantity);
                return false;
            }

            // Reduce stock
            menuItem.setAvailableQuantity(availableQuantity - orderedQuantity);
            menuItemRepository.save(menuItem);
        }
        return true;
    }


}
