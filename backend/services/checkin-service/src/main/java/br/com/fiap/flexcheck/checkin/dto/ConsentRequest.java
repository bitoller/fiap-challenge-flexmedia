package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.Valid;

import java.util.List;

public record ConsentRequest(@Valid List<ConsentItem> items) {
}
