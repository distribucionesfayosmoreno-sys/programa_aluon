package com.aluon.crm.auth.service;

import com.aluon.crm.auth.dto.CustomerLoginRequest;
import com.aluon.crm.auth.dto.CustomerLoginResponse;
import com.aluon.crm.auth.dto.CustomerPasswordResetConfirmRequest;
import com.aluon.crm.auth.dto.CustomerPasswordResetRequest;
import com.aluon.crm.auth.model.CustomerPasswordReset;
import com.aluon.crm.auth.repository.CustomerPasswordResetRepository;
import com.aluon.crm.registration.model.CustomerRegistration;
import com.aluon.crm.registration.repository.CustomerRegistrationRepository;
import com.aluon.core.mail.service.EmailTemplateService;
import com.aluon.core.mail.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerAuthService {

    private final CustomerRegistrationRepository registrationRepository;
    private final CustomerPasswordResetRepository passwordResetRepository;
    private final Optional<MailService> mailService;
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

    @Transactional
    public void requestPasswordReset(CustomerPasswordResetRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        String email = request.getEmail().trim();
        Optional<CustomerRegistration> registrationOpt = registrationRepository.findFirstByEmailIgnoreCase(email);
        if (registrationOpt.isEmpty()) {
            return;
        }

        CustomerRegistration registration = registrationOpt.get();
        if (registration.getPasswordHash() == null || registration.getPasswordHash().isBlank()) {
            return;
        }

        String token = generateToken();
        String tokenHash = hashToken(token);
        LocalDateTime now = LocalDateTime.now();

        CustomerPasswordReset reset = CustomerPasswordReset.builder()
                .registrationId(registration.getId())
                .email(registration.getEmail())
                .tokenHash(tokenHash)
                .createdAt(now)
                .expiresAt(now.plusMinutes(30))
                .build();

        passwordResetRepository.save(reset);

        mailService.ifPresent(service -> service.sendTemplate(
                EmailTemplateService.KEY_PASSWORD_RESET,
                registration.getEmail(),
                Map.of(
                        "token", token,
                        "expiresMinutes", "30"
                )
        ));
    }

    @Transactional
    public void resetPassword(CustomerPasswordResetConfirmRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        String token = request.getToken() != null ? request.getToken().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        if (token.isBlank()) {
            throw new IllegalArgumentException("El código es obligatorio");
        }
        if (password.isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }

        String tokenHash = hashToken(token);
        CustomerPasswordReset reset = passwordResetRepository
                .findFirstByTokenHashAndUsedAtIsNullAndExpiresAtAfter(tokenHash, LocalDateTime.now())
                .orElseThrow(() -> new IllegalArgumentException("El código es inválido o ha caducado"));

        CustomerRegistration registration = registrationRepository.findById(reset.getRegistrationId())
                .orElseThrow(() -> new IllegalArgumentException("Registro no encontrado"));

        registration.setPasswordHash(passwordEncoder.encode(password));
        registrationRepository.save(registration);

        reset.setUsedAt(LocalDateTime.now());
        passwordResetRepository.save(reset);
    }

    private String generateToken() {
        byte[] buffer = new byte[24];
        new SecureRandom().nextBytes(buffer);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buffer);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo procesar el token", ex);
        }
    }
}
