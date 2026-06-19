import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, prenom?: string) {
  const nom = prenom ? `, ${prenom}` : "";
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    : "https://studioimmo.fr/dashboard";

  try {
    const { error } = await resend.emails.send({
      from: "Studio Immo <onboarding@resend.dev>",
      to,
      subject: "Bienvenue sur Studio Immo 🏠",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:16px;overflow:hidden;max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#0a0a14;padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#c9a84c;border-radius:8px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                    <span style="font-size:14px;line-height:28px;">🏠</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-size:16px;font-weight:700;">Studio <span style="color:#c9a84c;">Immo</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.02em;">
                Bienvenue${nom}&nbsp;! 👋
              </h1>
              <p style="margin:0 0 16px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;">
                Nous sommes ravis de vous accueillir sur <strong style="color:#ffffff;">Studio Immo</strong>.
              </p>
              <p style="margin:0 0 16px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;">
                Studio Immo génère en quelques secondes une <strong style="color:#c9a84c;">stratégie marketing complète</strong> pour vos biens immobiliers&nbsp;: publications Facebook, légendes Instagram et idées visuelles — tout est prêt à publier.
              </p>
              <p style="margin:0 0 32px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;">
                Pour commencer, vous bénéficiez d'<strong style="color:#ffffff;">1 génération gratuite</strong>. Il suffit de renseigner votre bien et l'IA s'occupe du reste.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#c9a84c;border-radius:10px;">
                    <a href="${dashboardUrl}"
                       style="display:inline-block;padding:14px 28px;color:#0a0a0a;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:-0.01em;">
                      Créer mon premier bien →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;line-height:1.6;">
                Vous recevez cet email car vous venez de créer un compte Studio Immo.<br/>
                © ${new Date().getFullYear()} Studio Immo — Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    if (error) {
      console.error("[email] Échec envoi email de bienvenue:", error);
    } else {
      console.log("[email] Email de bienvenue envoyé à", to);
    }
  } catch (err) {
    console.error("[email] Exception lors de l'envoi email de bienvenue:", err);
  }
}
