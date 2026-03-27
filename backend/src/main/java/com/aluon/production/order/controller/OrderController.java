package com.aluon.production.order.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import com.aluon.production.order.service.OrderService;
import com.aluon.production.order.dto.OrderStatusDto;
import com.aluon.production.order.dto.WorkOrderDto;


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
