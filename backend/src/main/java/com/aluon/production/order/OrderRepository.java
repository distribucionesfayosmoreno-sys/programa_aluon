package com.aluon.production.order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = "customer")
    List<Order> findAllByOrderByCodigoOrdenDesc();

    long countByWorkflowStepIn(Collection<OrderWorkflowStep> steps);

    long countByEstado(OrderStatus estado);

    long countByEstadoIn(Collection<OrderStatus> estados);
}
