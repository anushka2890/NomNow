package com.nom.order_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nom.order_service.DTO.OrderItemDTO;
import com.nom.order_service.DTO.OrderRequestDTO;
import com.nom.order_service.DTO.OrderResponseDTO;
import com.nom.order_service.enums.OrderStatus;
import com.nom.order_service.exception.OrderNotFound;
import com.nom.order_service.kafka.producer.RestaurantRequestProducer;
import com.nom.order_service.mapper.OrderMapper;
import com.nom.order_service.model.Order;
import com.nom.order_service.model.OrderItem;
import com.nom.order_service.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantRequestProducer restaurantRequestProducer;

    public OrderResponseDTO placeOrder(OrderRequestDTO orderRequestDTO) throws JsonProcessingException {
        log.info("Placing new order for userId={} with {} items", orderRequestDTO.getUserId(), orderRequestDTO.getItems().size());
        log.debug("Order details: {}", orderRequestDTO);

        Order order = new Order();
        order.setUserId(orderRequestDTO.getUserId());
        order.setOrderStatus(OrderStatus.PENDING); // set initial status to PENDING
        order.setOrderDate(LocalDateTime.now());
        order.setDeliveryAddress(orderRequestDTO.getAddress());
        order.setRestaurantId(orderRequestDTO.getRestaurantId());

        // convert DTO items to entity items and add to order
        for (OrderItemDTO itemDTO : orderRequestDTO.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(itemDTO.getProductId());
            orderItem.setQuantity(itemDTO.getQuantity());
            order.addOrderItem(orderItem); // addOrderItem sets both sides of the relation
        }

        Order savedOrder = orderRepository.save(order);
        OrderResponseDTO kafkaMessage = OrderMapper.toDTO(savedOrder);
        restaurantRequestProducer.sendRestaurantRequest(kafkaMessage);

        log.info("Order placed: {}", savedOrder);
        return OrderMapper.toDTO(savedOrder);
    }


    public OrderResponseDTO getOrderById(Long orderId) {
        log.info("Fetching order with ID={}", orderId);
        return OrderMapper.toDTO(orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.warn("Order not found with ID={}", orderId);
                    return new OrderNotFound("Order not found with ID: " + orderId);
                }));
    }

    public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
        log.info("Fetching all orders for userId={}", userId);
        List<Order> order = orderRepository.findAllByUserId(userId);
        return order.stream().map(OrderMapper::toDTO).toList();
    }

    public void updateOrderStatus(Long orderId, OrderStatus newStatus) {
        log.info("Updating status for orderId={} to {}", orderId, newStatus);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.warn("Order not found with ID={}", orderId);
                    return new OrderNotFound("Order not found with ID: " + orderId);
                });

        order.setOrderStatus(newStatus);
        orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new OrderNotFound("Order not found with ID: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }

    public OrderResponseDTO cancelOrder(Long orderId) {
        log.info("Cancelling order with ID={}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.warn("Order not found with ID={}", orderId);
                    return new OrderNotFound("Order not found with ID: " + orderId);
                });
        order.setOrderStatus(OrderStatus.CANCELLED);
        return OrderMapper.toDTO(orderRepository.save(order));
    }

    public List<OrderResponseDTO> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAll().stream().map(OrderMapper::toDTO).toList();
    }
}
