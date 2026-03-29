package com.aluon.crm.auth.service;

import com.aluon.crm.auth.dto.CustomerLoginRequest;
import com.aluon.crm.auth.dto.CustomerLoginResponse;
import com.aluon.crm.registration.model.CustomerRegistration;
import com.aluon.crm.registration.repository.CustomerRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerAuthService {

    private final CustomerRegistrationRepository registrationRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public CustomerLoginResponse login(CustomerLoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        String email = request.getEmail() != null ? request.getEmail().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        if (email.isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (password.isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        CustomerRegistration registration = registrationRepository
                .findFirstByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));

        if (registration.getPasswordHash() == null || registration.getPasswordHash().isBlank()) {
            throw new IllegalArgumentException("Contraseña no configurada. Contacta con soporte.");
        }
        if (!passwordEncoder.matches(password, registration.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciales incorrectas");
        }

        if (registration.getStatus() == com.aluon.crm.registration.model.CustomerRegistrationStatus.PENDIENTE) {
            throw new IllegalArgumentException("Tu registro aún no está aprobado.");
        }
        if (registration.getStatus() == com.aluon.crm.registration.model.CustomerRegistrationStatus.RECHAZADO) {
            throw new IllegalArgumentException("Tu registro fue rechazado. Contacta con soporte.");
        }

        return CustomerLoginResponse.builder()
                .registrationId(registration.getId())
                .customerId(registration.getCustomerId())
                .nombreComercial(registration.getNombreComercial())
                .email(registration.getEmail())
                .telefonoWhatsapp(registration.getTelefonoWhatsapp())
                .status(registration.getStatus())
                .build();
    }
}
