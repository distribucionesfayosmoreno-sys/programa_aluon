package com.aluon.crm.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public Customer findById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public Customer save(Customer customer) {
        // Asegurar la relación bidireccional en las direcciones al guardar
        if (customer.getDireccionesEntrega() != null) {
            customer.getDireccionesEntrega().forEach(dir -> dir.setCustomer(customer));
        }
        return customerRepository.save(customer);
    }

    public void deleteById(UUID id) {
        customerRepository.deleteById(id);
    }
}
