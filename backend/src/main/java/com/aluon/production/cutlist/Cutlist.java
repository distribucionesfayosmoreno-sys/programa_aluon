package com.aluon.production.cutlist;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cutlists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cutlist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "door_type", nullable = false)
    private DoorType doorType;

    @Enumerated(EnumType.STRING)
    @Column(name = "door_model", nullable = false)
    private DoorModel doorModel;

    @Column(name = "width_mm", nullable = false)
    private Integer widthMm;

    @Column(name = "height_mm", nullable = false)
    private Integer heightMm;

    @Column(name = "distributor")
    private String distributor;

    @Column(name = "budget_number")
    private String budgetNumber;

    @Column(name = "budget_date")
    private LocalDate budgetDate;

    @Column(name = "color")
    private String color;

    @Column(name = "installer_name")
    private String installerName;

    @Column(name = "ground_clearance_mm")
    private Integer groundClearanceMm;

    @Column(name = "height_left_mm")
    private Integer heightLeftMm;

    @Column(name = "height_right_mm")
    private Integer heightRightMm;

    @Column(name = "width_left_mm")
    private Integer widthLeftMm;

    @Column(name = "width_right_mm")
    private Integer widthRightMm;

    @Column(name = "larguero_mm")
    private Integer largueroMm;

    @Column(name = "top_frame")
    private Boolean topFrame;

    @Enumerated(EnumType.STRING)
    @Column(name = "hinges_side")
    private HingesSide hingesSide;

    @Column(name = "porter_automatic")
    private Boolean porterAutomatic;

    @Column(name = "automation_included")
    private Boolean automationIncluded;

    @Column(name = "automation_reinforcement")
    private Boolean automationReinforcement;

    @Enumerated(EnumType.STRING)
    @Column(name = "opening_side")
    private OpeningSide openingSide;

    @Enumerated(EnumType.STRING)
    @Column(name = "rail_type")
    private RailType railType;

    @Enumerated(EnumType.STRING)
    @Column(name = "mounting_type")
    private MountingType mountingType;

    @Column(name = "tail")
    private Boolean tail;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "cutlist", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CutlistItem> items = new ArrayList<>();

    public void setItems(List<CutlistItem> items) {
        this.items.clear();
        if (items != null) {
            items.forEach(item -> item.setCutlist(this));
            this.items.addAll(items);
        }
    }
}
