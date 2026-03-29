package com.aluon.production.order.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;
import java.util.UUID;
import com.aluon.production.order.service.OrderService;
import com.aluon.production.order.dto.OrderStatusDto;
import com.aluon.production.order.dto.WorkOrderDto;
import com.aluon.production.order.dto.WorkOrderRequestDto;
import com.aluon.production.order.dto.WorkOrderRequestResponseDto;


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

    @PostMapping(value = "/requests", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WorkOrderRequestResponseDto> createRequest(@ModelAttribute WorkOrderRequestDto request) {
        return ResponseEntity.ok(orderService.createWorkOrderRequest(request));
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable UUID id) {
        orderService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
