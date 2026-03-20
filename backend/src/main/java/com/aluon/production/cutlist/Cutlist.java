package com.aluon.production.cutlist;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

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

    @Column(name = "ground_clearance_mm")
    private Integer groundClearanceMm;

    @Column(name = "larguero_mm")
    private Integer largueroMm;

    @Column(name = "top_frame")
    private Boolean topFrame;

    @Column(name = "automation_reinforcement")
    private Boolean automationReinforcement;

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
