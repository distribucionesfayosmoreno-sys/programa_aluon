package com.aluon.crm.customer.mapper;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.dto.CustomerRequest;
import com.aluon.crm.customer.dto.CustomerResponse;
import com.aluon.crm.customer.model.DeliveryAddress;
import com.aluon.crm.customer.dto.DeliveryAddressRequest;
import com.aluon.crm.customer.dto.DeliveryAddressResponse;


@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {
        List<DeliveryAddressResponse> addresses = customer.getDireccionesEntrega() == null
                ? List.of()
                : customer.getDireccionesEntrega().stream()
                .map(this::toResponse)
                .toList();

        return new CustomerResponse(
                customer.getId(),
                customer.getNombreComercial(),
                customer.getRazonSocial(),
                customer.getPersonaContacto(),
                customer.getTarifa(),
                customer.getTipoDocumento(),
                customer.getNumeroDocumento(),
                customer.getTelefono(),
                customer.getEmail(),
                customer.getDireccion(),
                customer.getCp(),
                customer.getPoblacion(),
                customer.getProvincia(),
                customer.getPais(),
                customer.getIban(),
                customer.getFormaPago(),
                customer.getDiasVencimiento(),
                customer.isAutoApproveQuotes(),
                customer.getRemanente(),
                addresses
        );
    }

    public Customer toEntity(CustomerRequest request, UUID customerId) {
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setNombreComercial(request.nombreComercial());
        customer.setRazonSocial(request.razonSocial());
        customer.setPersonaContacto(request.personaContacto());
        customer.setTarifa(request.tarifa());
        customer.setTipoDocumento(request.tipoDocumento());
        customer.setNumeroDocumento(request.numeroDocumento());
        customer.setTelefono(request.telefono());
        customer.setEmail(request.email());
        customer.setDireccion(request.direccion());
        customer.setCp(request.cp());
        customer.setPoblacion(request.poblacion());
        customer.setProvincia(request.provincia());
        customer.setPais(request.pais());
        customer.setIban(request.iban());
        customer.setFormaPago(request.formaPago());
        customer.setDiasVencimiento(request.diasVencimiento());
        customer.setAutoApproveQuotes(request.autoApproveQuotes());
        customer.setRemanente(request.remanente());
        customer.setDireccionesEntrega(toAddressEntities(request.direccionesEntrega()));
        return customer;
    }

    private List<DeliveryAddress> toAddressEntities(List<DeliveryAddressRequest> addresses) {
        if (addresses == null || addresses.isEmpty()) {
            return Collections.emptyList();
        }
        return addresses.stream()
                .map(this::toEntity)
                .toList();
    }

    private DeliveryAddress toEntity(DeliveryAddressRequest request) {
        DeliveryAddress address = new DeliveryAddress();
        address.setId(request.id());
        address.setNombreAlias(request.nombreAlias());
        address.setDireccion(request.direccion());
        address.setCp(request.cp());
        address.setPoblacion(request.poblacion());
        address.setProvincia(request.provincia());
        address.setTelefono(request.telefono());
        address.setContacto(request.contacto());
        return address;
    }

    private DeliveryAddressResponse toResponse(DeliveryAddress address) {
        return new DeliveryAddressResponse(
                address.getId(),
                address.getNombreAlias(),
                address.getDireccion(),
                address.getCp(),
                address.getPoblacion(),
                address.getProvincia(),
                address.getTelefono(),
                address.getContacto()
        );
    }
}
