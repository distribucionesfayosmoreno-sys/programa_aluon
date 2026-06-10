package com.aluon.crm.customer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.model.CustomerTariff;
import com.aluon.crm.customer.model.PaymentMethod;
import com.aluon.crm.customer.repository.CustomerRepository;


@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Customer> findAll() {
        return customerRepository.findAllByActiveTrueOrderByNombreComercialAsc();
    }

    @Transactional(readOnly = true)
    public List<Customer> findByNombreComercial(String query) {
        String normalizedQuery = query == null ? "" : query.trim();
        if (normalizedQuery.isBlank()) {
            return findAll();
        }
        return customerRepository.findByActiveTrueAndNombreComercialContainingIgnoreCaseOrderByNombreComercialAsc(normalizedQuery);
    }

    @Transactional(readOnly = true)
    public Optional<Customer> findFirstActiveByEmail(String email) {
        String normalizedEmail = Objects.requireNonNull(email, "email").trim();
        if (normalizedEmail.isBlank()) {
            return Optional.empty();
        }
        return customerRepository.findFirstByEmailIgnoreCaseAndActiveTrue(normalizedEmail);
    }

    @Transactional(readOnly = true)
    public boolean documentExists(String numeroDocumento, UUID excludeId) {
        if (numeroDocumento == null || numeroDocumento.isBlank()) return false;
        if (excludeId != null) {
            return customerRepository.existsByNumeroDocumentoIgnoreCaseAndIdNotAndActiveTrue(numeroDocumento.trim(), excludeId);
        }
        return customerRepository.existsByNumeroDocumentoIgnoreCaseAndActiveTrue(numeroDocumento.trim());
    }

    public Customer findById(UUID id) {
        UUID customerId = Objects.requireNonNull(id, "id");
        return customerRepository.findByIdAndActiveTrue(customerId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public Customer save(Customer customer) {
        return save(customer, null);
    }

    public Customer save(Customer customer, String rawPassword) {
        Objects.requireNonNull(customer, "customer");
        if (customer.getId() == null) {
            customer.setActive(true);
        }

        validatePaymentMethod(customer.getFormaPago());
        customer.setFormaPago(PaymentMethod.normalize(customer.getFormaPago()));
        customer.setTarifa(CustomerTariff.normalizeCode(customer.getTarifa()));

        String normalizedPassword = rawPassword == null ? "" : rawPassword.trim();
        if (!normalizedPassword.isBlank()) {
            if (normalizedPassword.length() < 8) {
                throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres.");
            }
            customer.setPasswordHash(passwordEncoder.encode(normalizedPassword));
        } else if (customer.getId() != null) {
            Customer existing = customerRepository.findById(customer.getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            customer.setPasswordHash(existing.getPasswordHash());
        }

        // Asegurar la relación bidireccional en las direcciones al guardar
        if (customer.getDireccionesEntrega() != null) {
            customer.getDireccionesEntrega().forEach(dir -> dir.setCustomer(customer));
        }
        return customerRepository.save(customer);
    }

    public void deleteById(UUID id) {
        UUID customerId = Objects.requireNonNull(id, "id");
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        if (customer.isActive()) {
            customer.setActive(false);
            customerRepository.save(customer);
        }
    }

    private void validatePaymentMethod(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("La forma de pago es obligatoria");
        }
        if (!PaymentMethod.isValid(value)) {
            throw new IllegalArgumentException("La forma de pago debe ser TRANSFERENCIA, GIRO, TARJETA o CONTADO");
        }
    }
}
