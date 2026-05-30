package com.aluon.crm.doorsimulation.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "aluon_saas_door_visual_simulation_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoorVisualSimulationJob {

    @Id
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "address", nullable = false, columnDefinition = "text")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DoorVisualSimulationJobStatus status;

    @Column(name = "base_image_url", columnDefinition = "text")
    private String baseImageUrl;

    @Column(name = "result_image_url", columnDefinition = "text")
    private String resultImageUrl;

    @Column(name = "mask_x")
    private Integer maskX;

    @Column(name = "mask_y")
    private Integer maskY;

    @Column(name = "mask_width")
    private Integer maskWidth;

    @Column(name = "mask_height")
    private Integer maskHeight;

    @Column(name = "error_message", columnDefinition = "text")
    private String errorMessage;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

