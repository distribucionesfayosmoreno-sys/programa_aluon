package com.aluon.crm.quote.dto;

import lombok.Getter;
import lombok.Setter;
import com.aluon.crm.quote.model.QuoteChannel;


@Getter
@Setter
public class QuoteSendRequest {
    private QuoteChannel channel;
}
