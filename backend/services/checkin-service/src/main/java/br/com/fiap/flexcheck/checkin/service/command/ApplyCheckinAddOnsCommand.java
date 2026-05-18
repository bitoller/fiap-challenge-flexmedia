package br.com.fiap.flexcheck.checkin.service.command;

import java.util.List;

public record ApplyCheckinAddOnsCommand(
        List<String> selectedCodes
) {
}
