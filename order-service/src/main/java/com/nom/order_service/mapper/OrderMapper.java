package com.nom.order_service.mapper;

import com.nom.order_service.DTO.OrderItemDTO;
import com.nom.order_service.DTO.OrderResponseDTO;
import com.nom.order_service.model.Order;
import com.nom.order_service.model.OrderItem;

public class OrderMapper {
    public static OrderResponseDTO toDTO (Order order){
        OrderResponseDTO orderResponseDTO = new OrderResponseDTO();
        orderResponseDTO.setOrderId(order.getId());
        orderResponseDTO.setStatus(order.getOrderStatus());
        orderResponseDTO.setDeliveryAddress(order.getDeliveryAddress());
        orderResponseDTO.setOrderTime(order.getOrderDate());
        orderResponseDTO.setItems(order.getOrderItems().stream().map(OrderMapper::toItemDTO).toList());
        orderResponseDTO.setRestaurantId(order.getRestaurantId());
        orderResponseDTO.setUserId(order.getUserId());
        orderResponseDTO.setTotalAmount(order.getTotalAmount());
        return orderResponseDTO;
    }

    public static OrderItemDTO toItemDTO(OrderItem orderItem){
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        orderItemDTO.setProductId(orderItem.getProductId());
        orderItemDTO.setQuantity(orderItem.getQuantity());
        return orderItemDTO;
    }
}
