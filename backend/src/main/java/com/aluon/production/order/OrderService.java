package com.aluon.production.order;

import com.aluon.crm.customer.Customer;
import com.aluon.production.cutlist.Cutlist;
import com.aluon.production.cutlist.CutlistItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;

    public List<OrderStatusDto> listOrderStatuses() {
        return orderRepository.findAllByOrderByCodigoOrdenDesc().stream()
                .map(order -> OrderStatusDto.builder()
                        .id(order.getId())
                        .codigoOrden(order.getCodigoOrden())
                        .estado(order.getEstado())
                        .workflowStep(order.getWorkflowStep())
                        .customerName(order.getCustomer().getNombreComercial() != null
                                ? order.getCustomer().getNombreComercial()
                                : order.getCustomer().getRazonSocial())
                        .build())
                .toList();
    }

    public WorkOrderDto getWorkOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orden de trabajo no encontrada"));

        Cutlist cutlist = order.getCutlist();
        if (cutlist == null) {
            throw new IllegalArgumentException("La orden no tiene despiece asociado");
        }

        Customer customer = order.getCustomer();
        List<String> addressParts = new java.util.ArrayList<>();
        if (customer.getDireccion() != null && !customer.getDireccion().isBlank()) {
            addressParts.add(customer.getDireccion());
        }
        if (customer.getCp() != null && !customer.getCp().isBlank()) {
            addressParts.add(customer.getCp());
        }
        if (customer.getPoblacion() != null && !customer.getPoblacion().isBlank()) {
            addressParts.add(customer.getPoblacion());
        }
        if (customer.getProvincia() != null && !customer.getProvincia().isBlank()) {
            addressParts.add(customer.getProvincia());
        }
        String address = String.join(" · ", addressParts);

        List<WorkOrderItemDto> items = cutlist.getItems().stream()
                .sorted(Comparator.comparing(CutlistItem::getSortIndex))
                .map(item -> WorkOrderItemDto.builder()
                        .description(item.getDescription())
                        .units(item.getUnits())
                        .cutMeasure(item.getCutMeasure())
                        .build())
                .toList();

        return WorkOrderDto.builder()
                .id(order.getId())
                .codigoOrden(order.getCodigoOrden())
                .estado(order.getEstado())
                .workflowStep(order.getWorkflowStep())
                .customerId(customer.getId())
                .customerName(customer.getNombreComercial() != null ? customer.getNombreComercial() : customer.getRazonSocial())
                .customerAddress(address)
                .customerPhone(customer.getTelefono())
                .modeloPuerta(order.getModeloPuerta())
                .anchoMm(order.getAnchoMm())
                .altoMm(order.getAltoMm())
                .cutlistId(cutlist.getId())
                .distributor(cutlist.getDistributor())
                .budgetNumber(cutlist.getBudgetNumber())
                .budgetDate(cutlist.getBudgetDate())
                .color(cutlist.getColor())
                .doorType(cutlist.getDoorType())
                .doorModel(cutlist.getDoorModel())
                .widthMm(cutlist.getWidthMm())
                .heightMm(cutlist.getHeightMm())
                .groundClearanceMm(cutlist.getGroundClearanceMm())
                .largueroMm(cutlist.getLargueroMm())
                .topFrame(cutlist.getTopFrame())
                .hingesSide(cutlist.getHingesSide())
                .porterAutomatic(cutlist.getPorterAutomatic())
                .automationIncluded(cutlist.getAutomationIncluded())
                .automationReinforcement(cutlist.getAutomationReinforcement())
                .openingSide(cutlist.getOpeningSide())
                .railType(cutlist.getRailType())
                .mountingType(cutlist.getMountingType())
                .tail(cutlist.getTail())
                .notes(cutlist.getNotes())
                .createdAt(cutlist.getCreatedAt())
                .items(items)
                .build();
    }
}
