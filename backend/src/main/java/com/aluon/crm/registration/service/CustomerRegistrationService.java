package com.aluon.crm.registration.service;

import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.repository.CustomerRepository;
import com.aluon.crm.pricing.service.TariffService;
import com.aluon.core.mail.service.EmailTemplateService;
import com.aluon.core.mail.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Objects;
import java.util.UUID;
import com.aluon.crm.registration.model.CustomerRegistration;
import com.aluon.crm.registration.dto.CustomerRegistrationApprovalRequest;
import com.aluon.crm.registration.dto.CustomerRegistrationDto;
import com.aluon.crm.registration.dto.CustomerRegistrationRejectionRequest;
import com.aluon.crm.registration.repository.CustomerRegistrationRepository;
import com.aluon.crm.registration.dto.CustomerRegistrationRequest;
import com.aluon.crm.registration.dto.CustomerRegistrationResponse;
import com.aluon.crm.registration.model.CustomerRegistrationStatus;

@Service
@RequiredArgsConstructor
public class CustomerRegistrationService {

    private final CustomerRegistrationRepository registrationRepository;
    private final CustomerRepository customerRepository;
    private final TariffService tariffService;
    private final Optional<MailService> mailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CustomerRegistrationResponse register(CustomerRegistrationRequest request) {
        validate(request);

        CustomerRegistration registration = CustomerRegistration.builder()
                .nombreComercial(request.getNombreComercial().trim())
                .razonSocial(normalize(request.getRazonSocial()))
                .personaContacto(normalize(request.getPersonaContacto()))
                .email(request.getEmail().trim())
                .telefonoWhatsapp(request.getTelefonoWhatsapp().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword().trim()))
                .direccion(normalize(request.getDireccion()))
                .cp(normalize(request.getCp()))
                .poblacion(normalize(request.getPoblacion()))
                .provincia(normalize(request.getProvincia()))
                .pais(normalize(request.getPais()))
                .status(CustomerRegistrationStatus.PENDIENTE)
                .autoApproveQuotes(false)
                .createdAt(LocalDateTime.now())
                .build();

        @SuppressWarnings("null")
        CustomerRegistration saved = registrationRepository.save(registration);
        saved = Objects.requireNonNull(saved, "saved");

        String savedEmail = Objects.requireNonNull(saved.getEmail(), "email");
        String savedNombreComercial = Objects.requireNonNull(saved.getNombreComercial(), "nombreComercial");
        String savedTelefonoWhatsapp = Objects.requireNonNull(saved.getTelefonoWhatsapp(), "telefonoWhatsapp");

        mailService.ifPresent(service -> service.sendTemplate(
                EmailTemplateService.KEY_REGISTRATION_CONFIRMATION,
                savedEmail,
                Map.of(
                        "nombreComercial", savedNombreComercial,
                        "email", savedEmail,
                        "telefono", savedTelefonoWhatsapp)));

