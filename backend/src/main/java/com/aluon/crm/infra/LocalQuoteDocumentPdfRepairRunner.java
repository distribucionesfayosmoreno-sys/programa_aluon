package com.aluon.crm.infra;

import com.aluon.core.tenant.service.CurrentTenantIdentifierResolverImpl;
import com.aluon.crm.quote.model.QuoteDocument;
import com.aluon.crm.quote.repository.QuoteDocumentRepository;
import com.aluon.crm.quote.service.QuotePdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Component
@Profile("local")
@Order(3)
@RequiredArgsConstructor
public class LocalQuoteDocumentPdfRepairRunner implements ApplicationRunner {

    private static final UUID DEMO_TENANT_ID = new UUID(0L, 0L);
    private static final String RUNTIME_TENANT_ID_PROP = "APP_TENANT_RUNTIME_ID";

    private final QuoteDocumentRepository quoteDocumentRepository;
    private final QuotePdfService quotePdfService;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        CurrentTenantIdentifierResolverImpl.setTenantId(DEMO_TENANT_ID);
        System.setProperty(RUNTIME_TENANT_ID_PROP, DEMO_TENANT_ID.toString());
        try {
            repairInvalidPdfDocuments();
        } finally {
            System.clearProperty(RUNTIME_TENANT_ID_PROP);
            CurrentTenantIdentifierResolverImpl.clear();
        }
    }

    private void repairInvalidPdfDocuments() {
        List<QuoteDocument> documents = quoteDocumentRepository.findAll();
        boolean changed = false;

        for (QuoteDocument document : documents) {
            byte[] currentData = document.getData();
            if (isPdf(currentData)) {
                continue;
            }

            byte[] fixedData = renderPdf(document);
            document.setData(fixedData);
            document.setContentType("application/pdf");
            document.setSha256(sha256Hex(fixedData));
            changed = true;
        }

        if (changed) {
            quoteDocumentRepository.saveAll(documents);
        }
    }

    private byte[] renderPdf(QuoteDocument document) {
        String tipo = document.getTipo() == null ? "" : document.getTipo().trim().toUpperCase();
        if ("PRESUPUESTO".equals(tipo) || tipo.isBlank()) {
            return quotePdfService.renderQuotePdf(document.getQuoteRequest());
        }
        return quotePdfService.renderQuotePdf(
                document.getQuoteRequest(),
                tipo,
                document.getNumeroDocumento());
    }

    private boolean isPdf(byte[] data) {
        if (data == null || data.length < 4) {
            return false;
        }
        return data[0] == '%' && data[1] == 'P' && data[2] == 'D' && data[3] == 'F';
    }

    private String sha256Hex(byte[] bytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(bytes);
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("No se pudo calcular el hash del PDF", ex);
        }
    }
}
