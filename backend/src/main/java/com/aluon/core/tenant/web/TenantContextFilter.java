package com.aluon.core.tenant.web;

import com.aluon.core.tenant.service.CurrentTenantIdentifierResolverImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TenantContextFilter extends OncePerRequestFilter {

    private static final String HEADER_TENANT_ID = "X-Tenant-Id";
    private static final String HEADER_TENANT_ID_ALT = "X-TenantId";

    private final UUID defaultTenantId;

    public TenantContextFilter(@Value("${app.tenant.default-id:}") String defaultTenantIdRaw) {
        this.defaultTenantId = parseUuidOrNull(defaultTenantIdRaw);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        UUID tenantId = resolveTenantId(request);
        if (tenantId != null) {
            CurrentTenantIdentifierResolverImpl.setTenantId(tenantId);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            CurrentTenantIdentifierResolverImpl.clear();
        }
    }

    private UUID resolveTenantId(HttpServletRequest request) {
        UUID fromHeader = parseUuidOrNull(request.getHeader(HEADER_TENANT_ID));
        if (fromHeader != null) return fromHeader;
        UUID fromAltHeader = parseUuidOrNull(request.getHeader(HEADER_TENANT_ID_ALT));
        if (fromAltHeader != null) return fromAltHeader;
        return defaultTenantId;
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

