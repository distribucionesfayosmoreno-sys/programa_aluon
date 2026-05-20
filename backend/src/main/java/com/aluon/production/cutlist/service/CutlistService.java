package com.aluon.production.cutlist.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;
import com.aluon.production.cutlist.model.Cutlist;
import com.aluon.production.cutlist.model.CutlistCalculator;
import com.aluon.production.cutlist.model.CutlistItem;
import com.aluon.production.cutlist.dto.CutlistItemDto;
import com.aluon.production.cutlist.repository.CutlistRepository;
import com.aluon.production.cutlist.dto.CutlistRequestDto;
import com.aluon.production.cutlist.dto.CutlistResponseDto;
import com.aluon.production.cutlist.model.DoorType;
import com.aluon.production.order.model.Order;
import com.aluon.production.order.model.OrderWorkflowStep;
import com.aluon.production.order.repository.OrderRepository;


@Service
@RequiredArgsConstructor
@Transactional
public class CutlistService {

    private final CutlistRepository cutlistRepository;
    private final CutlistCalculator cutlistCalculator;
    private final OrderRepository orderRepository;

    public CutlistResponseDto generate(CutlistRequestDto request) {
        validate(request);

        List<CutlistCalculator.CutlistLine> lines = cutlistCalculator.generate(request);
        if (lines.isEmpty()) {
            throw new IllegalArgumentException("No se pudo generar el despiece con los parámetros indicados");
        }

        String budgetNumber = normalize(request.getBudgetNumber());
        if (budgetNumber == null) {
            budgetNumber = generateBudgetNumber(request.getBudgetDate());
        }

        Cutlist cutlist = Cutlist.builder()
                .distributor(normalize(request.getDistributor()))
                .budgetNumber(budgetNumber)
                .budgetDate(request.getBudgetDate())
                .color(normalize(request.getColor()))
                .installerName(normalize(request.getInstallerName()))
                .doorType(request.getDoorType())
                .doorModel(request.getModel())
                .widthMm(request.getWidthMm())
                .heightMm(request.getHeightMm())
                .heightLeftMm(request.getHeightLeftMm())
                .heightRightMm(request.getHeightRightMm())
                .widthLeftMm(request.getWidthLeftMm())
                .widthRightMm(request.getWidthRightMm())
                .groundClearanceMm(request.getGroundClearanceMm())
                .largueroMm(request.getLargueroMm())
                .topFrame(request.getTopFrame())
                .hingesSide(request.getHingesSide())
                .porterAutomatic(request.getPorterAutomatic())
                .automationIncluded(request.getAutomationIncluded())
                .automationReinforcement(request.getAutomationReinforcement())
                .openingSide(request.getOpeningSide())
                .railType(request.getRailType())
                .mountingType(request.getMountingType())
                .tail(request.getTail())
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .build();

        List<CutlistItem> items = IntStream.range(0, lines.size())
                .mapToObj(index -> {
                    CutlistCalculator.CutlistLine line = lines.get(index);
                    return CutlistItem.builder()
                            .sortIndex(index)
                            .description(line.description())
                            .units(line.units())
                            .cutMeasure(line.cutMeasure())
                            .build();
                })
                .toList();

        cutlist.setItems(items);
        Cutlist saved = cutlistRepository.save(cutlist);
        linkOrderAndAdvanceWorkflow(request.getRequestId(), saved);
        return toResponse(saved);
    }

    public CutlistResponseDto findById(UUID id) {
        UUID cutlistId = Objects.requireNonNull(id, "id");
        Cutlist cutlist = cutlistRepository.findById(cutlistId)
                .orElseThrow(() -> new IllegalArgumentException("Despiece no encontrado"));
        return toResponse(cutlist);
    }

    private CutlistResponseDto toResponse(Cutlist cutlist) {
        List<CutlistItemDto> itemDtos = cutlist.getItems().stream()
                .sorted((a, b) -> Integer.compare(a.getSortIndex(), b.getSortIndex()))
                .map(item -> CutlistItemDto.builder()
                        .description(item.getDescription())
                        .units(item.getUnits())
                        .cutMeasure(item.getCutMeasure())
                        .build())
                .toList();

        return CutlistResponseDto.builder()
                .id(cutlist.getId())
                .distributor(cutlist.getDistributor())
                .budgetNumber(cutlist.getBudgetNumber())
                .budgetDate(cutlist.getBudgetDate())
                .color(cutlist.getColor())
                .installerName(cutlist.getInstallerName())
                .doorType(cutlist.getDoorType())
                .model(cutlist.getDoorModel())
                .widthMm(cutlist.getWidthMm())
                .heightMm(cutlist.getHeightMm())
                .heightLeftMm(cutlist.getHeightLeftMm())
                .heightRightMm(cutlist.getHeightRightMm())
                .widthLeftMm(cutlist.getWidthLeftMm())
                .widthRightMm(cutlist.getWidthRightMm())
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
                .items(itemDtos)
                .build();
    }

