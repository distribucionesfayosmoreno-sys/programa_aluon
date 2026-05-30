package com.aluon.dashboard.service;

import com.aluon.production.order.repository.OrderRepository;
import com.aluon.production.order.model.OrderStatus;
import com.aluon.production.order.model.OrderWorkflowStep;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import com.aluon.dashboard.dto.DashboardAlertDto;
import com.aluon.dashboard.dto.DashboardAlertsDto;
import com.aluon.dashboard.dto.DashboardKpisDto;
import com.aluon.dashboard.dto.DashboardOperationsDto;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderRepository orderRepository;

    public DashboardKpisDto getKpis() {
        long ordersToPrepare = orderRepository.countByWorkflowStepIn(
                List.of(OrderWorkflowStep.INBOX, OrderWorkflowStep.REQUEST)
        );

        return new DashboardKpisDto(
                ordersToPrepare,
                0,
                0,
                0,
                OffsetDateTime.now(ZoneOffset.UTC)
        );
    }

    public DashboardOperationsDto getOperations() {
        long inRoute = orderRepository.countByEstado(OrderStatus.EN_PRODUCCION);
        long completed = orderRepository.countByEstadoIn(List.of(OrderStatus.INSTALADA, OrderStatus.FACTURADA));

        return new DashboardOperationsDto(
                inRoute,
                completed,
                0,
                OffsetDateTime.now(ZoneOffset.UTC)
        );
    }

    public DashboardAlertsDto getAlerts() {
        List<DashboardAlertDto> alerts = List.of(
                new DashboardAlertDto("Bombín 30/30", "Stock crítico (2 uds)", "danger"),
                new DashboardAlertDto("Factura #F-1203", "Pendiente de pago 15 días", "warning"),
                new DashboardAlertDto("Cliente BBVA", "Nueva solicitud prioritaria", "neutral")
        );

        return new DashboardAlertsDto(alerts, OffsetDateTime.now(ZoneOffset.UTC));
    }
}
