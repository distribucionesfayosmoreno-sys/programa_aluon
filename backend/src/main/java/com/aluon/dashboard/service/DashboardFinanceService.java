package com.aluon.dashboard.service;

import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.repository.QuoteItemRepository;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import com.aluon.dashboard.api.DashboardFinanceResponse;
import com.aluon.dashboard.api.DashboardRange;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardFinanceService {

        private final QuoteRequestRepository quoteRequestRepository;
        private final QuoteItemRepository quoteItemRepository;
        private final Clock clock = Clock.systemDefaultZone();
        private static final String DOC_TIPO_FACTURA = "FACTURA";

        public DashboardFinanceResponse getFinance(DashboardRange range) {
                LocalDateTime start = range.start(clock);
                LocalDateTime end = range.endExclusive(clock);

                BigDecimal incomeTotal = quoteRequestRepository.sumTotalByDocumentTipoAndCreatedAtBetween(
                                DOC_TIPO_FACTURA, start, end);
                List<DashboardFinanceResponse.Slice> incomeSlices = quoteItemRepository
                                .sumLineTotalByDoorModelForDocumentTipo(DOC_TIPO_FACTURA, start, end)
                                .stream()
                                .limit(8)
                                .map(row -> new DashboardFinanceResponse.Slice(
                                                row.getDoorModel().name().toLowerCase(),
                                                prettyEnum(row.getDoorModel().name()),
                                                row.getTotal()))
                                .toList();

                DashboardFinanceResponse.Donut income = new DashboardFinanceResponse.Donut("Ingresos", incomeTotal,
                                incomeSlices);

                DashboardFinanceResponse.Donut expenses = new DashboardFinanceResponse.Donut(
                                "Gastos",
                                BigDecimal.ZERO,
                                List.of());

                BigDecimal saving = incomeTotal.subtract(expenses.total());

                List<DashboardFinanceResponse.Tile> tiles = List.of(
                                new DashboardFinanceResponse.Tile("expenses", "Gastos", expenses.total()),
                                new DashboardFinanceResponse.Tile("saving", "Ahorro", saving.max(BigDecimal.ZERO)),
                                new DashboardFinanceResponse.Tile("income", "Ingresos", income.total()),
                                new DashboardFinanceResponse.Tile("investments", "Inversiones", BigDecimal.ZERO));

                List<DashboardFinanceResponse.Point> trendPoints = quoteRequestRepository
                                .sumDailyTotalsByDocumentTipoAndCreatedAtBetween(DOC_TIPO_FACTURA, start, end)
                                .stream()
                                .map(row -> new DashboardFinanceResponse.Point(row.getDay(), row.getTotal()))
                                .toList();

                DashboardFinanceResponse.Trend trend = new DashboardFinanceResponse.Trend(labelFor(range, clock),
                                trendPoints);

                var pageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt"));
                List<DashboardFinanceResponse.Transaction> transactions = quoteRequestRepository
                                .findRecentByDocumentTipoAndCreatedAtBetween(DOC_TIPO_FACTURA, start, end, pageable)
                                .stream()
                                .map(row -> new DashboardFinanceResponse.Transaction(
                                                row.getId().toString(),
                                                row.getCustomerName(),
                                                row.getQuoteNumber(),
                                                row.getTotal(),
                                                row.getCreatedAt().toLocalDate(),
                                                "in"))
                                .toList();

                List<DashboardFinanceResponse.Bar> paymentIssues = List.of(
                                new DashboardFinanceResponse.Bar(
                                                "pending",
                                                "Pendiente",
                                                quoteRequestRepository.countByStatusAndCreatedAtBetween(
                                                                QuoteStatus.PENDIENTE_VALIDACION, start, end)),
                                new DashboardFinanceResponse.Bar(
                                                "validated",
                                                "Validado",
                                                quoteRequestRepository.countByStatusAndCreatedAtBetween(
                                                                QuoteStatus.VALIDADO, start, end)),
                                new DashboardFinanceResponse.Bar(
                                                "sent",
                                                "Enviado",
                                                quoteRequestRepository.countByStatusAndCreatedAtBetween(
                                                                QuoteStatus.ENVIADO, start, end)));

                List<DashboardFinanceResponse.HistogramRow> histogram = quoteRequestRepository
                                .topCustomersByDocumentTipoTotal(DOC_TIPO_FACTURA, start, end, PageRequest.of(0, 6))
                                .stream()
                                .map(row -> new DashboardFinanceResponse.HistogramRow(
                                                row.getCustomerName().toLowerCase().replace(' ', '-'),
                                                row.getCustomerName(),
                                                row.getTotal()))
                                .toList();

                return new DashboardFinanceResponse(income, expenses, tiles, trend, transactions, paymentIssues,
                                histogram);
        }

        private static String prettyEnum(String value) {
                String lower = value.toLowerCase().replace('_', ' ');
                if (lower.isBlank())
                        return value;
                return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
        }

        private static String labelFor(DashboardRange range, Clock clock) {
                LocalDate now = LocalDate.now(clock);
                String prettyMonth = now.getMonth().getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
                return switch (range) {
                        case DAY -> now.toString();
                        case WEEK -> "Últimos 7 días";
                        case MONTH -> prettyMonth + " " + now.getYear();
                        case YEAR -> String.valueOf(now.getYear());
                };
        }
}
