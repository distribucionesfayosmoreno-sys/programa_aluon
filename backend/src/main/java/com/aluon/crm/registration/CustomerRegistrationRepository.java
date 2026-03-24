package com.aluon.crm.registration;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CustomerRegistrationRepository extends JpaRepository<CustomerRegistration, UUID> {
    List<CustomerRegistration> findByStatusOrderByCreatedAtDesc(CustomerRegistrationStatus status);
}
