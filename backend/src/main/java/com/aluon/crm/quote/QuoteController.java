package com.aluon.crm.quote;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService quoteService;

    @PostMapping
    public ResponseEntity<QuoteResponse> create(@RequestBody QuoteCreateRequest request) {
        return ResponseEntity.ok(quoteService.create(request));
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<QuoteResponse> validate(@PathVariable UUID id) {
        return ResponseEntity.ok(quoteService.validate(id));
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<QuoteResponse> send(@PathVariable UUID id, @RequestBody(required = false) QuoteSendRequest request) {
        return ResponseEntity.ok(quoteService.send(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuoteResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(quoteService.getById(id));
    }
}
