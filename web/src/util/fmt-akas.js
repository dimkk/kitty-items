export function fmtAkas(balance, cur = false) {
  if (balance == null) return null
  return [
    String(balance).replace(/0+$/, "").replace(/\.$/, ""),
    cur && "AKA",
  ]
    .filter(Boolean)
    .join(" ")
}
