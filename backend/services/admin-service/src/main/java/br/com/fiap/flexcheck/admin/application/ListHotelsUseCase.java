package br.com.fiap.flexcheck.admin.application;

import br.com.fiap.flexcheck.admin.service.result.HotelSummaryResult;

import java.util.List;

public interface ListHotelsUseCase {
    List<HotelSummaryResult> execute();
}
