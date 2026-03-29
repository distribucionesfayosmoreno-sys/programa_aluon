package com.aluon.crm.auth.repository;

import com.aluon.crm.auth.model.CustomerPasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface CustomerPasswordResetRepository extends JpaRepository<CustomerPasswordReset, UUID> {
    Optional<CustomerPasswordReset> findFirstByTokenHashAndUsedAtIsNullAndExpiresAtAfter(
            String tokenHash,
            LocalDateTime now
    );
}
