package com.aluon.production.cutlist;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "cutlist_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CutlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cutlist_id", nullable = false)
    private Cutlist cutlist;

    @Column(name = "sort_index", nullable = false)
    private Integer sortIndex;

    @Column(name = "description", nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "units", nullable = false)
    private Integer units;

    @Column(name = "cut_measure", nullable = false)
    private String cutMeasure;
}
