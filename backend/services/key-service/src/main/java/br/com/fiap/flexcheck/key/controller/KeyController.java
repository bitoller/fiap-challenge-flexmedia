package br.com.fiap.flexcheck.key.controller;

import br.com.fiap.flexcheck.key.application.IssueKeyUseCase;
import br.com.fiap.flexcheck.key.application.RevokeKeysUseCase;
import br.com.fiap.flexcheck.key.application.command.IssueKeyCommand;
import br.com.fiap.flexcheck.key.service.result.KeyResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/keys")
public class KeyController {
    private final IssueKeyUseCase issueKeyUseCase;
    private final RevokeKeysUseCase revokeKeysUseCase;

    public KeyController(IssueKeyUseCase issueKeyUseCase, RevokeKeysUseCase revokeKeysUseCase) {
        this.issueKeyUseCase = issueKeyUseCase;
        this.revokeKeysUseCase = revokeKeysUseCase;
    }

    @PostMapping("/issue")
    public KeyResult issue(@Valid @RequestBody IssueKeyCommand command) {
        return issueKeyUseCase.execute(command);
    }

    @PostMapping("/{stayId}/revoke")
    public void revoke(@PathVariable Long stayId) {
        revokeKeysUseCase.execute(stayId);
    }
}
