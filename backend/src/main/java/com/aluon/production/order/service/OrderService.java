package com.aluon.production.order.service;

import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.service.CustomerService;
import com.aluon.core.user.model.Role;
import com.aluon.core.user.model.User;
import com.aluon.core.user.repository.UserRepository;
import com.aluon.production.cutlist.model.Cutlist;
import com.aluon.production.cutlist.model.CutlistItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import com.aluon.production.order.model.Order;
import com.aluon.production.order.model.OrderAttachment;
import com.aluon.production.order.model.OrderStatus;
import com.aluon.production.order.model.OrderWorkflowStep;
import com.aluon.production.order.repository.OrderRepository;
import com.aluon.production.order.dto.OrderStatusDto;
import com.aluon.production.order.dto.WorkOrderDto;
import com.aluon.production.order.dto.WorkOrderItemDto;
import com.aluon.production.order.dto.WorkOrderRequestDto;
import com.aluon.production.order.dto.WorkOrderRequestResponseDto;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final UserRepository userRepository;

    public List<OrderStatusDto> listOrderStatuses() {
        return orderRepository.findAllByOrderByCodigoOrdenDesc().stream()
                .map(order -> OrderStatusDto.builder()
                        .id(order.getId())
                        .customerId(order.getCustomer().getId())
                        .codigoOrden(order.getCodigoOrden())
                        .estado(order.getEstado())
                        .workflowStep(order.getWorkflowStep())
                        .customerName(order.getCustomer().getNombreComercial() != null
                                ? order.getCustomer().getNombreComercial()
                                : order.getCustomer().getRazonSocial())
                        .modeloPuerta(order.getModeloPuerta())
                        .anchoMm(order.getAnchoMm())
                        .altoMm(order.getAltoMm())
                        .notes(order.getNotes())
                        .color(order.getColor())
                        .installerName(order.getInstallerName())
                        .requestDate(order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate() : LocalDate.now())
                        .m2(calculateM2(order.getAnchoMm(), order.getAltoMm()))
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
                .installerName(cutlist.getInstallerName())
                .doorType(cutlist.getDoorType())
                .doorModel(cutlist.getDoorModel())
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
                .items(items)
                .build();
    }

    @Transactional
    public WorkOrderRequestResponseDto createWorkOrderRequest(WorkOrderRequestDto request) {
        validateRequest(request);

        Customer savedCustomer;
        if (request.getCustomerId() != null) {
            savedCustomer = customerService.findById(request.getCustomerId());
        } else {
            Customer customer = Customer.builder()
                    .nombreComercial(request.getCustomerName().trim())
                    .telefono(normalize(request.getCustomerPhone()))
                    .email(normalize(request.getCustomerEmail()))
                    .build();
            savedCustomer = customerService.save(customer);
        }

        Order order = Order.builder()
                .customer(savedCustomer)
                .codigoOrden(generateCodigoOrden())
                .modeloPuerta(request.getModeloPuerta().trim())
                .anchoMm(request.getAnchoMm())
                .altoMm(request.getAltoMm())
                .notes(normalize(request.getNotes()))
                .color(normalize(request.getColor()))
                .installerName(normalize(request.getInstallerName()))
                .createdAt(LocalDateTime.now())
                .estado(OrderStatus.PENDIENTE_MATERIAL)
                .workflowStep(OrderWorkflowStep.INBOX)
                .build();

        List<MultipartFile> attachments = request.getAttachments();
        if (attachments != null) {
            attachments.stream()
                    .filter(file -> !file.isEmpty())
                    .forEach(file -> order.addAttachment(buildAttachment(file)));
        }

        Order savedOrder = orderRepository.save(order);
        return WorkOrderRequestResponseDto.builder()
                .id(savedOrder.getId())
                .codigoOrden(savedOrder.getCodigoOrden())
                .build();
    }

    @Transactional
    public void deleteRequest(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));
        orderRepository.delete(order);
    }

    @Transactional
    public void updateWorkflowStep(String requestId, OrderWorkflowStep workflowStep, String authorizerUserId) {
        if (requestId == null || requestId.isBlank()) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        if (workflowStep == null) {
            throw new IllegalArgumentException("El estado es obligatorio");
        }

        Order order = resolveOrder(requestId.trim());
        if (order == null) {
            throw new IllegalArgumentException("Solicitud no encontrada");
        }
        if (order.getWorkflowStep() == workflowStep) {
            return;
        }
        if (isBackwardTransition(order.getWorkflowStep(), workflowStep)
                && workflowStep != OrderWorkflowStep.INBOX) {
            validateBackwardAuthorization(authorizerUserId);
        }
        order.setWorkflowStep(workflowStep);
        orderRepository.save(order);
    }

    private Order resolveOrder(String requestId) {
        try {
            UUID orderId = UUID.fromString(requestId);
            return orderRepository.findById(orderId).orElse(null);
        } catch (IllegalArgumentException ignored) {
            return orderRepository.findByCodigoOrden(requestId).orElse(null);
        }
    }

    private boolean isBackwardTransition(OrderWorkflowStep current, OrderWorkflowStep next) {
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
        return nextIndex < currentIndex;
    }

    private void validateBackwardAuthorization(String authorizerUserId) {
        if (authorizerUserId == null || authorizerUserId.isBlank()) {
            throw new IllegalArgumentException("Se requiere autorización ADMIN o DIOS para retroceder el estado");
        }
        Long userId;
        try {
            userId = Long.valueOf(authorizerUserId.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("El ID del autorizador debe ser numérico");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario autorizador no encontrado"));
        if (user.getRol() != Role.ADMIN && user.getRol() != Role.DIOS) {
            throw new IllegalArgumentException("Solo ADMIN o DIOS pueden autorizar retrocesos");
        }
    }

    private void validateRequest(WorkOrderRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        if (request.getCustomerId() == null
                && (request.getCustomerName() == null || request.getCustomerName().isBlank())) {
            throw new IllegalArgumentException("El cliente es obligatorio");
        }
        if (request.getModeloPuerta() == null || request.getModeloPuerta().isBlank()) {
            throw new IllegalArgumentException("El modelo es obligatorio");
        }
        if (request.getAnchoMm() == null || request.getAnchoMm() <= 0) {
            throw new IllegalArgumentException("La anchura debe ser mayor que 0");
        }
        if (request.getAltoMm() == null || request.getAltoMm() <= 0) {
            throw new IllegalArgumentException("La altura debe ser mayor que 0");
        }
    }

    private String generateCodigoOrden() {
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        for (int attempt = 0; attempt < 10; attempt++) {
            int random = ThreadLocalRandom.current().nextInt(1000, 9999);
            String code = "OT-" + datePart + "-" + random;
            if (!orderRepository.existsByCodigoOrden(code)) {
                return code;
            }
        }
        throw new IllegalStateException("No se pudo generar un código de orden");
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private OrderAttachment buildAttachment(MultipartFile file) {
        try {
            return OrderAttachment.builder()
                    .fileName(file.getOriginalFilename() == null ? "archivo" : file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .fileData(file.getBytes())
                    .createdAt(LocalDateTime.now())
                    .build();
        } catch (Exception ex) {
            throw new IllegalArgumentException("No se pudo leer el archivo adjunto");
        }
    }

    private Double calculateM2(Integer anchoMm, Integer altoMm) {
        if (anchoMm == null || altoMm == null) {
            return 0.0;
        }
        double value = (anchoMm.doubleValue() * altoMm.doubleValue()) / 1_000_000d;
        return Math.round(value * 10d) / 10d;
    }
}
