package com.aluon.crm.documents.service;

import com.aluon.crm.documents.dto.DocumentManagementCreateRequest;
import com.aluon.crm.documents.model.ManualDocument;
import com.aluon.crm.documents.repository.ManualDocumentRepository;
import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.repository.QuoteDocumentRepository;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DocumentManagementServiceTest {

    @Mock
    private QuoteRequestRepository quoteRequestRepository;

    @Mock
    private QuoteDocumentRepository quoteDocumentRepository;

    @Mock
    private ManualDocumentRepository manualDocumentRepository;

    @Test
    void listRowsIncludesManualDocumentsWhenThereAreNoQuotesInRange() {
        LocalDateTime createdAt = LocalDateTime.of(2026, 6, 4, 10, 30);
        ManualDocument manualDocument = ManualDocument.builder()
                .id(UUID.randomUUID())
                .customerName("Cliente Manual")
                .type("FACTURA")
                .number("FA-MAN-0001")
                .statusLabel("EMITIDO")
                .createdAt(createdAt)
                .updatedAt(createdAt)
                .build();

        when(quoteRequestRepository.findForDocumentManagement(any(), any())).thenReturn(List.of());
        when(manualDocumentRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(manualDocument));

        DocumentManagementService service = new DocumentManagementService(
                quoteRequestRepository,
                quoteDocumentRepository,
                manualDocumentRepository
        );

        var rows = service.listRows(null, null, null, null, null);

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).quoteId()).isNull();
        assertThat(rows.get(0).number()).isEqualTo("FA-MAN-0001");
    }

    @Test
    void createDocumentStoresManualDocumentWithoutQuoteRelation() {
        LocalDateTime createdAt = LocalDateTime.of(2026, 6, 4, 12, 15);
        when(manualDocumentRepository.existsByTypeIgnoreCaseAndNumberIgnoreCase("PEDIDO", "PED-MAN-0001"))
                .thenReturn(false);
        when(manualDocumentRepository.save(any(ManualDocument.class))).thenAnswer(invocation -> {
            ManualDocument document = invocation.getArgument(0);
            document.setId(UUID.randomUUID());
            document.setCreatedAt(createdAt);
            document.setUpdatedAt(createdAt);
            return document;
        });

        DocumentManagementService service = new DocumentManagementService(
                quoteRequestRepository,
                quoteDocumentRepository,
                manualDocumentRepository
        );

        var row = service.createDocument(new DocumentManagementCreateRequest(
                "Cliente Manual",
                "PEDIDO",
                "PED-MAN-0001"
        ));

        ArgumentCaptor<ManualDocument> captor = ArgumentCaptor.forClass(ManualDocument.class);
        verify(manualDocumentRepository).save(captor.capture());

        assertThat(captor.getValue().getCustomerName()).isEqualTo("Cliente Manual");
        assertThat(captor.getValue().getType()).isEqualTo("PEDIDO");
        assertThat(captor.getValue().getNumber()).isEqualTo("PED-MAN-0001");
        assertThat(row.quoteId()).isNull();
        assertThat(row.customerName()).isEqualTo("Cliente Manual");
        assertThat(row.type()).isEqualTo("PEDIDO");
        assertThat(row.number()).isEqualTo("PED-MAN-0001");
    }

    @Test
    void listRowsStillIncludesQuoteBasedDocuments() {
        UUID quoteId = UUID.randomUUID();
        LocalDateTime createdAt = LocalDateTime.of(2026, 6, 4, 8, 0);
        QuoteRequestRepository.DocumentManagementQuoteRow quoteRow = quoteRow(
                quoteId,
                "P-2026-0604",
                "Cliente Base",
                QuoteStatus.ENVIADO,
                createdAt
        );

        when(quoteRequestRepository.findForDocumentManagement(any(), any())).thenReturn(List.of(quoteRow));
        when(quoteDocumentRepository.findByQuoteRequestIdInOrderByCreatedAtDesc(List.of(quoteId))).thenReturn(List.of());
        when(manualDocumentRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of());

        DocumentManagementService service = new DocumentManagementService(
                quoteRequestRepository,
                quoteDocumentRepository,
                manualDocumentRepository
        );

        var rows = service.listRows(null, null, null, null, null);

        assertThat(rows).extracting("number").contains("P-2026-0604");
    }

    @Test
    void createDocumentRejectsDuplicateTypeAndNumber() {
        when(manualDocumentRepository.existsByTypeIgnoreCaseAndNumberIgnoreCase("FACTURA", "FA-MAN-0001"))
                .thenReturn(true);

        DocumentManagementService service = new DocumentManagementService(
                quoteRequestRepository,
                quoteDocumentRepository,
                manualDocumentRepository
        );

        assertThatThrownBy(() -> service.createDocument(new DocumentManagementCreateRequest(
                "Cliente Manual",
                "FACTURA",
                "FA-MAN-0001"
        )))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ya existe");
    }

    private QuoteRequestRepository.DocumentManagementQuoteRow quoteRow(
            UUID id,
            String quoteNumber,
            String customerName,
            QuoteStatus status,
            LocalDateTime createdAt
    ) {
        return new QuoteRequestRepository.DocumentManagementQuoteRow() {
            @Override
            public UUID getId() {
                return id;
            }

            @Override
            public String getQuoteNumber() {
                return quoteNumber;
            }

            @Override
            public LocalDateTime getCreatedAt() {
                return createdAt;
            }

            @Override
            public QuoteStatus getStatus() {
                return status;
            }

            @Override
            public String getCustomerName() {
                return customerName;
            }
        };
    }
}
