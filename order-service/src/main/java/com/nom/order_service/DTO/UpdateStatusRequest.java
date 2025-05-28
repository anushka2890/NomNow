package com.nom.order_service.DTO;
import com.nom.order_service.enums.OrderStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    public OrderStatus newStatus;

    public OrderStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(OrderStatus newStatus) {
        this.newStatus = newStatus;
    }
}
