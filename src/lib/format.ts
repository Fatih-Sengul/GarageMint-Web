export const formatTRY = (n?: string | number | null) => {
  if (n === undefined || n === null) return "-";
  const val = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(val)) return "-";
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);
};

export const toMinBid = (startPrice: number, highest?: number | null) => {
  const base = highest ?? startPrice;
  return Math.round((base + 10) * 100) / 100; // +10 TL kuralı
};
