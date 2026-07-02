export const RARITY = {
  Common: { name: "Commun", color: "#9ca3af", val: 1 },
  Uncommon: { name: "Peu Commun", color: "#22c55e", val: 2 },
  Rare: { name: "Rare", color: "#3b82f6", val: 3 },
  Epic: { name: "Épique", color: "#a855f7", val: 4 },
  Legendary: { name: "Légendaire", color: "#eab308", val: 5 },
  Mythic: { name: "Mythique", color: "#ef4444", val: 6 },
  Divine: { name: "Divin", color: "#06b6d4", val: 7 },
  EX: { name: "EX Extrême", color: "#f472b6", val: 8 }
};

export const ELEMENTS = {
  STR: { name: "STR", color: "#ef4444", icon: "🔴" },
  AGI: { name: "AGI", color: "#3b82f6", icon: "🔵" },
  TEQ: { name: "TEQ", color: "#22c55e", icon: "🟢" },
  INT: { name: "INT", color: "#a855f7", icon: "🟣" },
  PHY: { name: "PHY", color: "#eab308", icon: "🟡" }
};

export const getElementAdvantage = (atkElem, defElem) => {
  if (!atkElem || !defElem) return 1.0;
  if (atkElem === 'STR' && defElem === 'PHY') return 1.2;
  if (atkElem === 'PHY' && defElem === 'INT') return 1.2;
  if (atkElem === 'INT' && defElem === 'TEQ') return 1.2;
  if (atkElem === 'TEQ' && defElem === 'AGI') return 1.2;
  if (atkElem === 'AGI' && defElem === 'STR') return 1.2;
  if (atkElem === 'PHY' && defElem === 'STR') return 0.8;
  if (atkElem === 'INT' && defElem === 'PHY') return 0.8;
  if (atkElem === 'TEQ' && defElem === 'INT') return 0.8;
  if (atkElem === 'AGI' && defElem === 'TEQ') return 0.8;
  if (atkElem === 'STR' && defElem === 'AGI') return 0.8;
  return 1.0;
};

export const REBIRTH_SHOP = {
  "rb_haki": { id: "rb_haki", name: "Haki Transcendant", desc: "+100% Dégâts Base", cost: 1, type: "dmg", val: 1.0 },
  "rb_xp": { id: "rb_xp", name: "Volonté Transmise", desc: "+50% Gain XP", cost: 1, type: "xp", val: 0.5 },
  "rb_luck": { id: "rb_luck", name: "Destin des D.", desc: "+1% Taux EX", cost: 5, type: "exRate", val: 0.01 },
  "rb_energy": { id: "rb_energy", name: "Énergie Infinie", desc: "+20% Régén Ki", cost: 2, type: "kiRegen", val: 0.2 },
};

export const Format = {
  num: (n) => {
    if (n < 1000) return Math.floor(n).toString();
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
    const i = Math.floor(Math.log10(n) / 3);
    if (i >= suffixes.length) return (n / Math.pow(10, 3 * (suffixes.length - 1))).toFixed(2) + suffixes[suffixes.length - 1];
    return (n / Math.pow(10, i * 3)).toFixed(2) + suffixes[i];
  }
};

export const getGrade = (val) => {
  if (val < 100) return { grade: "F", color: "#9ca3af" };
  if (val < 1000) return { grade: "D", color: "#22c55e" };
  if (val < 10000) return { grade: "C", color: "#3b82f6" };
  if (val < 100000) return { grade: "B", color: "#a855f7" };
  if (val < 1000000) return { grade: "A", color: "#f43f5e" };
  if (val < 10000000) return { grade: "S", color: "#eab308" };
  if (val < 100000000) return { grade: "SS", color: "#ef4444" };
  return { grade: "Z", color: "transparent", isRainbow: true };
};

export const getTitle = (bounty) => {
  if (bounty < 5000) return { title: "Mousse", color: "#9ca3af" };
  if (bounty < 50000) return { title: "Pirate", color: "#22c55e" };
  if (bounty < 200000) return { title: "Supernova", color: "#3b82f6" };
  if (bounty < 1000000) return { title: "Grand Corsaire", color: "#a855f7" };
  if (bounty < 10000000) return { title: "Empereur", color: "#ef4444" };
  return { title: "Roi des Pirates", color: "#eab308" };
};

export const SAVE_KEY = "GrandPieceSaveV23";

export const DEFAULT_PLAYER = {
  profile: { avatar: "🏴‍☠️", username: "Joueur", flag: "🇫🇷", bio: "Le Roi des Pirates!", titleEquipped: "Mousse", frame: "default", totalSummons: 0, totalKills: 0, totalRaids: 0, highestFloor: 0, titles: ["Mousse", "Pirate", "Supernova", "Grand Corsaire", "Empereur", "Roi des Pirates"] },
  beli: 0, gems: 0, power: 20, bounty: 0,
  level: { current: 1, xp: 0, max: 100 },
  stats: { strength: 0, haki: 0, sword: 0, gun: 0, luck: 0, agility: 0 },
  hakiTree: { observation: 0, armament: 0, kings: 0 }, hakiPoints: 0,
  shipId: "sh_barque", equippedRelic: null, unlockedRelics: [],
  rebirth: 0, rebirthCoins: 0, rebirthUpgrades: {},
  upgrades: { dmg: 0, beli: 0, xp: 0, speed: 0 },
  equipped: { fruitId: null, weaponId: null, headId: null, chestId: null, glovesId: null, bootsId: null, accId: null },
  inventory: [], crewList: [], crewSetup: { active: [null, null, null], support: [null, null, null] }, memberFragments: {},
  pets: { inventory: [], active: [null, null] },
  pity: { legendary: 0, mythic: 0, ex: 0 },
  sea: "East Blue", lastDaily: 0, lastLogin: Date.now(), weather: "Calme ☀️", logPoseTime: 0,
  pvpRank: 1000, hiddenMMR: 1000, towerFloor: 1, playerHp: { current: 1000, max: 1000 },
  settings: { sound: true, music: false, fastMode: false, hideDmg: false, shake: true, skipLowAnim: true, bgmTrack: 0, bgmVolume: 0.4, autoSellRarities: { Common: false, Uncommon: false, Rare: false, Epic: false } },
  redeemedCodes: [],
  antimatter: 0,
  distortions: { afkYield: 0, cdReduction: 0 }
};

export const TITLES_BUFFS = {
  "Mousse": { desc: "Aucun buff" },
  "Pirate": { desc: "+5% Dégâts" },
  "Supernova": { desc: "+10% Dégâts, +5% Vitesse" },
  "Grand Corsaire": { desc: "+15% Dégâts, +10% Beli" },
  "Empereur": { desc: "+25% Dégâts, +15% PV Max" },
  "Roi des Pirates": { desc: "+50% Dégâts, +20% All Stats" }
};
