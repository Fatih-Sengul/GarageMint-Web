export function trAuctionStatus(s?: string) {
  switch ((s||"").toUpperCase()) {
    case "ACTIVE": return "Aktif";
    case "SCHEDULED": return "Planlandı";
    case "ENDED": return "Bitti";
    case "CANCELLED": return "İptal";
    default: return s ?? "";
  }
}
