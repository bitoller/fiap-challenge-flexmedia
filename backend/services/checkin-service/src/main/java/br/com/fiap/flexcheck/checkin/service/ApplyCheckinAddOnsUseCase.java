package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.ApplyCheckinAddOnsCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnQuoteResult;

public interface ApplyCheckinAddOnsUseCase {
    CheckinAddOnQuoteResult execute(Long sessionId, ApplyCheckinAddOnsCommand command);
}
