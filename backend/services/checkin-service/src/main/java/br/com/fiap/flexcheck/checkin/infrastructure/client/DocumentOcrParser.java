package br.com.fiap.flexcheck.checkin.infrastructure.client;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

final class DocumentOcrParser {
    private static final Pattern CPF_LABEL_PATTERN = Pattern.compile("(?i)(?:CPF|4A\\s*CPF|N[ºO]?\\s*CPF)[^0-9]{0,30}([0-9][0-9.\\-\\s]{9,24}[0-9])");
    private static final Pattern DOCUMENT_CANDIDATE_PATTERN = Pattern.compile("(?<!\\d)([0-9][0-9.\\-\\s]{9,24}[0-9])(?!\\d)");

    private DocumentOcrParser() {
    }

    static ParsedDocument parse(String text) {
        return new ParsedDocument(extractName(text), extractCpf(text));
    }

    private static String extractCpf(String text) {
        String safeText = text == null ? "" : text;
        var labeledMatcher = CPF_LABEL_PATTERN.matcher(safeText);
        while (labeledMatcher.find()) {
            String candidate = firstValidCpfInDigits(digits(labeledMatcher.group(1)));
            if (candidate != null) {
                return candidate;
            }
        }

        var candidates = new ArrayList<String>();
        var matcher = DOCUMENT_CANDIDATE_PATTERN.matcher(safeText);
        while (matcher.find()) {
            String candidate = digits(matcher.group(1));
            if (candidate.length() == 11 && !candidates.contains(candidate)) {
                candidates.add(candidate);
            }
        }

        return candidates.stream()
                .filter(DocumentOcrParser::isValidCpf)
                .findFirst()
                .orElse(null);
    }

    private static String extractName(String text) {
        List<String> lines = normalizedLines(text);
        for (int index = 0; index < lines.size(); index++) {
            String line = lines.get(index);
            if (line.contains("NOME")) {
                String sameLine = line.replaceFirst(".*NOME\\s*(?:E\\s*SOBRENOME)?\\s*", "").trim();
                if (isNameCandidate(sameLine)) {
                    return sameLine;
                }
                for (int next = index + 1; next < Math.min(lines.size(), index + 4); next++) {
                    String candidate = lines.get(next);
                    if (isNameCandidate(candidate)) {
                        return candidate;
                    }
                }
            }
        }

        return lines.stream()
                .filter(DocumentOcrParser::isNameCandidate)
                .findFirst()
                .orElse(null);
    }

    private static List<String> normalizedLines(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }
        List<String> lines = new ArrayList<>();
        for (String rawLine : text.split("\\R")) {
            String line = normalize(rawLine);
            if (!line.isBlank()) {
                lines.add(line);
            }
        }
        return lines;
    }

    private static boolean isNameCandidate(String value) {
        if (value == null || value.isBlank() || value.matches(".*\\d.*")) {
            return false;
        }
        String normalized = normalize(value);
        if (normalized.length() < 7 || normalized.split("\\s+").length < 2) {
            return false;
        }
        return !containsAny(normalized,
                "CARTEIRA",
                "NACIONAL",
                "HABILITACAO",
                "DRIVER",
                "LICENSE",
                "PERMISSAO",
                "DOCUMENTO",
                "IDENTIDADE",
                "VALIDA",
                "VALIDADE",
                "NASCIMENTO",
                "EMISSAO",
                "REGISTRO",
                "FILIACAO",
                "ASSINATURA",
                "BRASILEIRO",
                "REPUBLICA",
                "FEDERATIVA",
                "TRANSITO",
                "CATEGORIA",
                "CPF"
        );
    }

    private static boolean containsAny(String value, String... blockedTerms) {
        for (String term : blockedTerms) {
            if (value.contains(term)) {
                return true;
            }
        }
        return false;
    }

    private static String normalize(String value) {
        return Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^A-Za-z ]", " ")
                .replaceAll("\\s+", " ")
                .trim()
                .toUpperCase();
    }

    private static String digits(String value) {
        return value == null ? "" : value.replaceAll("\\D", "");
    }

    private static String firstValidCpfInDigits(String digits) {
        if (digits == null || digits.length() < 11) {
            return null;
        }
        for (int index = 0; index <= digits.length() - 11; index++) {
            String candidate = digits.substring(index, index + 11);
            if (isValidCpf(candidate)) {
                return candidate;
            }
        }
        return null;
    }

    private static boolean isValidCpf(String cpf) {
        if (cpf == null || !cpf.matches("\\d{11}") || cpf.chars().distinct().count() == 1) {
            return false;
        }
        return cpfDigit(cpf, 9) == cpf.charAt(9) - '0' && cpfDigit(cpf, 10) == cpf.charAt(10) - '0';
    }

    private static int cpfDigit(String cpf, int length) {
        int sum = 0;
        for (int index = 0; index < length; index++) {
            sum += (cpf.charAt(index) - '0') * (length + 1 - index);
        }
        int result = 11 - (sum % 11);
        return result >= 10 ? 0 : result;
    }

    record ParsedDocument(String fullName, String documentNumber) {
    }
}
