package com.nom.payment_service.dto;

import com.nom.payment_service.enums.PaymentStatus;

public class PaymentStatusDTO {
    private Long orderId;
    private PaymentStatus status; // SUCCESS or FAILED
    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    public PaymentStatus getStatus() {
        return status;
    }
    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
}
