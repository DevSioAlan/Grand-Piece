export const SEAS = {
  "East Blue": [
    { id:"m1", name: "Sbire Pirate", hp: 100, beli: 20, xp: 15, emoji: "🗡️", elem: "STR" },
    { id:"m2", name: "Marine Recrue", hp: 350, beli: 50, xp: 45, emoji: "🛡️", elem: "AGI" },
    { id:"m3", name: "Krieg", hp: 1500, beli: 200, xp: 150, emoji: "⚓", elem: "PHY" },
    { id:"m4", name: "Arlong", hp: 3500, beli: 500, xp: 350, gems: 10, bounty: 1000, emoji: "🦈", elem: "AGI", isBoss: true, drops: [{id: "w_shark", chance: 0.15}] }
  ],
  "Grand Line": [
    { id:"m5", name: "Agent Baroque", hp: 10000, beli: 800, xp: 500, emoji: "🦂", elem: "INT" },
    { id:"m6", name: "Vice-Amiral", hp: 50000, beli: 2500, xp: 1500, emoji: "🎖️", elem: "TEQ" },
    { id:"m7", name: "Pacifista PX", hp: 80000, beli: 4500, xp: 2500, emoji: "🤖", elem: "PHY", drops: [{id: "c_marine", chance: 0.10}] },
    { id:"m8", name: "Crocodile", hp: 150000, beli: 10000, xp: 6000, gems: 50, bounty: 15000, emoji: "🐊", elem: "TEQ", isBoss: true, drops: [{id: "w_shusui", chance: 0.05}] }
  ],
  "Nouveau Monde": [
    { id:"m9", name: "Gifters", hp: 500000, beli: 15000, xp: 8000, emoji: "🐃", elem: "STR" },
    { id:"m10", name: "Samouraï Wano", hp: 1000000, beli: 35000, xp: 20000, emoji: "👹", elem: "AGI", drops: [{id: "w_shusui", chance: 0.05}] },
    { id:"m11", name: "Tobiroppo", hp: 3000000, beli: 85000, xp: 45000, emoji: "🦕", elem: "PHY" },
    { id:"m12", name: "Kaido", hp: 20000000, beli: 500000, xp: 200000, gems: 500, bounty: 500000, emoji: "🐉", elem: "STR", isBoss: true, drops: [{id: "w_yoru", chance: 0.02}] }
  ]
};

export const CREW_MEMBERS = [
  { id: "c_coby", name: "Koby", rarity: "Common", img: "🧹", mult: 1.1, elem: "AGI", tags: ["Marine"] },
  { id: "c_arlong", name: "Arlong", rarity: "Uncommon", img: "🦈", mult: 1.2, elem: "AGI", tags: ["Fishman"] },
  { id: "c1", name: "Zoro", rarity: "Rare", img: "⚔️", mult: 1.5, elem: "TEQ", tags: ["StrawHat", "Supernova"] },
  { id: "c2", name: "Nami", rarity: "Epic", img: "🧭", mult: 2.0, elem: "INT", tags: ["StrawHat"] },
  { id: "c_robin", name: "Robin", rarity: "Epic", img: "🌸", mult: 2.5, elem: "PHY", tags: ["StrawHat"] },
  { id: "c4", name: "Sanji", rarity: "Legendary", img: "🍳", mult: 3.0, elem: "STR", tags: ["StrawHat"] },
  { id: "c3", name: "Jinbe", rarity: "Mythic", img: "🥋", mult: 5.0, elem: "AGI", tags: ["StrawHat", "Fishman", "Warlord"] },
  { id: "c_law", name: "Law", rarity: "Divine", img: "🩺", mult: 8.0, elem: "INT", tags: ["Supernova", "Warlord", "WillOfD"] },
  { id: "c_luffy", name: "Luffy", rarity: "Divine", img: "🍖", mult: 15.0, elem: "STR", tags: ["StrawHat", "Supernova", "WillOfD"] },
  { id: "c_kaido", name: "Kaido", rarity: "EX", img: "🐉", mult: 35.0, elem: "PHY", tags: ["Yonko"] },
  { id: "c_shanks", name: "Shanks", rarity: "EX", img: "🗡️", mult: 50.0, elem: "STR", tags: ["Yonko", "HakiMaster"] },
  { id: "c_roger", name: "Roger", rarity: "EX", img: "👑", mult: 100.0, elem: "INT", tags: ["PirateKing", "WillOfD", "HakiMaster"] }
];

export const SYNERGIES = [
  { name: "Monster Trio", req: ["c1", "c4", "c_luffy"], mult: 1.5, desc: "Dégâts x1.5" },
  { name: "Volonté du D.", tag: "WillOfD", count: 2, mult: 1.3, desc: "Dégâts x1.3" },
  { name: "Les Empereurs", tag: "Yonko", count: 2, mult: 2.0, desc: "Dégâts x2.0" },
  { name: "Chapeaux de Paille", tag: "StrawHat", count: 4, mult: 1.4, desc: "Dégâts x1.4" }
];

export const DBL_CARDS = [
  { id: "strike", name: "Frappe", cost: 20, bg: "linear-gradient(180deg, #ef4444, #7f1d1d)", icon: "👊", mult: 1.5 },
  { id: "blast", name: "Kikoha", cost: 30, bg: "linear-gradient(180deg, #eab308, #a16207)", icon: "💥", mult: 2.0 },
  { id: "special", name: "Spécial", cost: 50, bg: "linear-gradient(180deg, #3b82f6, #1e3a8a)", icon: "🌊", mult: 4.5 },
  { id: "green", name: "Éveil", cost: 15, bg: "linear-gradient(180deg, #22c55e, #14532d)", icon: "✨", mult: 0 }
];

export const BGM_TRACKS = [
  { id: "t1", name: "Kyouhei (Combat)", file: "/KYOUHEI.mp3" },
  { id: "t2", name: "Lease (Chill)", file: "/LEASE.mp3" },
  { id: "t3", name: "Stealthy Night (Menu)", file: "/Stealty Night Shadow.mp3" }
];
