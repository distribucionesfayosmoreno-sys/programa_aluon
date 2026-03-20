package com.aluon.production.cutlist;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cutlists")
@RequiredArgsConstructor
public class CutlistController {

    private final CutlistService cutlistService;

    @PostMapping
    public ResponseEntity<CutlistResponseDto> generate(@RequestBody CutlistRequestDto request) {
        return ResponseEntity.ok(cutlistService.generate(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CutlistResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(cutlistService.findById(id));
    }
}
