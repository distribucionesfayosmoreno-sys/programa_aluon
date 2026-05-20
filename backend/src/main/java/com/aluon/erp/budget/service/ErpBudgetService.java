package com.aluon.erp.budget.service;

import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import com.aluon.crm.quote.model.QuoteStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import com.aluon.erp.budget.dto.ErpBudgetStatusResponse;
import com.aluon.erp.budget.dto.ErpBudgetSyncRequest;


@Service
@RequiredArgsConstructor
@Transactional
public class ErpBudgetService {

    private final QuoteRequestRepository quoteRequestRepository;

    @Transactional(readOnly = true)
    public ErpBudgetStatusResponse getStatus(String quoteNumber) {
        QuoteRequest quote = getQuoteByNumber(quoteNumber);
        return toResponse(quote);
    }

    public ErpBudgetStatusResponse sync(ErpBudgetSyncRequest request) {
        validate(request);
        QuoteRequest quote = getQuoteByNumber(request.getQuoteNumber());
        QuoteStatus targetStatus = request.getStatus();

        if (targetStatus != null) {
            enforceForwardTransition(quote.getStatus(), targetStatus);
            applyStatus(quote, targetStatus);
        }

        @SuppressWarnings("null")
        QuoteRequest saved = quoteRequestRepository.save(quote);
        return toResponse(Objects.requireNonNull(saved, "saved"));
    }

    private QuoteRequest getQuoteByNumber(String quoteNumber) {
        String normalized = quoteNumber == null ? null : quoteNumber.trim();
        if (normalized == null || normalized.isBlank()) {
            throw new IllegalArgumentException("El número de presupuesto es obligatorio");
        }
        return quoteRequestRepository.findByQuoteNumber(normalized)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
    }

    private void applyStatus(QuoteRequest quote, QuoteStatus status) {
        LocalDateTime now = LocalDateTime.now();
        quote.setStatus(status);
        if (status == QuoteStatus.VALIDADO) {
            if (quote.getValidatedAt() == null) {
                quote.setValidatedAt(now);
            }
        }
        if (status == QuoteStatus.ENVIADO) {
            if (quote.getValidatedAt() == null) {
                quote.setValidatedAt(now);
            }
            quote.setSentAt(now);
        }
    }

    private void enforceForwardTransition(QuoteStatus current, QuoteStatus target) {
        if (current == null || target == null) {
            return;
        }
        if (statusOrder(target) < statusOrder(current)) {
            throw new IllegalArgumentException("No se permite retroceder el estado del presupuesto");
        }
    }

    private int statusOrder(QuoteStatus status) {
        return switch (status) {
            case PENDIENTE_VALIDACION -> 0;
            case VALIDADO -> 1;
            case ENVIADO -> 2;
        };
    }

    private ErpBudgetStatusResponse toResponse(QuoteRequest quote) {
        return ErpBudgetStatusResponse.builder()
                .quoteNumber(quote.getQuoteNumber())
                .status(quote.getStatus())
                .createdAt(quote.getCreatedAt())
                .validatedAt(quote.getValidatedAt())
                .sentAt(quote.getSentAt())
                .build();
    }

    private void validate(ErpBudgetSyncRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        if (request.getQuoteNumber() == null || request.getQuoteNumber().isBlank()) {
            throw new IllegalArgumentException("El número de presupuesto es obligatorio");
        }
        if (request.getStatus() == null) {
            throw new IllegalArgumentException("El estado del presupuesto es obligatorio");
        }
    }
}
