package com.aluon.crm.registration;

import com.aluon.crm.customer.Customer;
import com.aluon.crm.customer.CustomerRepository;
import com.aluon.crm.pricing.Tariff;
import com.aluon.crm.pricing.TariffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CustomerRegistrationService {

    private final CustomerRepository customerRepository;
    private final TariffService tariffService;

    @Transactional
    public CustomerRegistrationResponse register(CustomerRegistrationRequest request) {
        validate(request);

        Tariff tariff = tariffService.getDefaultTariff();

        Customer customer = Customer.builder()
                .nombreComercial(request.getNombreComercial().trim())
                .razonSocial(normalize(request.getRazonSocial()))
                .personaContacto(normalize(request.getPersonaContacto()))
                .email(request.getEmail().trim())
                .telefono(request.getTelefonoWhatsapp().trim())
                .direccion(normalize(request.getDireccion()))
                .cp(normalize(request.getCp()))
                .poblacion(normalize(request.getPoblacion()))
                .provincia(normalize(request.getProvincia()))
                .pais(normalize(request.getPais()))
                .tarifa(tariff.getCode())
                .build();

        Customer saved = customerRepository.save(customer);

        return CustomerRegistrationResponse.builder()
                .customerId(saved.getId())
                .nombreComercial(saved.getNombreComercial())
                .email(saved.getEmail())
                .telefonoWhatsapp(saved.getTelefono())
                .tarifa(saved.getTarifa())
                .confirmedAt(LocalDateTime.now())
                .build();
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
}
