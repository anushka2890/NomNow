package com.nom.order_service.DTO;

import com.nom.order_service.enums.PaymentStatus;

public class PaymentStatusDTO {
    private Long orderId;
    private PaymentStatus status; // EXPECTED: PAID or PAYMENT_FAILED

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
