package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnQuoteResult;

public interface ListCheckinAddOnsUseCase {
    CheckinAddOnQuoteResult execute(Long sessionId);
}
