/**
 * Contacto comercial para pedidos de upgrade (ativação manual de planos).
 * PLACEHOLDER: substituir pelo endereço real antes do lançamento.
 */
export const UPGRADE_CONTACT_EMAIL = "comercial@expressqr.example";

/** Link `mailto:` para "Pedir upgrade", com plano e conta já preenchidos. */
export function buildUpgradeMailto({
  planName,
  accountEmail,
  subject,
  body,
}: {
  planName?: string;
  accountEmail?: string | null;
  subject: string;
  body: string;
}): string {
  const lines = [body];
  if (planName) lines.push(`Plano: ${planName}`);
  if (accountEmail) lines.push(`Conta: ${accountEmail}`);
  const params = new URLSearchParams({
    subject: planName ? `${subject} — ${planName}` : subject,
    body: lines.join("\n"),
  });
  // URLSearchParams codifica espaços como "+", que os clientes de email não descodificam.
  return `mailto:${UPGRADE_CONTACT_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}
