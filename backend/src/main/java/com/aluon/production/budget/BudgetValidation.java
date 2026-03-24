package com.aluon.production.budget;

import com.aluon.core.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "budget_validations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetValidation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "budget_number", nullable = false, unique = true)
    private String budgetNumber;

    @Column(name = "request_id", nullable = false)
    private String requestId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "model_label")
    private String modelLabel;

    @Column(name = "m2", precision = 12, scale = 2)
    private BigDecimal m2;

    @Column(name = "total", nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetValidationStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;
}
