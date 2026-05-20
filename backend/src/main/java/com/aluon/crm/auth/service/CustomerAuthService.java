package com.aluon.crm.auth.service;

import com.aluon.crm.auth.dto.CustomerLoginRequest;
import com.aluon.crm.auth.dto.CustomerLoginResponse;
import com.aluon.crm.auth.dto.CustomerPasswordResetConfirmRequest;
import com.aluon.crm.auth.dto.CustomerPasswordResetRequest;
import com.aluon.crm.auth.model.CustomerPasswordReset;
import com.aluon.crm.auth.repository.CustomerPasswordResetRepository;
import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.repository.CustomerRepository;
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
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CustomerAuthService {

    private final CustomerRegistrationRepository registrationRepository;
    private final CustomerRepository customerRepository;
    private final CustomerPasswordResetRepository passwordResetRepository;
    private final Optional<MailService> mailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public CustomerLoginResponse login(CustomerLoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("No se pudo procesar la solicitud. Inténtalo de nuevo.");
        }
        String email = request.getEmail() != null ? request.getEmail().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        if (email.isBlank()) {
            throw new IllegalArgumentException("Escribe tu correo electrónico.");
        }
        if (password.isBlank()) {
            throw new IllegalArgumentException("Escribe tu contraseña.");
        }

        Customer customer = customerRepository
                .findFirstByEmailIgnoreCaseAndActiveTrue(email)
                .orElse(null);

        if (customer == null) {
            Optional<CustomerRegistration> registrationOpt = registrationRepository.findFirstByEmailIgnoreCase(email);
            if (registrationOpt.isPresent()) {
                CustomerRegistration registration = registrationOpt.get();
                if (registration.getStatus() == com.aluon.crm.registration.model.CustomerRegistrationStatus.PENDIENTE) {
                    throw new IllegalArgumentException("Tu solicitud aún está en revisión.");
                }
                if (registration.getStatus() == com.aluon.crm.registration.model.CustomerRegistrationStatus.RECHAZADO) {
                    throw new IllegalArgumentException("Tu solicitud fue rechazada. Contacta con soporte.");
                }
            }
            throw new IllegalArgumentException("El correo o la contraseña no son correctos.");
        }

        if (customer.getPasswordHash() == null || customer.getPasswordHash().isBlank()) {
            throw new IllegalArgumentException("Tu cuenta no tiene contraseña. Usa \"Olvidé mi contraseña\" para crearla.");
        }
        if (!passwordEncoder.matches(password, customer.getPasswordHash())) {
            throw new IllegalArgumentException("El correo o la contraseña no son correctos.");
        }

        return CustomerLoginResponse.builder()
                .registrationId(null)
                .customerId(customer.getId())
                .nombreComercial(customer.getNombreComercial())
                .email(customer.getEmail())
                .telefonoWhatsapp(customer.getTelefono())
                .status(com.aluon.crm.registration.model.CustomerRegistrationStatus.APROBADO)
                .build();
    }

    @Transactional
    public void requestPasswordReset(CustomerPasswordResetRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Escribe tu correo electrónico.");
        }
        String email = request.getEmail().trim();
        Optional<Customer> customerOpt = customerRepository.findFirstByEmailIgnoreCaseAndActiveTrue(email);
        if (customerOpt.isEmpty()) {
            return;
        }

        Customer customer = customerOpt.get();

        String token = generateToken();
        String tokenHash = hashToken(token);
        LocalDateTime now = LocalDateTime.now();

        CustomerPasswordReset reset = CustomerPasswordReset.builder()
                .customerId(customer.getId())
                .email(customer.getEmail())
                .tokenHash(tokenHash)
                .createdAt(now)
                .expiresAt(now.plusMinutes(30))
                .build();

        passwordResetRepository.save(Objects.requireNonNull(reset, "reset"));

        mailService.ifPresent(service -> service.sendTemplate(
                EmailTemplateService.KEY_PASSWORD_RESET,
                customer.getEmail(),
                Map.of(
                        "token", token,
                        "expiresMinutes", "30"
                )
        ));
    }

    @Transactional
    public void resetPassword(CustomerPasswordResetConfirmRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("No se pudo procesar la solicitud. Inténtalo de nuevo.");
        }
        String token = request.getToken() != null ? request.getToken().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        if (token.isBlank()) {
            throw new IllegalArgumentException("Introduce el código que recibiste por email.");
        }
        if (password.isBlank()) {
            throw new IllegalArgumentException("Escribe una nueva contraseña.");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres.");
        }

        String tokenHash = hashToken(token);
        CustomerPasswordReset reset = passwordResetRepository
                .findFirstByTokenHashAndUsedAtIsNullAndExpiresAtAfter(tokenHash, LocalDateTime.now())
                .orElseThrow(() -> new IllegalArgumentException("El código es inválido o ha caducado."));

        Customer customer = customerRepository.findById(Objects.requireNonNull(reset.getCustomerId(), "customerId"))
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada"));

        customer.setPasswordHash(passwordEncoder.encode(password));
        customerRepository.save(customer);

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
