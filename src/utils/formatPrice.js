export const formatPrice = (n) =>
  n == null
    ? "Enquire for price"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n);
