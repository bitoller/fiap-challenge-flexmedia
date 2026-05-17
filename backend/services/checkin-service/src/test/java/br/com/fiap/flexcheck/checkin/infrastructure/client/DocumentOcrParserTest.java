package br.com.fiap.flexcheck.checkin.infrastructure.client;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DocumentOcrParserTest {
    @Test
    void shouldExtractNameAndCpfFromBrazilianDriverLicenseText() {
        String text = """
                CARTEIRA NACIONAL DE HABILITACAO DRIVER LICENSE
                2 E 1 NOME E SOBRENOME
                SAMPLE TEST GUEST
                3 DATA LOCAL E UF DE NASCIMENTO
                01/01/1990 SAMPLE CITY
                4A DATA EMISSAO
                01/01/2026
                4D CPF
                000.000.001-91
                5 NR REGISTRO
                00000000000
                FILIACAO
                SAMPLE TEST PARENT
                """;

        DocumentOcrParser.ParsedDocument document = DocumentOcrParser.parse(text);

        assertThat(document.fullName()).isEqualTo("SAMPLE TEST GUEST");
        assertThat(document.documentNumber()).isEqualTo("00000000191");
    }

    @Test
    void shouldAvoidUsingHeaderAsName() {
        String text = """
                SECRETARIA NACIONAL DE TRANSITO
                CARTEIRA NACIONAL DE HABILITACAO
                4D CPF 00000000191
                NOME
                SAMPLE FALLBACK GUEST
                """;

        DocumentOcrParser.ParsedDocument document = DocumentOcrParser.parse(text);

        assertThat(document.fullName()).isEqualTo("SAMPLE FALLBACK GUEST");
        assertThat(document.documentNumber()).isEqualTo("00000000191");
    }
}
