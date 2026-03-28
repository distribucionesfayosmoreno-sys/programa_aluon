package com.aluon.production.order.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import com.aluon.production.order.model.Order;
import com.aluon.production.order.model.OrderStatus;
import com.aluon.production.order.model.OrderWorkflowStep;


public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = "customer")
    List<Order> findAllByOrderByCodigoOrdenDesc();

    boolean existsByCodigoOrden(String codigoOrden);

    long countByWorkflowStepIn(Collection<OrderWorkflowStep> steps);

    long countByEstado(OrderStatus estado);

    long countByEstadoIn(Collection<OrderStatus> estados);
}
