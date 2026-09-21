/**
 * TYT – Take Your Time | Offers Data
 * -----------------------------------------------------------------
 * ⚠️ PLACEHOLDER / DEMO DATA ⚠️
 * The current project files contained no real offers or promo
 * pricing, so the entries below are TEMPORARY SAMPLE OFFERS only —
 * they are NOT real TYT promotions and must not be published as-is.
 *
 * TO PUBLISH REAL OFFERS: replace the values below with your actual
 * promotions (or delete entries you don't need). Every field is
 * plain text/numbers — no code knowledge required.
 *
 * Fields:
 *   badge        "SPECIAL OFFER" | "LIMITED TIME" | any short label
 *   badgeStyle   "special" | "limited"  (controls the badge color)
 *   icon         an emoji shown on the card if no `image` is set
 *   image        optional path to a real photo, e.g. "images/offers/1.jpg"
 *   name         offer title
 *   description  one short sentence
 *   oldPrice     original price in EGP (optional — omit to hide)
 *   newPrice     offer price in EGP
 *   discount     text shown as the discount tag, e.g. "-20%" (optional)
 *   cta          button label, e.g. "Order Now"
 * -----------------------------------------------------------------
 */

window.OFFERS_DATA = [
  {
    badge: "SPECIAL OFFER",
    badgeStyle: "special",
    icon: "☕",
    name: "Latte + Croissant Combo",
    description: "Any hot latte paired with a plain croissant — our classic slow-morning combo.",
    oldPrice: 125,
    newPrice: 95,
    discount: "-24%",
    cta: "Order Now"
  },
  {
    badge: "LIMITED TIME",
    badgeStyle: "limited",
    icon: "🥤",
    name: "Frappé Happy Hour",
    description: "Any Coffee or Non-Coffee Frappé, every day from 4–7 PM.",
    oldPrice: 105,
    newPrice: 80,
    discount: "-25%",
    cta: "View Offer"
  },
  {
    badge: "SPECIAL OFFER",
    badgeStyle: "special",
    icon: "🍫",
    name: "TYT Duo Treat",
    description: "Two milkshakes of your choice, made to share — perfect for taking your time together.",
    oldPrice: 190,
    newPrice: 155,
    discount: "-18%",
    cta: "Order Now"
  }
];
