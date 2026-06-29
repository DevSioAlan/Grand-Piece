export const ITEMS_DB = {
  "f_sube": { id: "f_sube", name: "Sube Sube", type: "Fruit", rarity: "Common", img: "🍋", baseMult: 1.2 },
  "f_bara": { id: "f_bara", name: "Bara Bara", type: "Fruit", rarity: "Uncommon", img: "🍊", baseMult: 1.5 },
  "f_gomu": { id: "f_gomu", name: "Gomu Gomu", type: "Fruit", rarity: "Rare", img: "🍇", baseMult: 2.5 },
  "f_mera": { id: "f_mera", name: "Mera Mera", type: "Fruit", rarity: "Epic", img: "🔥", baseMult: 5.0 },
  "f_yami": { id: "f_yami", name: "Yami Yami", type: "Fruit", rarity: "Legendary", img: "🌌", baseMult: 16.0 },
  "f_gura": { id: "f_gura", name: "Gura Gura", type: "Fruit", rarity: "Legendary", img: "🌍", baseMult: 18.0 },
  "f_magu": { id: "f_magu", name: "Magu Magu", type: "Fruit", rarity: "Mythic", img: "🌋", baseMult: 35.0 },
  "f_nika": { id: "f_nika", name: "Nika V5", type: "Fruit", rarity: "Divine", img: "☀️", baseMult: 60.0 },

  "w_pipe": { id: "w_pipe", name: "Tuyau", type: "Weapon", rarity: "Common", img: "🏏", baseMult: 1.1 },
  "w_shark": { id: "w_shark", name: "Lame Dentée", type: "Weapon", rarity: "Rare", img: "🗡️", baseMult: 2.0 },
  "w_shusui": { id: "w_shusui", name: "Shusui", type: "Weapon", rarity: "Legendary", img: "⚔️", baseMult: 12.0 },
  "w_yoru": { id: "w_yoru", name: "Kokuto Yoru", type: "Weapon", rarity: "Mythic", img: "✝️", baseMult: 25.0 },
  "w_ace": { id: "w_ace", name: "Meito Ace", type: "Weapon", rarity: "EX", img: "🗡️", baseMult: 100.0 },

  "g_flint": { id: "g_flint", name: "Silex", type: "Gun", rarity: "Common", img: "🔫", baseMult: 1.1 },
  "g_rifle": { id: "g_rifle", name: "Fusil", type: "Gun", rarity: "Rare", img: "🎯", baseMult: 2.2 },
  "g_bazooka": { id: "g_bazooka", name: "Bazooka", type: "Gun", rarity: "Epic", img: "🚀", baseMult: 4.5 },

  "h_bandana": { id: "h_bandana", name: "Bandana", type: "Head", rarity: "Common", img: "🪢", baseMult: 1.1 },
  "c_marine": { id: "c_marine", name: "Manteau", type: "Chest", rarity: "Rare", img: "🧥", baseMult: 1.5 },
  "gl_brawler": { id: "gl_brawler", name: "Gants Boxe", type: "Gloves", rarity: "Epic", img: "🥊", baseMult: 3.0 },
  "b_sanji": { id: "b_sanji", name: "Bottes", type: "Boots", rarity: "Legendary", img: "👢", baseMult: 8.0 },
  "a_saturn": { id: "a_saturn", name: "Aura Saturn", type: "Accessory", rarity: "Mythic", img: "🕷️", baseMult: 50.0 }
};

export const SHIPS = {
  "sh_barque": { name: "Chaloupe", img: "🛶", cost: 0, clickDelay: 350, extraBeli: 1 },
  "sh_merry": { name: "Vogue Merry", img: "🐑", cost: 100000, clickDelay: 250, extraBeli: 1.5 },
  "sh_sunny": { name: "Thousand Sunny", img: "🦁", cost: 2000000, clickDelay: 120, extraBeli: 3.0 },
  "sh_mobydick": { name: "Moby Dick", img: "🐋", cost: 5000000, clickDelay: 100, extraBeli: 4.0, desc: "+30% PV Max" },
  "sh_redforce": { name: "Red Force", img: "🐉", cost: 10000000, clickDelay: 80, extraBeli: 5.0, desc: "+15% Chance de Crit" },
  "sh_orojackson": { name: "Oro Jackson", img: "🔱", cost: 50000000, clickDelay: 50, extraBeli: 8.0, desc: "+50% Beli et Découvertes" },
  "sh_polartang": { name: "Polar Tang", img: "🟡", cost: 25000000, clickDelay: 70, extraBeli: 6.0, desc: "Soin sur Esquive Parfaite" }
};

export const RELICS = {
  "r_cursed": { id: "r_cursed", name: "Kitetsu Maudit", img: "👺", cost: 500000, mult: 4.0, desc: "Dégâts x4 (Pas d'esquive)" },
  "r_strawhat": { id: "r_strawhat", name: "Chapeau de Paille usé", img: "👒", cost: 1000000, mult: 0.5, desc: "Chance d'EX x2 mais Dégâts divisés par 2" },
  "r_poneglyph": { id: "r_poneglyph", name: "Road Poneglyph", img: "🪨", cost: 2500000, mult: 1.0, desc: "Débloque des étages secrets dans la Tour" },
  "r_impactdial": { id: "r_impactdial", name: "Dial d'Impact", img: "🐚", cost: 5000000, mult: 1.2, desc: "Stocke une partie des dégâts reçus pour booster l'ultime" }
};
