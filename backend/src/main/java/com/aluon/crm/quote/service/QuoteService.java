package com.aluon.crm.quote.service;

import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.repository.CustomerRepository;
import com.aluon.crm.pricing.model.Tariff;
import com.aluon.crm.pricing.service.TariffService;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import com.aluon.crm.quote.model.QuoteChannel;
import com.aluon.crm.quote.dto.QuoteCreateRequest;
import com.aluon.crm.quote.model.QuoteItem;
import com.aluon.crm.quote.dto.QuoteItemRequest;
import com.aluon.crm.quote.dto.QuoteItemResponse;
import com.aluon.crm.quote.dto.QuoteRequest;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import com.aluon.crm.quote.dto.QuoteResponse;
import com.aluon.crm.quote.dto.QuoteSendRequest;
import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.model.QuoteValidationMode;


@Service
@RequiredArgsConstructor
public class QuoteService {

    private static final BigDecimal MM2_IN_M2 = BigDecimal.valueOf(1_000_000);

    private final QuoteRequestRepository quoteRequestRepository;
    private final CustomerRepository customerRepository;
    private final TariffService tariffService;

    @Transactional
    public QuoteResponse create(QuoteCreateRequest request) {
        validateCreate(request);

        UUID customerId = Objects.requireNonNull(request.getCustomerId(), "customerId");
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

        Tariff tariff = tariffService.getTariffByCode(customer.getTarifa());

        QuoteValidationMode validationMode = customer.isAutoApproveQuotes() ? QuoteValidationMode.AUTO : QuoteValidationMode.MANUAL;
        QuoteChannel channel = request.getChannel() == null ? QuoteChannel.BOTH : request.getChannel();

        QuoteRequest quote = QuoteRequest.builder()
                .quoteNumber(generateQuoteNumber())
                .customer(customer)
                .tariffCode(tariff.getCode())
                .contactEmail(customer.getEmail())
                .contactWhatsapp(customer.getTelefono())
                .status(validationMode == QuoteValidationMode.AUTO ? QuoteStatus.ENVIADO : QuoteStatus.PENDIENTE_VALIDACION)
                .validationMode(validationMode)
                .channel(channel)
                .createdAt(LocalDateTime.now())
                .build();

        List<QuoteItem> items = request.getItems().stream()
                .map(item -> toQuoteItem(quote, tariff, item))
                .toList();

        BigDecimal total = items.stream()
                .map(QuoteItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        quote.setItems(items);
        quote.setTotal(total);

        if (validationMode == QuoteValidationMode.AUTO) {
            LocalDateTime now = LocalDateTime.now();
            quote.setValidatedAt(now);
            quote.setSentAt(now);
        }

        QuoteRequest saved = quoteRequestRepository.save(quote);
        return toResponse(Objects.requireNonNull(saved, "saved"));
    }

    @Transactional
    public QuoteResponse validate(UUID id) {
        UUID quoteId = Objects.requireNonNull(id, "id");
        QuoteRequest quote = quoteRequestRepository.findById(quoteId)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));

        if (quote.getStatus() == QuoteStatus.ENVIADO) {
            return toResponse(quote);
        }

