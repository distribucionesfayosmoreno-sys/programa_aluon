package com.aluon.production.order;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{id}/work-order")
    public ResponseEntity<WorkOrderDto> getWorkOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getWorkOrder(id));
    }

    @GetMapping("/status")
    public ResponseEntity<List<OrderStatusDto>> listOrderStatuses() {
        return ResponseEntity.ok(orderService.listOrderStatuses());
    }
}
