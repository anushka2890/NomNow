package com.nom.restaurant_service.kafka;

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
    private KafkaTemplate<String, OrderConfirmedDTO> kafkaTemplate;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public void sendOrderConfirmedMessage(OrderDTO orderDTO) {
        OrderConfirmedDTO confirmedDTO = new OrderConfirmedDTO();
        confirmedDTO.setId(orderDTO.getOrderId());

        if (orderDTO.getRestaurantId() != null && restaurantRepository.existsById(orderDTO.getRestaurantId())) {
            boolean allItemsAvailable = processOrderItems(orderDTO.getItems(), orderDTO.getRestaurantId());
            confirmedDTO.setStatus(allItemsAvailable ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED);
        } else {
            confirmedDTO.setStatus(OrderStatus.CANCELLED);
        }

        kafkaTemplate.send(TOPIC_ORDER_CONFIRMED, confirmedDTO);
        log.info("Sent order confirmation with status: " + confirmedDTO.getStatus());
    }


    @Transactional
    public boolean processOrderItems(List<OrderItemDTO> orderItems, Long restaurantId) {
        for (OrderItemDTO item : orderItems) {
            Optional<MenuItem> menuItemOpt = menuItemRepository.findByIdAndRestaurant_Id(item.getProductId(), restaurantId);
            if (menuItemOpt.isEmpty()) {
                return false; // Menu item doesn't exist in this restaurant
            }
            MenuItem menuItem = menuItemOpt.get();

            int availableQuantity = menuItem.getAvailableQuantity();
            int orderedQuantity = item.getQuantity();

            if (availableQuantity < orderedQuantity) {
                return false; // Not enough stock
            }

            // Reduce stock
            menuItem.setAvailableQuantity(availableQuantity - orderedQuantity);
            menuItemRepository.save(menuItem);
        }
        return true;
    }


}
