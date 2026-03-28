package com.aluon.crm.registration.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.aluon.crm.registration.model.CustomerRegistration;
import com.aluon.crm.registration.model.CustomerRegistrationStatus;


public interface CustomerRegistrationRepository extends JpaRepository<CustomerRegistration, UUID> {
    List<CustomerRegistration> findByStatusOrderByCreatedAtDesc(CustomerRegistrationStatus status);

    Optional<CustomerRegistration> findFirstByEmailIgnoreCaseAndTelefonoWhatsapp(
            String email,
            String telefonoWhatsapp
    );
}
