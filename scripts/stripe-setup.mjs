import Stripe from "stripe";
import { readFileSync, appendFileSync } from "fs";
import { resolve } from "path";

// Charge .env.local manuellement
const envContent = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" });

async function main() {
  console.log("Création des produits Stripe...");

  const solo = await stripe.products.create({
    name: "Solo",
    description: "Pour les agents indépendants — jusqu'à 10 biens par mois",
  });
  const soloPrice = await stripe.prices.create({
    product: solo.id,
    unit_amount: 2900,
    currency: "eur",
    recurring: { interval: "month" },
    nickname: "solo_mensuel",
  });

  const equipe = await stripe.products.create({
    name: "Équipe",
    description: "Pour les agences — biens illimités",
  });
  const equipePrice = await stripe.prices.create({
    product: equipe.id,
    unit_amount: 7900,
    currency: "eur",
    recurring: { interval: "month" },
    nickname: "equipe_mensuel",
  });

  const lines = `\nSTRIPE_PRICE_SOLO=${soloPrice.id}\nSTRIPE_PRICE_EQUIPE=${equipePrice.id}\nSTRIPE_WEBHOOK_SECRET=\n`;
  appendFileSync(resolve(process.cwd(), ".env.local"), lines);

  console.log("✅ Produits créés et price IDs ajoutés dans .env.local");
  console.log(`   STRIPE_PRICE_SOLO=${soloPrice.id}`);
  console.log(`   STRIPE_PRICE_EQUIPE=${equipePrice.id}`);
  console.log("\n⚠️  Ajoute STRIPE_WEBHOOK_SECRET depuis le Dashboard Stripe → Webhooks");
}

main().catch(console.error);
