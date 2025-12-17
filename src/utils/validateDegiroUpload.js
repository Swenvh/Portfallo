export function validateDegiroUpload(rows = []) {
  if (!rows.length) {
    return { ok: false, error: "Leeg bestand" };
  }

  const required = ["Datum", "Omschrijving", "_1"];
  const missing = required.filter(
    col => !Object.keys(rows[0]).includes(col)
  );

  if (missing.length) {
    return {
      ok: false,
      error: `Ontbrekende kolommen: ${missing.join(", ")}`
    };
  }

  return { ok: true };
}
