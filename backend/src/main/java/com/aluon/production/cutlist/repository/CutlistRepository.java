package com.aluon.production.cutlist.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import com.aluon.production.cutlist.model.Cutlist;


public interface CutlistRepository extends JpaRepository<Cutlist, UUID> {
}
