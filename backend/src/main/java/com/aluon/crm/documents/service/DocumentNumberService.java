package com.aluon.crm.documents.service;

import com.aluon.crm.documents.model.DocumentPrefix;
import com.aluon.crm.documents.model.DocumentSeries;
import com.aluon.crm.documents.repository.DocumentNumberSeriesRepository;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Service
public class DocumentNumberService {

    private final DocumentNumberSeriesRepository seriesRepository;
    private final CurrentTenantIdentifierResolver<UUID> tenantResolver;
    private final Clock clock;

    @Autowired
    public DocumentNumberService(
            DocumentNumberSeriesRepository seriesRepository,
            CurrentTenantIdentifierResolver<UUID> tenantResolver
    ) {
        this(seriesRepository, tenantResolver, Clock.systemDefaultZone());
    }

    private DocumentNumberService(
            DocumentNumberSeriesRepository seriesRepository,
            CurrentTenantIdentifierResolver<UUID> tenantResolver,
            Clock clock
    ) {
        this.seriesRepository = Objects.requireNonNull(seriesRepository, "seriesRepository");
        this.tenantResolver = Objects.requireNonNull(tenantResolver, "tenantResolver");
        this.clock = Objects.requireNonNull(clock, "clock");
    }

    @Transactional
    public DocumentSeries nextSeries() {
        UUID tenantId = tenantResolver.resolveCurrentTenantIdentifier();
        LocalDate today = LocalDate.now(clock);
        int seq = seriesRepository.nextSequence(tenantId, today);
        return new DocumentSeries(today, seq);
    }

    @Transactional
    public String nextNumber(DocumentPrefix prefix) {
        Objects.requireNonNull(prefix, "prefix");
        return nextSeries().format(prefix);
    }

    public String formatLinked(DocumentPrefix prefix, DocumentSeries series) {
        Objects.requireNonNull(prefix, "prefix");
        Objects.requireNonNull(series, "series");
        return series.format(prefix);
    }
}
