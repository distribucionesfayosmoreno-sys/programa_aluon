package com.aluon.crm.customer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public Customer findById(UUID id) {
        return customerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public Customer save(Customer customer) {
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
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        if (customer.isActive()) {
            customer.setActive(false);
            customerRepository.save(customer);
        }
    }
}
