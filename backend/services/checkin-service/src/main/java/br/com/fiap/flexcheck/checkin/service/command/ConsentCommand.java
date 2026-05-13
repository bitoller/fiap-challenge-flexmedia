package br.com.fiap.flexcheck.checkin.service.command;

import java.util.List;

public record ConsentCommand(List<ConsentItemCommand> items) {

    public record ConsentItemCommand(
            String type,
            boolean accepted,
            String version
    ) {
    }
}

