package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;

import java.util.List;

public interface DoorCutlistGenerator {
    DoorType supports();

    List<CutlistLine> generate(CutlistRequestDto request);
}

