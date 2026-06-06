package com.aluon.core.whatsapp.repository;

import com.aluon.core.whatsapp.model.WhatsappTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WhatsappTemplateRepository extends JpaRepository<WhatsappTemplate, UUID> {
    Optional<WhatsappTemplate> findByTemplateKey(String templateKey);
}
