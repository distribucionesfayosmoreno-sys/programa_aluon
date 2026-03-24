package com.aluon.core.signature;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmailSignatureRepository extends JpaRepository<EmailSignature, UUID> {
}
