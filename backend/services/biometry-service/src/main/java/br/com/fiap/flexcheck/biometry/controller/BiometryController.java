package br.com.fiap.flexcheck.biometry.controller;

import br.com.fiap.flexcheck.biometry.application.FindBiometryVerificationUseCase;
import br.com.fiap.flexcheck.biometry.application.RecordBiometryVerificationUseCase;
import br.com.fiap.flexcheck.biometry.application.ReviewBiometryVerificationUseCase;
import br.com.fiap.flexcheck.biometry.application.command.BiometryReviewCommand;
import br.com.fiap.flexcheck.biometry.application.command.BiometryVerificationCommand;
import br.com.fiap.flexcheck.biometry.service.result.BiometryVerificationResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/biometry")
public class BiometryController {
    private final RecordBiometryVerificationUseCase recordBiometryVerificationUseCase;
    private final FindBiometryVerificationUseCase findBiometryVerificationUseCase;
    private final ReviewBiometryVerificationUseCase reviewBiometryVerificationUseCase;

    public BiometryController(
            RecordBiometryVerificationUseCase recordBiometryVerificationUseCase,
            FindBiometryVerificationUseCase findBiometryVerificationUseCase,
            ReviewBiometryVerificationUseCase reviewBiometryVerificationUseCase
    ) {
        this.recordBiometryVerificationUseCase = recordBiometryVerificationUseCase;
        this.findBiometryVerificationUseCase = findBiometryVerificationUseCase;
        this.reviewBiometryVerificationUseCase = reviewBiometryVerificationUseCase;
    }

    @PostMapping("/verifications")
    public BiometryVerificationResult record(@Valid @RequestBody BiometryVerificationCommand command) {
        return recordBiometryVerificationUseCase.execute(command);
    }

    @GetMapping("/verifications/{verificationId}")
    public BiometryVerificationResult findById(@PathVariable Long verificationId) {
        return findBiometryVerificationUseCase.execute(verificationId);
    }

    @PostMapping("/verifications/{verificationId}/review")
    public BiometryVerificationResult review(
            @PathVariable Long verificationId,
            @Valid @RequestBody BiometryReviewCommand command
    ) {
        return reviewBiometryVerificationUseCase.execute(verificationId, command);
    }
}
