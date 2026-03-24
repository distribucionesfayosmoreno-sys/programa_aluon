package com.aluon.crm.registration;

import com.aluon.crm.customer.Customer;
import com.aluon.crm.customer.CustomerRepository;
import com.aluon.crm.pricing.TariffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerRegistrationService {

    private final CustomerRegistrationRepository registrationRepository;
    private final CustomerRepository customerRepository;
    private final TariffService tariffService;

    @Transactional
    public CustomerRegistrationResponse register(CustomerRegistrationRequest request) {
        validate(request);

        CustomerRegistration registration = CustomerRegistration.builder()
                .nombreComercial(request.getNombreComercial().trim())
                .razonSocial(normalize(request.getRazonSocial()))
                .personaContacto(normalize(request.getPersonaContacto()))
                .email(request.getEmail().trim())
                .telefonoWhatsapp(request.getTelefonoWhatsapp().trim())
                .direccion(normalize(request.getDireccion()))
                .cp(normalize(request.getCp()))
                .poblacion(normalize(request.getPoblacion()))
                .provincia(normalize(request.getProvincia()))
                .pais(normalize(request.getPais()))
                .status(CustomerRegistrationStatus.PENDIENTE)
                .autoApproveQuotes(false)
                .createdAt(LocalDateTime.now())
                .build();

        CustomerRegistration saved = registrationRepository.save(registration);

        return CustomerRegistrationResponse.builder()
                .registrationId(saved.getId())
                .customerId(saved.getCustomerId())
                .nombreComercial(saved.getNombreComercial())
                .email(saved.getEmail())
                .telefonoWhatsapp(saved.getTelefonoWhatsapp())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
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
        CustomerRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));
        return toDto(registration);
    }

    @Transactional(readOnly = true)
    public CustomerRegistrationResponse getResponseById(UUID id) {
        CustomerRegistration registration = registrationRepository.findById(id)
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
        CustomerRegistration registration = registrationRepository.findById(id)
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
                .direccion(registration.getDireccion())
                .cp(registration.getCp())
                .poblacion(registration.getPoblacion())
                .provincia(registration.getProvincia())
                .pais(registration.getPais())
                .tarifa(finalTariff)
                .autoApproveQuotes(autoApproveQuotes)
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        registration.setStatus(CustomerRegistrationStatus.APROBADO);
        registration.setTariffCode(finalTariff);
        registration.setAutoApproveQuotes(autoApproveQuotes);
        registration.setCustomerId(savedCustomer.getId());
        registration.setReviewedAt(LocalDateTime.now());

        registrationRepository.save(registration);

        return toDto(registration);
    }

    @Transactional
    public CustomerRegistrationDto reject(UUID id, CustomerRegistrationRejectionRequest request) {
        CustomerRegistration registration = registrationRepository.findById(id)
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
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        if (request.getNombreComercial() == null || request.getNombreComercial().isBlank()) {
            throw new IllegalArgumentException("El nombre comercial es obligatorio");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (request.getTelefonoWhatsapp() == null || request.getTelefonoWhatsapp().isBlank()) {
            throw new IllegalArgumentException("El teléfono de WhatsApp es obligatorio");
        }
    }

    private String normalize(String value) {
        if (value == null) return null;
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
