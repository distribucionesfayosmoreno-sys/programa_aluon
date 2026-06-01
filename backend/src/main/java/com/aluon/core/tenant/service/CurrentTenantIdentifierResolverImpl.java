package com.aluon.core.tenant.service;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver<UUID> {

    // Helper ThreadLocal para guardar el TenantId del request actual
    private static final ThreadLocal<UUID> tenantId = new ThreadLocal<>();
    private static final String RUNTIME_TENANT_ID_PROP = "APP_TENANT_RUNTIME_ID";

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
        UUID runtimeTenant = parseUuidOrNull(System.getProperty(RUNTIME_TENANT_ID_PROP));
        if (runtimeTenant != null) {
            return runtimeTenant;
        }
        // When no tenant is provided (e.g., unauthenticated requests), fall back to a global UUID.
        // A request filter is expected to set the tenant for tenant-scoped operations.
        return new UUID(0L, 0L);
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }

    private static UUID parseUuidOrNull(String raw) {
        if (raw == null) return null;
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) return null;
        try {
            return UUID.fromString(trimmed);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
