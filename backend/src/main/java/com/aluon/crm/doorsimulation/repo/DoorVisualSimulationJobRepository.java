package com.aluon.crm.doorsimulation.repo;

import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DoorVisualSimulationJobRepository extends JpaRepository<DoorVisualSimulationJob, UUID> {
}

