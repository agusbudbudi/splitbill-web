export const ACTIVITY_EMOJI_MAP: Record<string, string> = {
  // Food & Drink
  makan: "🍽️",
  kopi: "☕",
  coffee: "☕",
  pizza: "🍕",
  ramen: "🍜",
  sushi: "🍣",
  burger: "🍔",
  bakso: "🥣",
  nasgor: "🍛",
  nasi: "🍚",
  ayam: "🍗",
  steak: "🥩",
  shabu: "🍲",
  grill: "🔥",
  barbeque: "🍖",
  bbq: "🍖",
  dimsum: "🥟",
  seafood: "🦞",
  dessert: "🍰",
  cake: "🎂",
  iceCream: "🍦",
  minuman: "🥤",
  drink: "🥤",
  bobba: "🧋",
  boba: "🧋",
  teh: "🍵",
  beer: "🍺",
  alkohol: "🍷",
  wine: "🍷",

  // Activities & Transport
  jalan: "🚗",
  liburan: "✈️",
  travel: "✈️",
  hotel: "🏨",
  villa: "🏡",
  tiket: "🎟️",
  nonton: "🎬",
  bioskop: "🎥",
  movie: "🎬",
  konser: "🎸",
  karaoke: "🎤",
  belanja: "🛍️",
  shopping: "🛒",
  gift: "🎁",
  hadiah: "🎁",
  patungan: "🤝",
  proyek: "💻",
  project: "💻",
  donasi: "❤️",

  // Sports
  futsal: "⚽",
  bola: "⚽",
  badminton: "🏸",
  gym: "💪",
  basket: "🏀",
  renang: "🏊",
  lari: "🏃",
};

export const suggestEmoji = (text: string): string | null => {
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (ACTIVITY_EMOJI_MAP[word]) {
      return ACTIVITY_EMOJI_MAP[word];
    }
  }
  return null;
};
