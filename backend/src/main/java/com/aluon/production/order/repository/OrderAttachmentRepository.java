package com.aluon.production.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import com.aluon.production.order.model.OrderAttachment;

public interface OrderAttachmentRepository extends JpaRepository<OrderAttachment, UUID> {
}
