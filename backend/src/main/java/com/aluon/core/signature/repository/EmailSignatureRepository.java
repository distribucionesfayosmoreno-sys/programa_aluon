package com.aluon.core.signature.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import com.aluon.core.signature.model.EmailSignature;


public interface EmailSignatureRepository extends JpaRepository<EmailSignature, UUID> {
}
