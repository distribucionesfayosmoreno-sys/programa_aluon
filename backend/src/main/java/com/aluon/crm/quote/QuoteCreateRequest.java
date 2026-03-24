package com.aluon.crm.quote;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class QuoteCreateRequest {
    private UUID customerId;
    private QuoteChannel channel;
    private List<QuoteItemRequest> items;
}
