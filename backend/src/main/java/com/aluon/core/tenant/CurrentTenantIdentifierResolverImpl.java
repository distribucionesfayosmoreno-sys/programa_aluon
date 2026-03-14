package com.aluon.core.tenant;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver<UUID> {

    // Helper ThreadLocal para guardar el TenantId del request actual
    private static final ThreadLocal<UUID> tenantId = new ThreadLocal<>();

    public static void setTenantId(UUID tenant) {
        tenantId.set(tenant);
    }

    public static void clear() {
        tenantId.remove();
    }

    @Override
    public UUID resolveCurrentTenantIdentifier() {
        UUID currentTenant = tenantId.get();
        if (currentTenant != null) {
            return currentTenant;
        }
        // Retornamos un UUID "default" genérico para operaciones globales 
        // o logica de control si el Tenant no fue provisto (por ejemplo en login)
        // UUID(0L, 0L) es solo para ilustrar.
        return new UUID(0L, 0L);
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
