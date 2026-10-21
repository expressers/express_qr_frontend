 function formatCurrency  (value: number, locale = "en-Us", currency = "USD")  {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

export {formatCurrency}