package com.aluon.production.cutlist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CutlistRepository extends JpaRepository<Cutlist, UUID> {
}