        quote.setStatus(QuoteStatus.VALIDADO);
        quote.setValidatedAt(LocalDateTime.now());
        return toResponse(quoteRequestRepository.save(quote));
    }

    @Transactional
    public QuoteResponse send(UUID id, QuoteSendRequest request) {
        UUID quoteId = Objects.requireNonNull(id, "id");
        QuoteRequest quote = quoteRequestRepository.findById(quoteId)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));

        if (quote.getStatus() != QuoteStatus.VALIDADO && quote.getStatus() != QuoteStatus.ENVIADO) {
            throw new IllegalArgumentException("El presupuesto debe estar validado antes de enviar");
        }

        QuoteChannel channel = request != null && request.getChannel() != null ? request.getChannel() : quote.getChannel();
        quote.setChannel(channel);
        quote.setStatus(QuoteStatus.ENVIADO);
        quote.setSentAt(LocalDateTime.now());
        return toResponse(quoteRequestRepository.save(quote));
    }

    @Transactional(readOnly = true)
    public QuoteResponse getById(UUID id) {
        UUID quoteId = Objects.requireNonNull(id, "id");
        QuoteRequest quote = quoteRequestRepository.findById(quoteId)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
        return toResponse(quote);
    }

    private QuoteItem toQuoteItem(QuoteRequest quote, Tariff tariff, QuoteItemRequest item) {
        Objects.requireNonNull(quote, "quote");
        Objects.requireNonNull(tariff, "tariff");
        Objects.requireNonNull(item, "item");
        DoorModel doorModel = item.getDoorModel();
        DoorType doorType = item.getDoorType();

        Integer widthMm = Objects.requireNonNull(item.getWidthMm(), "widthMm");
        Integer heightMm = Objects.requireNonNull(item.getHeightMm(), "heightMm");

        BigDecimal m2 = BigDecimal.valueOf(widthMm)
                .multiply(BigDecimal.valueOf(heightMm))
                .divide(MM2_IN_M2, 4, RoundingMode.HALF_UP);

        BigDecimal pricePerM2 = tariffService.getPricePerM2(tariff, doorModel, doorType)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal lineTotal = m2.multiply(pricePerM2).setScale(2, RoundingMode.HALF_UP);

        return QuoteItem.builder()
                .quoteRequest(quote)
                .doorModel(doorModel)
                .doorType(doorType)
                .widthMm(widthMm)
                .heightMm(heightMm)
                .m2(m2)
                .pricePerM2(pricePerM2)
                .lineTotal(lineTotal)
                .build();
    }

    private QuoteResponse toResponse(QuoteRequest quote) {
        Customer customer = quote.getCustomer();
        return QuoteResponse.builder()
                .id(quote.getId())
                .quoteNumber(quote.getQuoteNumber())
                .customerId(customer != null ? customer.getId() : null)
                .customerName(customer != null
                        ? (customer.getNombreComercial() != null ? customer.getNombreComercial() : customer.getRazonSocial())
                        : null)
                .contactEmail(quote.getContactEmail())
                .contactWhatsapp(quote.getContactWhatsapp())
                .tariffCode(quote.getTariffCode())
                .status(quote.getStatus())
                .validationMode(quote.getValidationMode())
                .channel(quote.getChannel())
                .total(quote.getTotal())
                .createdAt(quote.getCreatedAt())
                .validatedAt(quote.getValidatedAt())
                .sentAt(quote.getSentAt())
                .items(quote.getItems().stream()
                        .map(item -> QuoteItemResponse.builder()
                                .doorModel(item.getDoorModel())
                                .doorType(item.getDoorType())
                                .widthMm(item.getWidthMm())
                                .heightMm(item.getHeightMm())
                                .m2(item.getM2())
                                .pricePerM2(item.getPricePerM2())
                                .lineTotal(item.getLineTotal())
                                .build())
                        .toList())
                .build();
    }

    private String generateQuoteNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String suffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "OF-" + date + "-" + suffix;
    }

    private void validateCreate(QuoteCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("El cliente es obligatorio");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Debe incluir al menos un producto");
        }
        for (QuoteItemRequest item : request.getItems()) {
            if (item == null) {
                throw new IllegalArgumentException("El producto es obligatorio");
            }
            if (item.getDoorModel() == null) {
                throw new IllegalArgumentException("El modelo es obligatorio");
            }
            if (item.getDoorType() == null) {
                throw new IllegalArgumentException("El tipo de producto es obligatorio");
            }
            if (item.getWidthMm() == null || item.getWidthMm() <= 0) {
                throw new IllegalArgumentException("El ancho es obligatorio");
            }
            if (item.getHeightMm() == null || item.getHeightMm() <= 0) {
                throw new IllegalArgumentException("El alto es obligatorio");
            }
        }
    }
}