    private void validate(CutlistRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud de despiece es obligatoria");
        }
        if (request.getRequestId() == null || request.getRequestId().isBlank()) {
            throw new IllegalArgumentException("La orden es obligatoria");
        }
        if (request.getDoorType() == null) {
            throw new IllegalArgumentException("El tipo de puerta es obligatorio");
        }
        if (request.getModel() == null) {
            throw new IllegalArgumentException("El modelo es obligatorio");
        }
        if (request.getWidthMm() == null || request.getWidthMm() <= 0) {
            throw new IllegalArgumentException("La anchura debe ser mayor que 0");
        }
        if (request.getHeightMm() == null || request.getHeightMm() <= 0) {
            throw new IllegalArgumentException("La altura debe ser mayor que 0");
        }
        if (request.getDistributor() != null && request.getDistributor().isBlank()) {
            throw new IllegalArgumentException("El distribuidor no puede estar vacío");
        }
        if (request.getBudgetNumber() != null && request.getBudgetNumber().isBlank()) {
            throw new IllegalArgumentException("El nº de presupuesto no puede estar vacío");
        }
        if (request.getColor() != null && request.getColor().isBlank()) {
            throw new IllegalArgumentException("El color no puede estar vacío");
        }

        switch (request.getDoorType()) {
            case PEATONAL, ABATIBLE_UNA, ABATIBLE_DOS -> {
                if (request.getGroundClearanceMm() == null || request.getGroundClearanceMm() < 0) {
                    throw new IllegalArgumentException("La holgura con el suelo es obligatoria");
                }
                if (request.getLargueroMm() == null || (request.getLargueroMm() != 50 && request.getLargueroMm() != 80)) {
                    throw new IllegalArgumentException("El larguero debe ser 50 o 80 mm");
                }
                if (request.getTopFrame() == null) {
                    throw new IllegalArgumentException("Debe indicar si lleva marco superior");
                }
                if ((request.getDoorType() == DoorType.ABATIBLE_UNA || request.getDoorType() == DoorType.ABATIBLE_DOS)
                        && request.getAutomationIncluded() != null
                        && request.getAutomationReinforcement() == null) {
                    throw new IllegalArgumentException("Debe indicar si lleva refuerzo de automatización");
                }
            }
            case CORREDERA -> {
                if (request.getRailType() == null) {
                    throw new IllegalArgumentException("Debe indicar el carril");
                }
                if (request.getMountingType() == null) {
                    throw new IllegalArgumentException("Debe indicar el montaje");
                }
                if (request.getTail() == null) {
                    throw new IllegalArgumentException("Debe indicar si lleva cola");
                }
                if (request.getAutomationReinforcement() == null) {
                    throw new IllegalArgumentException("Debe indicar si lleva refuerzo de automatización");
                }
            }
            case VALLA -> {
                // No fields adicionales
            }
        }
    }

    private String generateBudgetNumber(LocalDate budgetDate) {
        LocalDate date = budgetDate != null ? budgetDate : LocalDate.now();
        String datePart = date.format(DateTimeFormatter.BASIC_ISO_DATE);
        int suffix = ThreadLocalRandom.current().nextInt(1000, 10000);
        return "P-" + datePart + "-" + suffix;
    }

    private void linkOrderAndAdvanceWorkflow(String requestId, Cutlist cutlist) {
        if (requestId == null || requestId.isBlank()) {
            return;
        }
        Order order = resolveOrder(requestId.trim());
        if (order == null) {
            return;
        }
        order.setCutlist(cutlist);
        if (isForwardTransition(order.getWorkflowStep(), OrderWorkflowStep.DEV)) {
            order.setWorkflowStep(OrderWorkflowStep.DEV);
            order.setWorkflowStage(OrderWorkflowStep.DEV.name());
        }
        orderRepository.save(order);
    }

    private boolean isForwardTransition(OrderWorkflowStep current, OrderWorkflowStep next) {
        List<OrderWorkflowStep> steps = List.of(
                OrderWorkflowStep.INBOX,
                OrderWorkflowStep.REQUEST,
                OrderWorkflowStep.BUDGET,
                OrderWorkflowStep.VALIDATION,
                OrderWorkflowStep.DEV,
                OrderWorkflowStep.PROD,
                OrderWorkflowStep.FINAL
        );
        int currentIndex = steps.indexOf(current);
        int nextIndex = steps.indexOf(next);
        if (currentIndex == -1 || nextIndex == -1) {
            return false;
        }
        return nextIndex > currentIndex;
    }

    private Order resolveOrder(String requestId) {
        try {
            UUID orderId = UUID.fromString(requestId);
            return orderRepository.findById(orderId).orElse(null);
        } catch (IllegalArgumentException ignored) {
            return orderRepository.findByCodigoOrden(requestId).orElse(null);
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
