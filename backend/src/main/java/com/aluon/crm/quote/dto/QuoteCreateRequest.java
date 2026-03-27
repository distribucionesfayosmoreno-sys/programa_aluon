package com.aluon.crm.quote.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;
import com.aluon.crm.quote.model.QuoteChannel;


@Getter
@Setter
public class QuoteCreateRequest {
    private UUID customerId;
    private QuoteChannel channel;
    private List<QuoteItemRequest> items;
}
