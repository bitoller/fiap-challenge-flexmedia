export function getCurrencyLocale(language: string) {
  if (language === "pt-BR") return "pt-BR";
  if (language === "es") return "es-ES";
  return "en-US";
}

export function formatCurrency(amount: number, currency: string, language: string) {
  const value = new Intl.NumberFormat(getCurrencyLocale(language), {
    style: "currency",
    currency,
  }).format(amount);

  return currency === "BRL" ? value.replace(/^R\$(?=\d)/, "R$ ") : value;
}
