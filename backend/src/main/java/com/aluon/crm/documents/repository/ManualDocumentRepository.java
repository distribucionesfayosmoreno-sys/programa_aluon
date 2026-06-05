package com.aluon.crm.documents.repository;

import com.aluon.crm.documents.model.ManualDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ManualDocumentRepository extends JpaRepository<ManualDocument, UUID> {
    List<ManualDocument> findAllByOrderByCreatedAtDesc();

    boolean existsByTypeIgnoreCaseAndNumberIgnoreCase(String type, String number);

    boolean existsByTypeIgnoreCaseAndNumberIgnoreCaseAndIdNot(String type, String number, UUID id);
}