        return CustomerRegistrationResponse.builder()
                .registrationId(Objects.requireNonNull(saved.getId(), "id"))
                .customerId(saved.getCustomerId())
                .nombreComercial(savedNombreComercial)
                .email(savedEmail)
                .telefonoWhatsapp(savedTelefonoWhatsapp)
                .status(Objects.requireNonNull(saved.getStatus(), "status"))
                .createdAt(Objects.requireNonNull(saved.getCreatedAt(), "createdAt"))
                .build();
    }

    @Transactional(readOnly = true)
    public List<CustomerRegistrationDto> listPending() {
        return registrationRepository.findByStatusOrderByCreatedAtDesc(CustomerRegistrationStatus.PENDIENTE)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CustomerRegistrationDto getById(UUID id) {
        UUID registrationId = Objects.requireNonNull(id, "id");
        CustomerRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));
        return toDto(registration);
    }

    @Transactional(readOnly = true)
    public CustomerRegistrationResponse getResponseById(UUID id) {
        UUID registrationId = Objects.requireNonNull(id, "id");
        CustomerRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));
        return CustomerRegistrationResponse.builder()
                .registrationId(registration.getId())
                .customerId(registration.getCustomerId())
                .nombreComercial(registration.getNombreComercial())
                .email(registration.getEmail())
                .telefonoWhatsapp(registration.getTelefonoWhatsapp())
                .status(registration.getStatus())
                .createdAt(registration.getCreatedAt())
                .build();
    }

    @Transactional
    public CustomerRegistrationDto approve(UUID id, CustomerRegistrationApprovalRequest request) {
        UUID registrationId = Objects.requireNonNull(id, "id");
        CustomerRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        if (registration.getStatus() == CustomerRegistrationStatus.APROBADO) {
            return toDto(registration);
        }

        String tariffCode = request != null ? normalize(request.getTariffCode()) : null;
        String finalTariff = tariffService.getTariffByCode(tariffCode).getCode();
        boolean autoApproveQuotes = request != null && Boolean.TRUE.equals(request.getAutoApproveQuotes());

        Customer customer = Customer.builder()
                .nombreComercial(registration.getNombreComercial())
                .razonSocial(registration.getRazonSocial())
                .personaContacto(registration.getPersonaContacto())
                .email(registration.getEmail())
                .telefono(registration.getTelefonoWhatsapp())
                .passwordHash(registration.getPasswordHash())
                .direccion(registration.getDireccion())
                .cp(registration.getCp())
                .poblacion(registration.getPoblacion())
                .provincia(registration.getProvincia())
                .pais(registration.getPais())
                .tarifa(finalTariff)
                .autoApproveQuotes(autoApproveQuotes)
                .build();

        @SuppressWarnings("null")
        Customer savedCustomer = customerRepository.save(customer);
        savedCustomer = Objects.requireNonNull(savedCustomer, "customer");

        registration.setStatus(CustomerRegistrationStatus.APROBADO);
        registration.setTariffCode(finalTariff);
        registration.setAutoApproveQuotes(autoApproveQuotes);
        registration.setCustomerId(Objects.requireNonNull(savedCustomer.getId(), "customerId"));
        registration.setReviewedAt(LocalDateTime.now());

        registrationRepository.save(registration);

        String registrationEmail = Objects.requireNonNull(registration.getEmail(), "email");
        String registrationNombreComercial = Objects.requireNonNull(registration.getNombreComercial(), "nombreComercial");
        String registrationTelefonoWhatsapp = Objects.requireNonNull(registration.getTelefonoWhatsapp(), "telefonoWhatsapp");

        mailService.ifPresent(service -> service.sendTemplate(
                EmailTemplateService.KEY_REGISTRATION_APPROVED,
                registrationEmail,
                Map.of(
                        "nombreComercial", registrationNombreComercial,
                        "email", registrationEmail,
                        "telefono", registrationTelefonoWhatsapp)));

        // Una vez aprobada y creada en customers, eliminar la solicitud
        registrationRepository.deleteById(Objects.requireNonNull(registration.getId(), "id"));
        return toDto(registration);
    }

    @Transactional
    public CustomerRegistrationDto reject(UUID id, CustomerRegistrationRejectionRequest request) {
        UUID registrationId = Objects.requireNonNull(id, "id");
        CustomerRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        if (registration.getStatus() == CustomerRegistrationStatus.RECHAZADO) {
            return toDto(registration);
        }

        registration.setStatus(CustomerRegistrationStatus.RECHAZADO);
        registration.setReviewedAt(LocalDateTime.now());

        registrationRepository.save(registration);

        return toDto(registration);
    }

    private void validate(CustomerRegistrationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("No se pudo procesar la solicitud. Inténtalo de nuevo.");
        }
        if (request.getNombreComercial() == null || request.getNombreComercial().isBlank()) {
            throw new IllegalArgumentException("Escribe el nombre comercial.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Escribe tu correo electrónico.");
        }
        if (request.getTelefonoWhatsapp() == null || request.getTelefonoWhatsapp().isBlank()) {
            throw new IllegalArgumentException("Escribe tu teléfono de WhatsApp.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Escribe una contraseña.");
        }
        if (request.getPassword().trim().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres.");
        }
    }

    private String normalize(String value) {
        if (value == null)
            return null;
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private CustomerRegistrationDto toDto(CustomerRegistration registration) {
        return CustomerRegistrationDto.builder()
                .id(registration.getId())
                .nombreComercial(registration.getNombreComercial())
                .razonSocial(registration.getRazonSocial())
                .personaContacto(registration.getPersonaContacto())
                .email(registration.getEmail())
                .telefonoWhatsapp(registration.getTelefonoWhatsapp())
                .direccion(registration.getDireccion())
                .cp(registration.getCp())
                .poblacion(registration.getPoblacion())
                .provincia(registration.getProvincia())
                .pais(registration.getPais())
                .status(registration.getStatus())
                .tariffCode(registration.getTariffCode())
                .customerId(registration.getCustomerId())
                .autoApproveQuotes(registration.isAutoApproveQuotes())
                .createdAt(registration.getCreatedAt())
                .reviewedAt(registration.getReviewedAt())
                .build();
    }
}
