package com.aluon.crm.customer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.repository.CustomerRepository;


@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> findAll() {
        return customerRepository.findAllByActiveTrue();
    }

    @Transactional(readOnly = true)
    public Optional<Customer> findFirstActiveByEmail(String email) {
        String normalizedEmail = Objects.requireNonNull(email, "email").trim();
        if (normalizedEmail.isBlank()) {
            return Optional.empty();
        }
        return customerRepository.findFirstByEmailIgnoreCaseAndActiveTrue(normalizedEmail);
    }

    public Customer findById(UUID id) {
        UUID customerId = Objects.requireNonNull(id, "id");
        return customerRepository.findByIdAndActiveTrue(customerId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public Customer save(Customer customer) {
        Objects.requireNonNull(customer, "customer");
        if (customer.getId() == null) {
            customer.setActive(true);
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
}
