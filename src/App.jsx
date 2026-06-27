import React, { useState, useEffect, useRef, useMemo } from "react";

// --- RARETÉS & COULEURS ---
const RARITY = {
  Common: { name: "Commun", color: "#9ca3af", val: 1 },
  Uncommon: { name: "Peu Commun", color: "#22c55e", val: 2 },
  Rare: { name: "Rare", color: "#3b82f6", val: 3 },
  Epic: { name: "Épique", color: "#a855f7", val: 4 },
  Legendary: { name: "Légendaire", color: "#eab308", val: 5 },
  Mythic: { name: "Mythique", color: "#ef4444", val: 6 },
  Divine: { name: "Divin", color: "#06b6d4", val: 7 },
  EX: { name: "EX Extrême", color: "#f472b6", val: 8 }
};

const ELEMENTS = {
  STR: { name: "STR", color: "#ef4444", icon: "🔴" },
  AGI: { name: "AGI", color: "#3b82f6", icon: "🔵" },
  TEQ: { name: "TEQ", color: "#22c55e", icon: "🟢" },
  INT: { name: "INT", color: "#a855f7", icon: "🟣" },
  PHY: { name: "PHY", color: "#eab308", icon: "🟡" }
};

const getElementAdvantage = (atkElem, defElem) => {
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

// --- DATA DU JEU (ÉQUIPEMENTS) ---
const ITEMS_DB = {
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

// --- DATA DU JEU (FAMILIERS / PETS V22) ---
const PETS_DB = {
  "p_chouchou": { id: "p_chouchou", name: "Chouchou", rarity: "Common", img: "🐕", bonusType: "beli", bonusVal: 0.2, desc: "+20% Beli" },
  "p_lapin": { id: "p_lapin", name: "Lapin des Neiges", rarity: "Uncommon", img: "🐇", bonusType: "xp", bonusVal: 0.3, desc: "+30% XP" },
  "p_dugong": { id: "p_dugong", name: "Kung-Fu Dugong", rarity: "Rare", img: "🐢", bonusType: "dmg", bonusVal: 0.5, desc: "+50% Dégâts" },
  "p_karoo": { id: "p_karoo", name: "Karoo", rarity: "Epic", img: "🦆", bonusType: "speed", bonusVal: 10, desc: "-10ms Délai" },
  "p_surume": { id: "p_surume", name: "Kraken Surume", rarity: "Mythic", img: "🦑", bonusType: "dmg", bonusVal: 3.0, desc: "+300% Dégâts" },
  "p_zunisha": { id: "p_zunisha", name: "Zunisha", rarity: "Divine", img: "🐘", bonusType: "all", bonusVal: 2.0, desc: "Stats x2.0" },
};

const SHIPS = {
  "sh_barque": { name: "Chaloupe", img: "🛶", cost: 0, clickDelay: 350, extraBeli: 1 },
  "sh_merry": { name: "Vogue Merry", img: "🐑", cost: 100000, clickDelay: 250, extraBeli: 1.5 },
  "sh_sunny": { name: "Thousand Sunny", img: "🦁", cost: 2000000, clickDelay: 120, extraBeli: 3.0 }
};

const RELICS = {
  "r_cursed": { id: "r_cursed", name: "Kitetsu Maudit", img: "👺", cost: 500000, mult: 4.0, desc: "Dégâts x4 mais annule l'esquive Haki." }
};

const SEAS = {
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
  ],
  "Dressrosa": [
    { id:"m13", name: "Jouet Soldat", hp: 50000000, beli: 1000000, xp: 500000, emoji: "🧸", elem: "TEQ" },
    { id:"m14", name: "Gladiateur", hp: 100000000, beli: 2000000, xp: 1000000, emoji: "🛡️", elem: "STR" },
    { id:"m15", name: "Doflamingo", hp: 500000000, beli: 10000000, xp: 5000000, gems: 1000, bounty: 1000000, emoji: "🦩", elem: "INT", isBoss: true }
  ],
  "Laugh Tale": [
    { id:"m16", name: "Gardien Oublié", hp: 1000000000, beli: 50000000, xp: 20000000, emoji: "🗿", elem: "PHY" },
    { id:"m17", name: "Joy Boy (Fantôme)", hp: 5000000000, beli: 200000000, xp: 100000000, gems: 5000, bounty: 5000000, emoji: "👑", elem: "Divine", isBoss: true, drops: [{id: "w_ace", chance: 0.01}] }
  ]
};

const CREW_MEMBERS = [
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

const SYNERGIES = [
  { name: "Monster Trio", req: ["c1", "c4", "c_luffy"], mult: 1.5, desc: "Dégâts x1.5" },
  { name: "Volonté du D.", tag: "WillOfD", count: 2, mult: 1.3, desc: "Dégâts x1.3" },
  { name: "Les Empereurs", tag: "Yonko", count: 2, mult: 2.0, desc: "Dégâts x2.0" },
  { name: "Chapeaux de Paille", tag: "StrawHat", count: 4, mult: 1.4, desc: "Dégâts x1.4" },
  { name: "Maîtres du Haki", tag: "HakiMaster", count: 2, mult: 1.6, desc: "Dégâts x1.6" },
  { name: "Équipage des 7", tag: "Warlord", count: 2, mult: 1.8, desc: "Dégâts x1.8" }
];

const BGM_TRACKS = [
  { id: "t1", name: "Kyouhei (Combat)", file: "/KYOUHEI.mp3" },
  { id: "t2", name: "Lease (Chill)", file: "/LEASE.mp3" },
  { id: "t3", name: "Stealthy Night (Menu)", file: "/Stealty Night Shadow.mp3" },
  { id: "t4", name: "Village Harbour", file: "/Village Harbour.mp3" }
];

// --- UTILITAIRES EXPONENTIELS ---
const formatNum = (n) => {
  if (n < 1000) return Math.floor(n).toString();
  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
  const i = Math.floor(Math.log10(n) / 3);
  if (i >= suffixes.length) return (n / Math.pow(10, 3 * (suffixes.length - 1))).toFixed(2) + suffixes[suffixes.length - 1];
  return (n / Math.pow(10, i * 3)).toFixed(2) + suffixes[i];
};
const Format = { num: formatNum };

const getGrade = (val) => {
  if (val < 100) return { grade: "F", color: "#9ca3af" };
  if (val < 1000) return { grade: "D", color: "#22c55e" };
  if (val < 10000) return { grade: "C", color: "#3b82f6" };
  if (val < 100000) return { grade: "B", color: "#a855f7" };
  if (val < 1000000) return { grade: "A", color: "#f43f5e" };
  if (val < 10000000) return { grade: "S", color: "#eab308" };
  if (val < 100000000) return { grade: "SS", color: "#ef4444" };
  if (val < 1000000000) return { grade: "SSS", color: "#f97316" };
  return { grade: "Z", color: "transparent", isRainbow: true };
};

// --- INITIAL STATE ---
const SAVE_KEY = "GrandPieceSaveV22"; 
const DEFAULT_PLAYER = {
  profile: { avatar: "🏴‍☠️", username: "Joueur", flag: "🇫🇷", bio: "Le Roi des Pirates!", titleEquipped: "Mousse", frame: "default", totalSummons: 0, totalKills: 0, totalRaids: 0, highestFloor: 0, achievements: [], titles: ["Mousse", "Pirate", "Supernova", "Grand Corsaire", "Empereur", "Roi des Pirates"] },
  beli: 0, gems: 0, power: 20, bounty: 0,
  level: { current: 1, xp: 0, max: 100 },
  stats: { strength: 0, haki: 0, sword: 0, gun: 0, luck: 0, agility: 0 },
  hakiTree: { observation: 0, armament: 0, kings: 0 }, hakiPoints: 0,
  shipId: "sh_barque", equippedRelic: null, unlockedRelics: [],
  rebirth: 0, 
  // INC INCREMENTAL UPGRADES
  upgrades: { dmg: 0, beli: 0, xp: 0, speed: 0 },
  equipped: { fruitId: null, weaponId: null, headId: null, chestId: null, glovesId: null, bootsId: null, accId: null },
  inventory: [], crewList: [], crewSetup: { active: [null, null, null], support: [null, null, null] }, memberFragments: {},
  // BATTLE PETS SYSTEM
  pets: { inventory: [], active: [null, null] },
  pity: { legendary: 0, mythic: 0, ex: 0 },
  sea: "East Blue", lastDaily: 0, lastLogin: Date.now(), weather: "Calme ☀️", logPoseTime: 0,
  pvpRank: 1000, towerFloor: 1, playerHp: { current: 1000, max: 1000 },
  settings: { 
    sound: true, music: false, fastMode: false, hideDmg: false, shake: true, skipLowAnim: true, 
    bgmTrack: 0, bgmVolume: 0.4, 
    autoSellRarities: { Common: false, Uncommon: false, Rare: false, Epic: false }
  },
  redeemedCodes: []
};

// --- MAIN COMPONENT ---
export default function GrandPieceMobile() {
  const [isLoading, setIsLoading] = useState(true); 
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Navigation
  const [mainTab, setMainTab] = useState("combat"); // combat, train, summon, roster, inventory, hub
  const [hubTab, setHubTab] = useState("menu");
  const [rosterTab, setRosterTab] = useState("crew"); // crew, pets
  const [trainTab, setTrainTab] = useState("stats"); // stats, upgrades
  const [gameMode, setGameMode] = useState("idle"); 
  
  const [player, setPlayer] = useState(DEFAULT_PLAYER);
  const [battle, setBattle] = useState(null);
  
  // Combat Action States
  const [combatState, setCombatState] = useState({ energy: 0, ultimate: 0, stunTime: 0, isInvincible: false });
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [autoClick, setAutoClick] = useState(false);
  const [shake, setShake] = useState(false);
  const [hitstop, setHitstop] = useState(false);
  const [showUltAnim, setShowUltAnim] = useState({ active: false, char: null });
  const [cinematicSummon, setCinematicSummon] = useState({ active: false, item: null });
  
  const [raidActive, setRaidActive] = useState(false);
  const [raidWave, setRaidWave] = useState(1);
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  const [summonResult, setSummonResult] = useState(null);
  const [banner, setBanner] = useState("Fruit");

  // Modals & Sub-states
  const [showProfile, setShowProfile] = useState(false);
  const [profileTab, setProfileTab] = useState("stats"); 
  const [crewSelectSlot, setCrewSelectSlot] = useState(null);
  const [petSelectSlot, setPetSelectSlot] = useState(null);
  const [promoCode, setPromoCode] = useState("");

  const [marketPrices, setMarketPrices] = useState({ "f_sube": 200, "f_gomu": 1500, "f_mera": 8000, "f_nika": 50000 });
  const [autoSummonConfig, setAutoSummonConfig] = useState({ active: false, targetRarity: "Legendary" });
  const [legalMacro, setLegalMacro] = useState({ active: false, currentAction: "En Attente", counter: 0 });

  const bgmRef = useRef(null);

  // --- INIT & TOASTS ---
  const addToast = (msg, color="#3b82f6") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, {id, msg, color}]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    const fadeTimer = setTimeout(() => { setIsFadingOut(true); }, 1500); 
    const removeTimer = setTimeout(() => { setIsLoading(false); }, 2000);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  // --- AUDIO LOGIC ---
  useEffect(() => {
    bgmRef.current = new Audio(); 
    bgmRef.current.loop = true; 
    return () => { if(bgmRef.current) bgmRef.current.pause(); }
  }, []);

  useEffect(() => {
    if (bgmRef.current && !isLoading) {
      bgmRef.current.volume = player.settings.bgmVolume || 0.4;
      if (player.settings.music) {
        const trackUrl = BGM_TRACKS[player.settings.bgmTrack || 0].file;
        if (!bgmRef.current.src.includes(trackUrl)) {
          bgmRef.current.src = trackUrl;
          bgmRef.current.play().catch(()=>{});
        } else if (bgmRef.current.paused) {
          bgmRef.current.play().catch(()=>{});
        }
      } else {
        bgmRef.current.pause();
      }
    }
  }, [player.settings.music, player.settings.bgmTrack, player.settings.bgmVolume, isLoading]);

  const playClick = () => { if (player.settings.sound) { const snd = new Audio('/click.mp3'); snd.volume = 1.0; snd.play().catch(()=>{}); } };

  // --- SAUVEGARDE & DEEP MERGE MIGRATION ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        let parsed = JSON.parse(saved);
        setPlayer(p => {
          const m = { ...DEFAULT_PLAYER, ...parsed };
          m.profile = { ...DEFAULT_PLAYER.profile, ...(parsed.profile||{}) };
          m.stats = { ...DEFAULT_PLAYER.stats, ...(parsed.stats||{}) };
          m.equipped = { ...DEFAULT_PLAYER.equipped, ...(parsed.equipped||{}) };
          m.crewSetup = { ...DEFAULT_PLAYER.crewSetup, ...(parsed.crewSetup||{}) };
          m.upgrades = { ...DEFAULT_PLAYER.upgrades, ...(parsed.upgrades||{}) };
          m.pets = { inventory: parsed.pets?.inventory||[], active: parsed.pets?.active||[null,null] };
          m.settings = { ...DEFAULT_PLAYER.settings, ...(parsed.settings||{}) };
          m.settings.autoSellRarities = { ...DEFAULT_PLAYER.settings.autoSellRarities, ...(parsed.settings?.autoSellRarities||{}) };
          
          if(parsed.crew && !parsed.crewList) m.crewList = parsed.crew; 
          if(!Array.isArray(m.inventory)) m.inventory = [];
          if(!Array.isArray(m.crewList)) m.crewList = [];
          
          // AFK REWARDS
          const now = Date.now();
          const diffSecs = Math.floor((now - (m.lastLogin || now)) / 1000);
          if (diffSecs > 3600) { 
            const hours = Math.min(24, diffSecs / 3600);
            const pwr = (20 + m.level.current * 5) * (1 + m.stats.strength*0.1);
            const gainBeli = Math.floor(hours * 100 * pwr);
            const gainXp = Math.floor(hours * 50);
            m.beli += gainBeli;
            setTimeout(() => addToast(`🌙 Gains AFK: ${Format.num(gainBeli)} ฿, ${gainXp} XP`, "#eab308"), 3000);
          }
          m.lastLogin = now;
          return m;
        });
      }
    } catch(e) { localStorage.removeItem(SAVE_KEY); }
  }, []);

  useEffect(() => {
    if(!isLoading) {
      setPlayer(p => ({...p, lastLogin: Date.now()}));
      localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    }
  }, [player, isLoading]);

  // --- ENVIRONMENT LOOPS ---
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setMarketPrices({ "f_sube": 150+Math.random()*200, "f_gomu": 1000+Math.random()*2500, "f_mera": 5000+Math.random()*9000, "f_nika": 30000+Math.random()*80000 });
      const weathers = ["Calme ☀️", "Tempête ⚡", "Canicule 🔥", "Blizzard ❄️"];
      setPlayer(p => ({ ...p, weather: weathers[Math.floor(Math.random() * weathers.length)] }));
    }, 60000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    let macroTimer;
    if (legalMacro.active && !isLoading) {
      macroTimer = setInterval(() => {
        if (!battle && !raidActive) {
          if (legalMacro.counter < 5) {
            setLegalMacro(m => ({ ...m, currentAction: "Farm Sbires", counter: m.counter + 1 }));
            const e = SEAS[player.sea][0]; setBattle({ ...e, hp: e.hp, maxHp: e.hp });
          } else {
            setLegalMacro(m => ({ ...m, currentAction: "Raid", counter: 0 })); startRaid();
          }
        }
      }, 1000);
    }
    return () => clearInterval(macroTimer);
  }, [legalMacro.active, battle, raidActive, isLoading, player.sea]);

  useEffect(() => {
    let summonTimer;
    if (autoSummonConfig.active && player.gems >= 50 && !summonResult && !cinematicSummon.active) {
      summonTimer = setInterval(() => { performSummon(banner, 1, true); }, 500);
    } else if (player.gems < 50 && autoSummonConfig.active) setAutoSummonConfig(c => ({ ...c, active: false }));
    return () => clearInterval(summonTimer);
  }, [autoSummonConfig.active, player.gems, summonResult, cinematicSummon.active, banner]);

  // --- SYNERGIES & STATS ENGINE ---
  const { synMult, activeSyns } = useMemo(() => {
    let activeSyns = []; let synMult = 1.0;
    const allCrewIds = [...player.crewSetup.active, ...player.crewSetup.support].filter(Boolean);
    const allCrewData = allCrewIds.map(id => CREW_MEMBERS.find(m => m.id === id)).filter(Boolean);
    const allTags = allCrewData.flatMap(c => c.tags || []);

    SYNERGIES.forEach(syn => {
      let isMet = false;
      if (syn.req) isMet = syn.req.every(reqId => allCrewIds.includes(reqId));
      else if (syn.tag && syn.count) { if (allTags.filter(t => t === syn.tag).length >= syn.count) isMet = true; }
      if (isMet) { synMult *= syn.mult; activeSyns.push({ name: syn.name, mult: syn.mult }); }
    });
    return { synMult, activeSyns };
  }, [player.crewSetup]);

  const getEquipped = (type) => {
    let equipId = player.equipped[`${type.toLowerCase()}Id`];
    if (type === "Accessory") equipId = player.equipped.accId;
    if (!equipId) return null;
    const invItem = player.inventory.find(i => i.instanceId === equipId);
    if (!invItem) return null;
    const baseData = ITEMS_DB[invItem.itemId] || ITEMS_DB["f_sube"];
    let v2Multiplier = (invItem.awakenLvl >= 10) ? 2.0 : 1.0;
    return { ...baseData, ...invItem, totalMult: baseData.baseMult * (1 + ((invItem.awakenLvl||0) * 0.1)) * v2Multiplier };
  };

  const getDmgMult = () => {
    let bountyBonus = 1 + (player.bounty / 100000);
    let hakiArmament = 1 + (player.hakiTree.armament * 0.15);
    let relicBonus = player.equippedRelic ? RELICS[player.equippedRelic].mult : 1;
    let incDmg = 1 + (player.upgrades.dmg * 0.1); // Incremental Shop
    
    // Pets Bonus
    let petDmg = 1.0;
    player.pets.active.forEach(pInst => {
      if(!pInst) return;
      const petItem = player.pets.inventory.find(i=>i.instanceId===pInst);
      if(petItem) {
        const pDb = PETS_DB[petItem.itemId];
        if(pDb && (pDb.bonusType === 'dmg' || pDb.bonusType === 'all')) petDmg *= (1 + pDb.bonusVal);
      }
    });

    let mult = (1 + (player.stats.strength * 0.1) + (player.stats.haki * 0.5) + (player.rebirth * 5)) * bountyBonus * hakiArmament * relicBonus * incDmg * petDmg;
    
    ["Fruit", "Weapon", "Head", "Chest", "Gloves", "Boots", "Accessory"].forEach(type => {
      const eq = getEquipped(type);
      if (eq) {
        if (type === "Weapon") mult *= (eq.totalMult + (player.stats.sword * 0.2));
        else mult *= eq.totalMult;
      }
    });
    
    player.crewSetup.active.forEach(cId => { const member = CREW_MEMBERS.find(m => m.id === cId); if (member) mult *= member.mult; });
    player.crewSetup.support.forEach(cId => { const member = CREW_MEMBERS.find(m => m.id === cId); if (member) mult *= (member.mult * 0.5); });
    
    mult *= synMult;

    if (battle && battle.elem) {
      const captainId = player.crewSetup.active[0];
      const capElem = captainId ? CREW_MEMBERS.find(m=>m.id===captainId)?.elem : "STR";
      mult *= getElementAdvantage(capElem, battle.elem);
    }
    return mult;
  };

  const getDmg = () => Math.floor(player.power * getDmgMult());

  // CALCUL VITESSE D'ATTAQUE
  const getAtkDelay = () => {
    const currentShip = SHIPS[player.shipId] || SHIPS["sh_barque"];
    let delay = player.settings.fastMode ? 80 : currentShip.clickDelay;
    delay -= (player.upgrades.speed * 5); // -5ms par niveau Incremental
    // Pets Bonus Speed
    player.pets.active.forEach(pInst => {
      if(pInst) {
        const petItem = player.pets.inventory.find(i=>i.instanceId===pInst);
        const pDb = petItem ? PETS_DB[petItem.itemId] : null;
        if(pDb && pDb.bonusType === 'speed') delay -= pDb.bonusVal;
      }
    });
    return Math.max(50, delay); // Cap min 50ms
  };
  
  const dps = Math.floor(getDmg() / (getAtkDelay() / 1000));

  // --- ACTIONS GLOBALES (RÉÉCRITES & CORRIGÉES) ---
  const trainStat = (statName) => {
    playClick(); const cost = 100 * Math.pow(1.5, player.stats[statName] || 0);
    if (player.beli < cost) return addToast(`Fonds insuffisants (${Format.num(cost)} ฿)`, "#ef4444");
    setPlayer(p => ({ ...p, beli: p.beli - cost, stats: { ...p.stats, [statName]: (p.stats[statName] || 0) + 1 } }));
  };

  const buyIncrementalUpgrade = (type) => {
    playClick(); const cost = 10000 * Math.pow(2.5, player.upgrades[type] || 0);
    if (player.beli < cost) return addToast(`Fonds insuffisants`, "#ef4444");
    setPlayer(p => ({ ...p, beli: p.beli - cost, upgrades: { ...p.upgrades, [type]: (p.upgrades[type] || 0) + 1 } }));
  };

  const buyHakiTalent = (node) => {
    playClick();
    if (player.hakiPoints > 0 && player.hakiTree[node] < 5) {
      setPlayer(p => ({ ...p, hakiPoints: p.hakiPoints - 1, hakiTree: { ...p.hakiTree, [node]: p.hakiTree[node] + 1 } }));
      addToast(`Haki ${node} amélioré !`, "#a855f7");
    } else {
      addToast("Points Haki insuffisants ou max atteint.", "#ef4444");
    }
  };

  const handleRebirth = () => {
    playClick();
    const reqLvl = 50 + (player.rebirth * 50);
    if (player.level.current < reqLvl) return addToast(`Niveau ${reqLvl} requis !`, "#ef4444");
    if (window.confirm("Renaître ? (Conserve Équipement, Gemmes et Équipage)")) {
      setPlayer(p => ({
        ...p, rebirth: p.rebirth + 1, level: { current: 1, xp: 0, max: 100 },
        stats: { strength: 0, haki: 0, sword: 0, gun: 0, luck: 0, agility: 0 }, beli: 0, power: 20
      }));
      setBattle(null); setAutoClick(false);
      setLevelUpFlash(true); setTimeout(() => setLevelUpFlash(false), 1000);
      addToast("🌟 REBIRTH EFFECTUÉ ! Puissance globale augmentée.", "#eab308");
    }
  };

  const sellCommons = () => {
    playClick(); let kept = []; let sold = 0;
    player.inventory.forEach(i => {
      const db = ITEMS_DB[i.itemId];
      const isEq = Object.values(player.equipped).includes(i.instanceId);
      if(db && db.rarity === "Common" && !isEq && i.awakenLvl === 0) sold += 500;
      else kept.push(i);
    });
    if (sold > 0) {
      setPlayer(p => ({...p, inventory: kept, beli: p.beli + sold}));
      addToast(`Objets communs vendus pour ${Format.num(sold)} ฿`, "#22c55e");
    } else {
      addToast("Aucun objet commun vendable trouvé.", "#9ca3af");
    }
  };

  const awakenItem = (instanceId) => {
    playClick();
    const item = player.inventory.find(i => i.instanceId === instanceId);
    if (!item) return;
    const isV2 = item.awakenLvl >= 10;
    const reqSaturn = isV2 && item.itemId === "f_nika";
    const cost = 5000 * Math.pow(2, item.awakenLvl || 0);
    if (player.beli < cost) return addToast(`Fonds insuffisants (${Format.num(cost)} ฿ requis).`, "#ef4444");
    if (reqSaturn && !player.inventory.find(i => i.itemId === "a_saturn")) return addToast("Aura de Saturn requise pour la V2 de Nika !", "#ef4444");

    setPlayer(p => ({
      ...p, beli: p.beli - cost,
      inventory: p.inventory.map(i => i.instanceId === instanceId ? { ...i, awakenLvl: (i.awakenLvl || 0) + 1 } : i)
    }));
    addToast("✨ Équipement éveillé !", "#a855f7");
  };

  const claimDaily = () => {
    playClick();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - player.lastDaily > oneDay) {
      setPlayer(p => ({ ...p, gems: p.gems + 100, beli: p.beli + 15000, lastDaily: now }));
      addToast("🎁 Récompense Quotidienne récupérée !", "#eab308");
    } else {
      const hoursLeft = Math.ceil((oneDay - (now - player.lastDaily)) / (1000 * 60 * 60));
      addToast(`Revenez dans ${hoursLeft} heures !`, "#9ca3af");
    }
  };

  const tradeMarketFruit = (itemId, mode) => {
    playClick();
    const price = marketPrices[itemId] || 500;
    if (mode === "BUY") {
      if (player.beli >= price) {
        setPlayer(p => ({ ...p, beli: p.beli - price, inventory: [...p.inventory, { instanceId: Date.now() + Math.random().toString(), itemId: itemId, awakenLvl: 0 }] }));
        addToast("Achat effectué !", "#22c55e");
      } else addToast("Fonds insuffisants.", "#ef4444");
    } else {
      const idx = player.inventory.findIndex(i => i.itemId === itemId);
      if (idx !== -1) {
        setPlayer(p => {
          let inv = [...p.inventory]; inv.splice(idx, 1);
          return { ...p, beli: p.beli + price, inventory: inv };
        });
        addToast(`Vendu pour ${Format.num(price)} ฿`, "#22c55e");
      } else addToast("Vous ne possédez pas cet objet.", "#9ca3af");
    }
  };

  const buyShip = (id, cost) => {
    playClick();
    if (player.beli >= cost) {
      setPlayer(p => ({ ...p, beli: p.beli - cost, shipId: id }));
      addToast("Nouveau navire amarré avec succès !", "#38bdf8");
    } else addToast("Fonds insuffisants.", "#ef4444");
  };

  const changeSea = (newSea) => {
    playClick();
    if (Date.now() < player.logPoseTime) {
      const remainingSecs = Math.ceil((player.logPoseTime - Date.now()) / 1000);
      return addToast(`🧭 Log Pose en charge... (${remainingSecs}s)`, "#3b82f6");
    }
    const seasKeys = Object.keys(SEAS);
    const newIdx = seasKeys.indexOf(newSea);
    if (player.level.current < newIdx * 30) return addToast(`❌ Niveau ${newIdx * 30} requis.`, "#ef4444");
    
    setPlayer(p => ({ ...p, sea: newSea, logPoseTime: Date.now() + 60000 }));
    setBattle(null);
  };

  const redeemCode = () => {
    playClick();
    if (promoCode === "NEWERA_V21" && !player.redeemedCodes?.includes("NEWERA_V21")) {
      setPlayer(p => ({...p, gems: p.gems + 1000, redeemedCodes: [...(p.redeemedCodes||[]), "NEWERA_V21"]}));
      addToast("🎉 Code valide ! +1000 💎", "#22c55e");
    } else {
      addToast("❌ Code invalide ou déjà utilisé.", "#ef4444");
    }
    setPromoCode("");
  };

  const autoEquip = () => {
    playClick(); let newEq = { ...player.equipped };
    ["Fruit", "Weapon", "Head", "Chest", "Gloves", "Boots", "Accessory"].forEach(type => {
      const items = player.inventory.filter(i => ITEMS_DB[i.itemId]?.type === type);
      if (items.length > 0) {
        items.sort((a,b) => {
           const pA = ITEMS_DB[a.itemId].baseMult * (1 + a.awakenLvl * 0.1) * (a.awakenLvl>=10?2:1);
           const pB = ITEMS_DB[b.itemId].baseMult * (1 + b.awakenLvl * 0.1) * (b.awakenLvl>=10?2:1);
           return pB - pA;
        });
        newEq[type === "Fruit" ? "fruitId" : type === "Weapon" ? "weaponId" : type === "Accessory" ? "accId" : `${type.toLowerCase()}Id`] = items[0].instanceId;
      }
    });
    setPlayer(p => ({ ...p, equipped: newEq }));
    addToast("⚡ Auto-Build: Équipement Optimal Appliqué", "#eab308");
  };

  // --- COMBAT ENGINE ACTION ---
  useEffect(() => {
    if(!battle || isLoading) return;
    const loop = setInterval(() => {
      setCombatState(prev => ({...prev, energy: Math.min(100, prev.energy + 5), stunTime: Math.max(0, prev.stunTime - 1) }));
      
      // Support Assists
      if(player.crewSetup.support.filter(Boolean).length > 0 && Math.random() > 0.6) {
        const assistDmg = Math.floor(getDmg() * 0.3);
        setBattle(b => b ? { ...b, hp: Math.max(0, b.hp - assistDmg) } : null);
        spawnText("Assist!", assistDmg, false, "#3b82f6");
      }

      // Boss Attack
      if(battle.isBoss && combatState.stunTime === 0 && Math.random() > 0.6) {
        if(!combatState.isInvincible) {
          const bossDmg = Math.floor(player.playerHp.max * 0.05); 
          setPlayer(p => ({...p, playerHp: {...p.playerHp, current: Math.max(0, p.playerHp.current - bossDmg)}}));
          if(player.settings.shake) { setShake(true); setTimeout(() => setShake(false), 150); }
        }
      }
      
      // Haki Kings
      if (player.hakiTree.kings > 0 && !battle.isBoss) {
        setBattle(b => b ? { ...b, hp: Math.max(0, b.hp - (player.hakiTree.kings * getDmg() * 0.05)) } : null);
      }
    }, 1000);
    return () => clearInterval(loop);
  }, [battle, isLoading, combatState.isInvincible, combatState.stunTime, player.crewSetup.support, player.hakiTree.kings]);

  useEffect(() => {
    if(player.playerHp.current <= 0 && battle) {
      addToast("💀 Vous avez été vaincu !", "#ef4444");
      setBattle(null); setAutoClick(false); setRaidActive(false);
      setPlayer(p => ({...p, playerHp: {...p.playerHp, current: p.playerHp.max}, bounty: Math.max(0, Math.floor(p.bounty * 0.95))}));
    }
  }, [player.playerHp.current, battle]);

  const spawnText = (prefix, dmg, isCrit, color="#fff") => {
    if(player.settings.hideDmg) return;
    const id = Date.now() + Math.random();
    const x = window.innerWidth / 2 + (Math.random() * 80 - 40);
    const y = 200 + (Math.random() * 80 - 40);
    setFloatingTexts(prev => [...prev, { id, x, y, text: `${prefix}${Format.num(dmg)}${isCrit?'!':''}`, color, isCrit }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 600);
  };

  const executeAttack = (type) => {
    if (!battle) return;
    playClick();

    if (player.weather.includes("Tempête") && Math.random() < 0.10) return spawnText("Miss", 0, false, "#9ca3af");
    if (battle.isBoss && !player.equippedRelic && Math.random() < (player.hakiTree.observation * 0.05)) {
      return spawnText("HAKI ESQUIVE", 0, false, "#3b82f6");
    }

    let dmg = getDmg();
    let energyCost = 0; let ultGain = 0; let stun = 0; let prefix = ""; let color = "#fff";

    if(type === "skill1") {
      if(combatState.energy < 25) return;
      energyCost = 25; dmg *= 3; ultGain = 15; prefix = "💥 "; color = "#f97316";
      if(player.settings.shake) { setShake(true); setTimeout(() => setShake(false), 200); }
    } else if (type === "skill2") {
      if(combatState.energy < 50) return;
      energyCost = 50; dmg *= 6; ultGain = 25; stun = 2; prefix = "🌌 "; color = "#a855f7";
      if(player.settings.shake) { setShake(true); setTimeout(() => setShake(false), 300); }
    } else if (type === "ultimate") {
      if(combatState.ultimate < 100) return;
      energyCost = 0; dmg *= 15; ultGain = -100; stun = 3; prefix = "👑 ULTIME "; color = "#ef4444";
      const capId = player.crewSetup.active[0];
      const capImg = capId ? CREW_MEMBERS.find(m=>m.id===capId)?.img : "🏴‍☠️";
      setShowUltAnim({ active: true, char: capImg }); setTimeout(() => setShowUltAnim({active:false, char:null}), 1500);
      if(player.settings.shake) { setShake(true); setTimeout(() => setShake(false), 500); }
    } else if (type === "dash") {
      if(combatState.energy < 20) return;
      setCombatState(prev => ({...prev, energy: prev.energy - 20, isInvincible: true}));
      setTimeout(() => setCombatState(prev => ({...prev, isInvincible: false})), 800);
      return spawnText("DASH", 0, false, "#22c55e");
    } else {
      ultGain = 5; setCombatState(prev => ({...prev, energy: Math.min(100, prev.energy + 10)}));
      setHitstop(true); setTimeout(() => setHitstop(false), 80);
    }

    const critRate = Math.min(0.80, 0.15 + (player.stats.luck * 0.01));
    const critMult = 3.0 + (player.stats.agility * 0.2);
    const isCrit = Math.random() < critRate;
    const finalDmg = isCrit ? Math.floor(dmg * critMult) : dmg;

    setCombatState(prev => ({ ...prev, energy: Math.max(0, prev.energy - energyCost), ultimate: Math.min(100, Math.max(0, prev.ultimate + ultGain)), stunTime: stun > 0 ? stun : prev.stunTime }));
    spawnText(prefix, finalDmg, isCrit, color);
    
    const newHp = Math.max(0, battle.hp - finalDmg);
    if (newHp <= 0) handleVictory();
    else setBattle(prev => ({ ...prev, hp: newHp }));
  };

  useEffect(() => {
    let timer;
    if (autoClick && battle && !isLoading && !cinematicSummon.active) timer = setInterval(() => executeAttack("normal"), getAtkDelay());
    return () => clearInterval(timer);
  }, [autoClick, battle, player.shipId, player.settings.fastMode, isLoading, gameMode, cinematicSummon.active]);

  const handleVictory = () => {
    const shipBonus = SHIPS[player.shipId]?.extraBeli || 1;
    // Inc Bonus & Pets Bonus
    let beliInc = 1 + (player.upgrades.beli * 0.1);
    let xpInc = 1 + (player.upgrades.xp * 0.1);
    player.pets.active.forEach(pInst => {
      if(pInst) {
        const pDb = PETS_DB[player.pets.inventory.find(i=>i.instanceId===pInst)?.itemId];
        if(pDb) {
          if(pDb.bonusType === 'beli' || pDb.bonusType === 'all') beliInc += pDb.bonusVal;
          if(pDb.bonusType === 'xp' || pDb.bonusType === 'all') xpInc += pDb.bonusVal;
        }
      }
    });

    setPlayer(p => {
      let newXp = p.level.xp + (battle.xp * xpInc); let newLvl = p.level.current; let newMax = p.level.max; let pointsHaki = p.hakiPoints;
      
      let safety = 0;
      while (newXp >= newMax && safety < 1000) { 
        newLvl++; newXp -= newMax; newMax = Math.floor(newMax * 1.6); pointsHaki++; safety++;
      }
      if(safety >= 1000) newXp = 0; 
      if(safety > 0) { setLevelUpFlash(true); setTimeout(() => setLevelUpFlash(false), 500); }

      let newInv = [...p.inventory];
      if (battle.drops && gameMode === "idle") {
        battle.drops.forEach(drop => {
          if (Math.random() <= drop.chance) {
            newInv.push({ instanceId: Date.now() + Math.random().toString(), itemId: drop.id, awakenLvl: 0 });
            if (!player.settings.fastMode) addToast(`🎁 DROP: ${ITEMS_DB[drop.id]?.name} !`, "#ef4444");
          }
        });
      }

      return {
        ...p, beli: p.beli + (battle.beli * shipBonus * beliInc), gems: p.gems + (battle.gems || 0), bounty: p.bounty + (battle.bounty || 0),
        profile: {...p.profile, totalKills: p.profile.totalKills + 1}, level: { current: newLvl, xp: newXp, max: newMax }, power: 20 + (newLvl * 5), inventory: newInv, hakiPoints: pointsHaki
      };
    });
    
    if (gameMode === "tower") {
      setPlayer(p => ({...p, towerFloor: p.towerFloor + 1, profile: {...p.profile, highestFloor: Math.max(p.profile.highestFloor, p.towerFloor)}}));
      setBattle(null); setAutoClick(false);
    } else if (gameMode === "pvp") {
      addToast("🏆 Victoire ! +50 Rang", "#a855f7");
      setPlayer(p => ({...p, pvpRank: p.pvpRank + 50, bounty: p.bounty + 10000}));
      setBattle(null); setAutoClick(false);
    } else if (raidActive) {
      if (raidWave >= 5) { 
        if (Math.random() <= 0.05) { setPlayer(p => ({ ...p, inventory: [...p.inventory, { instanceId: Date.now().toString(), itemId: "a_saturn", awakenLvl: 0 }] })); addToast("💎 DROP MYTHIQUE: Aura Saturn!", "#06b6d4"); }
        setPlayer(p => ({...p, profile: {...p.profile, totalRaids: p.profile.totalRaids + 1}}));
        setRaidActive(false); setBattle(null); setAutoClick(false);
        addToast("🎉 RAID COMPLÉTÉ !", "#eab308");
      } else {
        const nw = raidWave + 1; setRaidWave(nw); const hpScale = Math.pow(1.8, nw) * 10000;
        setBattle({ name: nw === 5 ? "Doyen Saturn" : `Garde (Vague ${nw})`, emoji: nw===5 ? "🕷️" : "🛡️", elem: "PHY", hp: hpScale, maxHp: hpScale, beli: hpScale/10, xp: hpScale/20, gems: nw===5 ? 500 : 10, isBoss: nw===5 });
      }
    } else {
      const enemy = battle.isBoss ? SEAS[player.sea][SEAS[player.sea].length - 1] : SEAS[player.sea][Math.floor(Math.random() * (SEAS[player.sea].length - 1))]; 
      setBattle({ ...enemy, hp: enemy.hp, maxHp: enemy.hp });
    }
  };

  const startRaid = () => {
    if (player.level.current < 100) return addToast("❌ Niveau 100 requis.", "#ef4444");
    setGameMode("idle"); setRaidActive(true); setRaidWave(1);
    setBattle({ name: "Garde d'Élite (Vague 1)", emoji: "🛡️", elem: "STR", hp: 10000, maxHp: 10000, beli: 1000, xp: 500, gems: 5, isBoss: false });
    setMainTab("combat");
  };

  // --- AUTO SELL LOGIC (GRANULAIRE) ---
  const handleAutoSell = (pullsArray) => {
    let kept = []; let soldValue = 0;
    pullsArray.forEach(p => {
      const dbItem = p.type === "item" ? ITEMS_DB[p.itemId] : p.type === "pet" ? PETS_DB[p.id] : CREW_MEMBERS.find(c=>c.id===p.id);
      if (!dbItem) return;
      if (p.type === "crew" || p.type === "pet") { kept.push(p); return; } 
      if (player.settings.autoSellRarities[dbItem.rarity]) soldValue += RARITY[dbItem.rarity].val * 500; 
      else kept.push(p);
    });
    if (soldValue > 0) setPlayer(p => ({ ...p, beli: p.beli + soldValue }));
    return kept;
  };

  // --- GACHA & CINEMATIC V22 ---
  const performSummon = (bannerType, amount, isAuto = false) => {
    if (!isAuto) playClick();
    const cost = amount === 1 ? 50 : 450;
    if (player.gems < cost) { setAutoSummonConfig(c => ({...c, active: false})); if(!isAuto) addToast("Pas assez de gemmes !", "#ef4444"); return; }
    
    let pulls = []; let hasEX = false; let hasMythic = false; let maxRarityVal = 0; let bestItemForCine = null;
    let newEqPity = player.pity.item + amount; let newCrewPity = player.pity.crew + amount; let newEXPity = player.pity.ex + amount;
    
    const isCrew = bannerType === "Crew";
    const isPet = bannerType === "Pet";
    const poolData = isCrew ? CREW_MEMBERS : isPet ? Object.values(PETS_DB) : Object.values(ITEMS_DB).filter(i => i.type === bannerType || (bannerType==='Armor' && ['Head','Chest','Gloves','Boots'].includes(i.type)));

    for(let i=0; i<amount; i++) {
      const rand = Math.random(); let rarity = "Common";
      
      if (newEXPity >= 800) { rarity = "EX"; newEXPity = 0; }
      else {
        if(rand < 0.005) { rarity = "EX"; hasEX = true; newEXPity = 0; }
        else if(rand < 0.02) { rarity = "Divine"; hasMythic = true; } 
        else if(rand < 0.08) { rarity = "Mythic"; }
        else if(rand < 0.20) { rarity = "Legendary"; }
        else if(rand < 0.40) { rarity = "Epic"; }
        else if(rand < 0.70) { rarity = "Rare"; }
      }
      
      if((isCrew || isPet) && (rarity === "Common" || rarity === "Uncommon")) rarity = "Common"; 

      const available = poolData.filter(f => f.rarity === rarity || ((isCrew || isPet) && f.rarity === "Rare")); 
      const chosen = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : poolData[0];
      
      if (RARITY[chosen?.rarity]?.val > maxRarityVal) {
        maxRarityVal = RARITY[chosen.rarity].val;
        bestItemForCine = chosen;
      }
      
      if(isCrew) pulls.push({ type: "crew", id: chosen.id });
      else if(isPet) pulls.push({ type: "pet", id: chosen.id, instanceId: Date.now() + Math.random().toString() });
      else pulls.push({ type: "item", instanceId: Date.now() + Math.random().toString(), itemId: chosen.id, awakenLvl: 0 });
    }

    setPlayer(p => {
      let newP = { ...p, gems: p.gems - cost, profile: {...p.profile, totalSummons: p.profile.totalSummons + amount}, pity: { ...p.pity, ex: newEXPity } };
      if (isCrew) {
        newP.pity.crew = newCrewPity;
        pulls.forEach(pull => { 
          if(newP.crewList.includes(pull.id)) newP.memberFragments[pull.id] = (newP.memberFragments[pull.id]||0) + 5; 
          else newP.crewList.push(pull.id); 
        });
      } else if (isPet) {
        pulls.forEach(pull => { newP.pets.inventory.push({ instanceId: pull.instanceId, itemId: pull.id }); });
      } else {
        newP.pity.item = newEqPity;
        const keptItems = handleAutoSell(pulls);
        newP.inventory = [...newP.inventory, ...keptItems];
      }
      return newP;
    });
    
    const displayRes = pulls.map(p => isCrew ? CREW_MEMBERS.find(m=>m.id===p.id) : isPet ? PETS_DB[p.id] : { ...ITEMS_DB[p.itemId], instanceId: p.instanceId });
    
    // GACHA CINEMATIC REVEAL (DB LEGENDS STYLE)
    if (!isAuto && (hasEX || maxRarityVal >= RARITY.Divine.val)) {
      setAutoClick(false); // Pause auto farm during cinematic
      setCinematicSummon({ active: true, item: bestItemForCine });
      setTimeout(() => {
        setCinematicSummon({ active: false, item: null });
        setSummonResult(displayRes);
        setTimeout(() => setSummonResult(null), 5000);
      }, 4000);
    } else {
      if (isAuto && player.settings.skipLowAnim && maxRarityVal < RARITY.Legendary.val) { /* Skip Anim */ } 
      else { setSummonResult(displayRes); setTimeout(() => setSummonResult(null), isAuto ? 1500 : 5000); }
    }
    
    if (isAuto && maxRarityVal >= RARITY[autoSummonConfig.targetRarity].val) setAutoSummonConfig(c => ({...c, active: false}));
  };

  // --- RENDER CINEMATIC GACHA ---
  if (cinematicSummon.active && cinematicSummon.item) {
    const item = cinematicSummon.item;
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <style>{`
          .cine-bg { position: absolute; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent, ${RARITY[item.rarity].color}, transparent); animation: rotateCine 4s linear infinite; opacity: 0.5; }
          .cine-flash { position: absolute; inset: 0; background: #fff; animation: flashCine 4s ease-out forwards; pointer-events: none; }
          .cine-item { font-size: 150px; animation: popItem 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; filter: drop-shadow(0 0 50px ${RARITY[item.rarity].color}); z-index: 10; }
          .cine-text { font-size: 40px; font-weight: 900; color: #fff; text-shadow: 0 0 20px ${RARITY[item.rarity].color}; margin-top: 20px; animation: slideUp 1s ease-out forwards; z-index: 10; }
          .cine-rarity { font-size: 20px; letter-spacing: 10px; color: ${RARITY[item.rarity].color}; animation: slideUp 1.2s ease-out forwards; z-index: 10; font-weight: bold; }
          @keyframes rotateCine { 100% { transform: rotate(360deg); } }
          @keyframes flashCine { 0%, 10% { opacity: 1; } 100% { opacity: 0; } }
          @keyframes popItem { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes slideUp { 0% { transform: translateY(50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        `}</style>
        <div className="cine-bg"></div>
        <div className="cine-flash"></div>
        <div className="cine-rarity">{item.rarity.toUpperCase()}</div>
        <div className="cine-item">{item.img}</div>
        <div className="cine-text">{item.name.toUpperCase()}</div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div style={{ background: "#050505", height: "100dvh", width: "100vw", color: "#f8fafc", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {levelUpFlash && <div style={{ position: "absolute", inset: 0, background: "rgba(255, 255, 255, 0.4)", zIndex: 999, pointerEvents: "none", animation: "flashAnim 0.5s ease-out" }} />}
      
      {/* ULTIMATE CINEMATIC OVERLAY */}
      {showUltAnim.active && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "ultimateReveal 1.5s forwards" }}>
          <div style={{ fontSize: "150px", filter: "drop-shadow(0 0 30px #ef4444)" }}>{showUltAnim.char}</div>
          <h1 className="rainbow-text" style={{fontSize:"60px", margin:0, fontStyle: "italic"}}>ULTIMATE!</h1>
        </div>
      )}

      {/* TOASTS SYSTEM */}
      <div style={{ position: "absolute", top: "env(safe-area-inset-top, 20px)", left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", flexDirection: "column", gap: "10px", pointerEvents: "none", width: "90%", maxWidth: "400px" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: "rgba(24,24,27,0.95)", border: `1px solid ${t.color}`, padding: "10px 15px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.5)", animation: "toastSlide 0.3s ease-out", display: "flex", justifyContent: "center" }}>
            {t.msg}
          </div>
        ))}
      </div>

      <style>{`
        * { box-sizing: border-box; user-select: none; touch-action: manipulation; }
        ::-webkit-scrollbar { display: none; }
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flashAnim { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ultimateReveal { 0% { opacity: 0; transform: scale(0.8); } 20% { opacity: 1; transform: scale(1.2); } 80% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0; transform: scale(2); } }
        @keyframes toastSlide { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        /* GACHA VISUALS (Common to EX) */
        .common-shine { border: 1px solid #9ca3af; }
        .uncommon-shine { border: 1px solid #22c55e; box-shadow: 0 0 5px rgba(34,197,94,0.3); }
        .rare-shine { border: 1px solid #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.5); animation: rarePulse 2s infinite; }
        @keyframes rarePulse { 0% { box-shadow: 0 0 5px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 15px rgba(59,130,246,0.6); } 100% { box-shadow: 0 0 5px rgba(59,130,246,0.3); } }
        
        .epic-pulse { border: 2px solid #a855f7 !important; box-shadow: 0 0 15px rgba(168,85,247,0.6); animation: epicPulse 1.5s infinite; }
        @keyframes epicPulse { 0% { box-shadow: 0 0 10px rgba(168,85,247,0.4); } 50% { box-shadow: 0 0 25px rgba(168,85,247,0.8); } 100% { box-shadow: 0 0 10px rgba(168,85,247,0.4); } }
        
        .legendary-shine { position: relative; overflow: hidden; border: 2px solid #eab308 !important; box-shadow: 0 0 25px rgba(234,179,8,0.6); }
        .legendary-shine::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(60deg, transparent 20%, rgba(255,255,255,0.8) 50%, transparent 80%); transform: rotate(30deg); animation: shineAnim 2s infinite; }
        @keyframes shineAnim { 0% { transform: translateX(-100%) translateY(-100%) rotate(30deg); } 100% { transform: translateX(100%) translateY(100%) rotate(30deg); } }
        
        .mythic-glow { border: 2px solid transparent !important; background: linear-gradient(#18181b, #18181b) padding-box, linear-gradient(45deg, #ef4444, #f97316, #ef4444) border-box; box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); animation: pulseRed 1.5s infinite alternate; }
        @keyframes pulseRed { 0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); } 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.8); } }
        
        .divine-aura { border: 2px solid transparent !important; background: linear-gradient(#18181b, #18181b) padding-box, linear-gradient(45deg, #06b6d4, #3b82f6, #06b6d4) border-box; box-shadow: 0 0 30px rgba(6,182,212,0.8); animation: divineFloat 1s infinite alternate; }
        @keyframes divineFloat { 0% { transform: translateY(0px); box-shadow: 0 0 20px rgba(6,182,212,0.5); } 100% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(6,182,212,1); } }
        
        .ex-shatter { border: 2px solid transparent !important; background: linear-gradient(#000, #000) padding-box, linear-gradient(90deg, #f472b6, #38bdf8, #f472b6) border-box; box-shadow: 0 0 40px rgba(244, 114, 182, 0.8); animation: shatterEX 1s infinite alternate; z-index: 50;}
        @keyframes shatterEX { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }

        .rainbow-text { background-image: linear-gradient(to right, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7); -webkit-background-clip: text; color: transparent; animation: rainbow 3s linear infinite; background-size: 200% auto; font-weight: 900;}
        @keyframes rainbow { to { background-position: 200% center; } }
        
        .dmg-text { position: absolute; font-weight: 900; animation: floatDmg 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; pointer-events: none; text-shadow: 0px 3px 5px rgba(0,0,0,0.9); z-index: 100; }
        @keyframes floatDmg { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { transform: translateY(-30px) scale(1.4); opacity: 1; } 100% { transform: translateY(-80px) scale(1); opacity: 0; } }
        
        .shake-anim { animation: hitShake 0.15s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes hitShake { 25% { transform: translate(-4px, 4px) rotate(-2deg); } 50% { transform: translate(4px, -3px) rotate(2deg); } 75% { transform: translate(-4px, -4px) rotate(0deg); } }
        .hitstop { filter: brightness(1.5) contrast(1.2); transform: scale(0.98); }
        
        .pity-bar { height: 6px; border-radius: 3px; background: #27272a; overflow: hidden; margin-top: 5px; position: relative; }
        .pity-fill { height: 100%; transition: width 0.3s; }
        .showcase-scroll { display: flex; gap: 10px; overflow-x: auto; padding: 10px; margin-bottom: 15px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid #27272a; scroll-behavior: smooth; }
        
        .rbx-btn { background: #1e293b; border: 1px solid #334155; border-radius: 10px; color: white; padding: 12px; font-weight: 800; cursor: pointer; transition: 0.1s; display: flex; align-items: center; justify-content: center; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 0 rgba(0,0,0,0.4); min-height: 44px; }
        .rbx-btn:active { transform: translateY(4px); box-shadow: 0 0 0 rgba(0,0,0,0.4); filter: brightness(0.8); }
        .rbx-btn-green { background: linear-gradient(180deg, #22c55e, #16a34a); border-color: #14532d; }
        .rbx-btn-blue { background: linear-gradient(180deg, #3b82f6, #2563eb); border-color: #1e3a8a; }
        .rbx-btn-gold { background: linear-gradient(180deg, #eab308, #ca8a04); border-color: #713f12; color: #000; }
        .rbx-btn-purple { background: linear-gradient(180deg, #a855f7, #7e22ce); border-color: #581c87; color: #fff; }
        .rbx-btn-orange { background: linear-gradient(180deg, #f97316, #c2410c); border-color: #9a3412; color: #fff; }

        .rbx-panel { background: rgba(24, 24, 27, 0.95); border: 1px solid #27272a; border-radius: 16px; padding: 16px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 20px rgba(0,0,0,0.5); }
        .ios-tap { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        
        /* FRAMES DE PROFIL */
        .frame-default { border: 2px solid #3b82f6; }
        .frame-gold { border: 3px solid #eab308; box-shadow: 0 0 15px rgba(234, 179, 8, 0.5); }
        .frame-neon { border: 3px solid #a855f7; box-shadow: 0 0 20px #a855f7, inset 0 0 10px #a855f7; }
        .frame-flame { border: 3px solid #ef4444; box-shadow: 0 0 20px #ef4444; animation: pulseRed 1s infinite alternate; }
      `}</style>

      {/* --- CARTE DE PROFIL MODAL --- */}
      {showProfile && (
        <div className="modal-overlay ios-tap" onClick={() => setShowProfile(false)}>
          <div className="rbx-panel fade-in" style={{ width: "100%", maxWidth: "400px", border: "2px solid #eab308", maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "15px" }}>
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#eab308" }}>PROFIL JOUEUR</span>
              <button onClick={() => setShowProfile(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", fontWeight: "bold" }}>✕</button>
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button onClick={() => setProfileTab("stats")} className={`rbx-btn ${profileTab==='stats'?'rbx-btn-blue':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>STATS</button>
              <button onClick={() => setProfileTab("edit")} className={`rbx-btn ${profileTab==='edit'?'rbx-btn-green':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>ÉDITER</button>
            </div>

            {profileTab === "stats" && (
              <div className="fade-in">
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                  <div className={`frame-${player.profile.frame}`} style={{ fontSize: "60px", background: "#18181b", padding: "10px", borderRadius: "15px" }}>{player.profile.avatar}</div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: "#fff" }}>{player.profile.username} {player.profile.flag}</div>
                    <div className="rainbow-text" style={{ fontSize: "14px" }}>{player.profile.titleEquipped}</div>
                    <div style={{ color: "#a1a1aa", fontSize: "12px", marginTop: "5px", fontStyle: "italic" }}>"{player.profile.bio}"</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ background: "#18181b", padding: "10px", borderRadius: "8px", border: "1px solid #27272a" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af", display: "block" }}>PUISSANCE</span>
                    <span className={getGrade(getDmg()).isRainbow ? "rainbow-text" : ""} style={{ fontSize: "18px", fontWeight: "bold", color: getGrade(getDmg()).color }}>{Format.num(getDmg())}</span>
                  </div>
                  <div style={{ background: "#18181b", padding: "10px", borderRadius: "8px", border: "1px solid #27272a" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af", display: "block" }}>PRIME</span>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444" }}>💀 {Format.num(player.bounty)}</span>
                  </div>
                  <div style={{ background: "#18181b", padding: "10px", borderRadius: "8px", border: "1px solid #27272a" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af", display: "block" }}>COLLECTION</span>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#22c55e" }}>{player.crewList.length}/{CREW_MEMBERS.length}</span>
                  </div>
                  <div style={{ background: "#18181b", padding: "10px", borderRadius: "8px", border: "1px solid #27272a" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af", display: "block" }}>INVOCATIONS</span>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#38bdf8" }}>{player.profile.totalSummons} Pulls</span>
                  </div>
                </div>
                <div style={{ background: "linear-gradient(90deg, #1e1b4b, #312e81)", padding: "12px", borderRadius: "8px", border: "1px solid #6366f1", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "#c7d2fe", fontWeight: "bold", textTransform: "uppercase" }}>Équipage Actif</span>
                  <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px", fontSize: "28px" }}>
                    {player.crewSetup.active.map((id, i) => <span key={i}>{id ? CREW_MEMBERS.find(m=>m.id===id)?.img : "👤"}</span>)}
                  </div>
                </div>
              </div>
            )}

            {profileTab === "edit" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Nom d'Équipage</span>
                  <input type="text" value={player.profile.username} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, username: e.target.value}}))} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "5px" }} maxLength={15} />
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Bio</span>
                  <input type="text" value={player.profile.bio} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, bio: e.target.value}}))} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "5px" }} maxLength={30} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Titre Actif</span>
                    <select value={player.profile.titleEquipped} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, titleEquipped: e.target.value}}))} style={{ width: "100%", background: "#09090b", color: "#fff", border: "1px solid #27272a", padding: "10px", borderRadius: "8px", marginTop: "5px", fontSize: "12px" }}>
                      {player.profile.titles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Cadre (Frame)</span>
                    <select value={player.profile.frame} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, frame: e.target.value}}))} style={{ width: "100%", background: "#09090b", color: "#fff", border: "1px solid #27272a", padding: "10px", borderRadius: "8px", marginTop: "5px", fontSize: "12px" }}>
                      <option value="default">Défaut</option>
                      <option value="gold">Or</option>
                      <option value="neon">Néon Violet</option>
                      <option value="flame">Flammes</option>
                    </select>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Drapeau (Emoji)</span>
                  <input type="text" value={player.profile.flag} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, flag: e.target.value}}))} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "5px" }} maxLength={2} />
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Avatar</span>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {["🏴‍☠️", "💀", "🦊", "🐯", "🤖", "⚔️", "⚓", "👑", "🐉", "🤡"].map(av => (
                      <div key={av} onClick={() => setPlayer(p => ({...p, profile: {...p.profile, avatar: av}}))} style={{ fontSize: "24px", background: player.profile.avatar === av ? "#3b82f6" : "#18181b", padding: "8px", borderRadius: "8px", border: "1px solid #27272a", cursor: "pointer" }}>{av}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- HUD HEADER COMPACT --- */}
      <div style={{ background: "#111113", paddingTop: "calc(env(safe-area-inset-top) + 20px)", paddingBottom: "10px", paddingLeft: "15px", paddingRight: "15px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #27272a", zIndex: 50 }}>
        <div>
          <div onClick={() => { playClick(); setShowProfile(true); }} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", border: "1px solid #333" }}>
            <div className={`frame-${player.profile.frame}`} style={{ fontSize: "20px", background: "#000", borderRadius: "50%", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center" }}>{player.profile.avatar}</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "900", color: getTitle(player.bounty).color }}>{player.profile.titleEquipped}</div>
              <div style={{ fontSize: "10px", color: "#a1a1aa" }}>{player.profile.username} {player.profile.flag}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px", paddingLeft: "5px" }}>
            <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "13px" }}>฿ {Format.num(player.beli)}</span>
            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "13px" }}>💎 {Format.num(player.gems)}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", paddingBottom: "5px" }}>
          <div style={{ fontSize: "9px", color: "#9ca3af", letterSpacing: "1px" }}>PUISSANCE GLOBALE</div>
          <span className={getGrade(getDmg()).isRainbow ? "rainbow-text" : ""} style={{ fontSize: "18px", fontWeight: "900", color: getGrade(getDmg()).color }}>{Format.num(getDmg())}</span>
          <div style={{ fontSize: "9px", color: "#22c55e", marginTop: "2px" }}>DPS: ~{Format.num(dps)}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* ================= TAB COMBAT (ACTION RPG) ================= */}
        {mainTab === "combat" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "5px" }}>
              <button onClick={() => { playClick(); setGameMode("idle"); setBattle(null); }} className={`rbx-btn ${gameMode === "idle" ? 'rbx-btn-blue' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "11px" }}>🗺️ GRIND</button>
              <button onClick={() => { playClick(); setGameMode("tower"); setBattle(null); }} className={`rbx-btn ${gameMode === "tower" ? 'rbx-btn-purple' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "11px" }}>🏯 TOUR</button>
              <button onClick={() => { playClick(); setGameMode("pvp"); setBattle(null); }} className={`rbx-btn ${gameMode === "pvp" ? 'rbx-btn-orange' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "11px" }}>⚔️ ARENA</button>
            </div>

            {gameMode === "idle" && (
              <div className="rbx-panel fade-in" style={{ textAlign: "center", padding: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <button onClick={() => changeSea(Object.keys(SEAS)[Object.keys(SEAS).indexOf(player.sea) - 1])} disabled={Object.keys(SEAS).indexOf(player.sea) === 0} className="rbx-btn" style={{ padding: "8px" }}>◀</button>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "18px", color: "#eab308", fontWeight: "900", textTransform: "uppercase" }}>{player.sea}</h2>
                    <span style={{ fontSize: "10px", color: "#a1a1aa" }}>{player.weather}</span>
                  </div>
                  <button onClick={() => changeSea(Object.keys(SEAS)[Object.keys(SEAS).indexOf(player.sea) + 1])} disabled={Object.keys(SEAS).indexOf(player.sea) === Object.keys(SEAS).length - 1} className="rbx-btn" style={{ padding: "8px" }}>▶</button>
                </div>

                {!battle ? (
                  <div style={{ display: "grid", gap: "10px" }}>
                    {SEAS[player.sea].map((e, idx) => (
                      <div key={idx} onClick={() => { playClick(); setBattle({ ...e, hp: e.hp, maxHp: e.hp }); }} className="rbx-btn ios-tap" style={{ justifyContent: "space-between", background: "#18181b", padding: "15px", border: `1px solid ${ELEMENTS[e.elem]?.color || '#333'}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "24px" }}>{e.emoji}</span>
                          <div style={{ textAlign: "left", textTransform: "none", lineHeight: "1.2" }}>
                            <span style={{ display: "block", color: e.isBoss ? "#ef4444" : "#fff", fontSize: "14px", fontWeight: "900" }}>{e.name}</span>
                            <span style={{ fontSize: "10px", color: e.isBoss ? "#ef4444" : "#22c55e", fontWeight: "bold" }}>{e.isBoss ? "Boss 💀" : `Élément [${e.elem||'STR'}]`}</span>
                          </div>
                        </div>
                        <span style={{ color: "#22c55e", fontSize: "14px" }}>▶</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: "bold" }}>Vous: {Format.num(player.playerHp.current)} PV</span>
                      <span style={{ color: battle.isBoss ? "#ef4444" : ELEMENTS[battle.elem]?.color || "#eab308", fontSize: "12px", fontWeight: "bold" }}>{battle.name} {ELEMENTS[battle.elem]?.icon}</span>
                    </div>
                    <div onClick={() => executeAttack("normal")} className={`${shake ? 'shake-anim' : ''} ${hitstop ? 'hitstop' : ''}`} style={{ position: "relative", width: "100%", height: "180px", background: "radial-gradient(circle, #27272a 0%, #18181b 70%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: battle.isBoss ? "2px solid #7f1d1d" : "2px solid #334155" }}>
                      <span style={{ fontSize: "80px", filter: combatState.stunTime > 0 ? "grayscale(1) brightness(0.5)" : "none", transition: "0.2s" }}>{battle.emoji}</span>
                      {floatingTexts.map(t => (
                        <span key={t.id} className="dmg-text" style={{ left: t.x, top: t.y, color: t.color, fontSize: t.isCrit ? "28px" : "18px" }}>{t.text}</span>
                      ))}
                      {combatState.isInvincible && <div style={{position:"absolute", inset:0, border:"4px solid #3b82f6", borderRadius:"16px", opacity:0.5}}></div>}
                    </div>
                    
                    <div style={{ width: "100%", background: "#27272a", height: "16px", borderRadius: "4px", margin: "10px 0", position: "relative", overflow: "hidden" }}>
                      <div style={{ width: `${(battle.hp / battle.maxHp) * 100}%`, background: "#ef4444", height: "100%", transition: "0.1s" }} />
                      <span style={{ position: "absolute", width: "100%", top: 0, left: 0, textAlign: "center", fontSize: "10px", lineHeight: "16px", fontWeight: "900", textShadow: "0 1px 2px #000" }}>{Format.num(battle.hp)} / {Format.num(battle.maxHp)}</span>
                    </div>

                    {/* ACTION RPG UI */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "15px" }}>
                      <div style={{ background: "#18181b", padding: "4px", borderRadius: "4px", border: "1px solid #3b82f6" }}>
                        <div style={{ width: `${combatState.energy}%`, background: "#3b82f6", height: "6px", borderRadius: "2px", transition: "0.2s" }}></div>
                        <span style={{fontSize:"8px", color:"#9ca3af", fontWeight:"bold"}}>ÉNERGIE</span>
                      </div>
                      <div style={{ background: "#18181b", padding: "4px", borderRadius: "4px", border: "1px solid #ef4444" }}>
                        <div style={{ width: `${combatState.ultimate}%`, background: "#ef4444", height: "6px", borderRadius: "2px", transition: "0.2s" }}></div>
                        <span style={{fontSize:"8px", color:"#9ca3af", fontWeight:"bold"}}>ULTIME</span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "15px" }}>
                      <button onClick={() => executeAttack("dash")} disabled={combatState.energy < 20} className="rbx-btn" style={{ padding: "8px 0", fontSize: "10px", background: "#374151" }}>DASH</button>
                      <button onClick={() => executeAttack("skill1")} disabled={combatState.energy < 25} className="rbx-btn rbx-btn-orange" style={{ padding: "8px 0", fontSize: "10px" }}>SKILL 1</button>
                      <button onClick={() => executeAttack("skill2")} disabled={combatState.energy < 50} className="rbx-btn rbx-btn-purple" style={{ padding: "8px 0", fontSize: "10px" }}>SKILL 2</button>
                      <button onClick={() => executeAttack("ultimate")} disabled={combatState.ultimate < 100} className="rbx-btn" style={{ padding: "8px 0", fontSize: "10px", background: combatState.ultimate >= 100 ? "#ef4444" : "#7f1d1d" }}>ULTI</button>
                    </div>

                    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                      <button onClick={() => { playClick(); setAutoClick(!autoClick); }} className={`rbx-btn ${autoClick ? 'rbx-btn-green' : ''}`} style={{ flex: 1 }}>{autoClick ? "AUTO: ON" : "AUTO: OFF"}</button>
                      <button onClick={() => { playClick(); setBattle(null); setAutoClick(false); }} className="rbx-btn" style={{ background: "#7f1d1d", borderColor: "#450a0a" }}>FUITE</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {gameMode === "tower" && (
              <div className="rbx-panel fade-in" style={{ textAlign: "center", padding: "15px", border: "2px solid #a855f7" }}>
                <h2 style={{ color: "#a855f7", margin: "0 0 5px", fontSize: "20px", textTransform: "uppercase" }}>Tour d'Impel Down</h2>
                <p style={{ fontSize: "11px", color: "#cbd5e1", marginBottom: "15px" }}>Étage actuel : <strong>{player.towerFloor}</strong></p>
                {!battle ? (
                  <button onClick={() => { playClick(); const hp = 50000 * Math.pow(1.5, player.towerFloor); setBattle({ name: `Gardien (Étage ${player.towerFloor})`, emoji: "🧌", elem: "INT", hp: hp, maxHp: hp, beli: hp/10, xp: hp/20, isBoss: true }); }} className="rbx-btn rbx-btn-purple" style={{ width: "100%" }}>AFFRONTER L'ÉTAGE {player.towerFloor}</button>
                ) : (
                  <div className="fade-in">
                    <h3 style={{ color: "#fff", margin: "0 0 10px", fontSize: "20px" }}>{battle.name}</h3>
                    <div onClick={() => executeAttack("normal")} className={`${shake ? 'shake-anim' : ''}`} style={{ position: "relative", width: "100%", height: "180px", background: "radial-gradient(circle, #3b0764 0%, #18181b 70%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #7e22ce" }}>
                      <span style={{ fontSize: "80px" }}>{battle.emoji}</span>
                      {floatingTexts.map(t => (<span key={t.id} className="dmg-text" style={{ left: t.x, top: t.y, color: t.color, fontSize: t.isCrit ? "28px" : "18px" }}>{t.text}</span>))}
                    </div>
                    <div style={{ width: "100%", background: "#27272a", height: "20px", borderRadius: "6px", margin: "15px 0", position: "relative", overflow: "hidden" }}>
                      <div style={{ width: `${(battle.hp / battle.maxHp) * 100}%`, background: "#a855f7", height: "100%" }} />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => { playClick(); setAutoClick(!autoClick); }} className={`rbx-btn ${autoClick ? 'rbx-btn-green' : ''}`} style={{ flex: 1 }}>AUTO</button>
                      <button onClick={() => { playClick(); setBattle(null); setAutoClick(false); }} className="rbx-btn" style={{ background: "#7f1d1d" }}>FUITE</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {gameMode === "pvp" && (
              <div className="rbx-panel fade-in" style={{ textAlign: "center", padding: "15px", border: "2px solid #f97316" }}>
                <h2 style={{ color: "#f97316", margin: "0 0 5px", fontSize: "20px", textTransform: "uppercase" }}>Arène PvP (Async)</h2>
                <p style={{ fontSize: "11px", color: "#cbd5e1", marginBottom: "15px" }}>Rang : <strong>{player.pvpRank} 🏆</strong></p>
                {!battle ? (
                  <button onClick={() => { playClick(); const enemyPower = getDmg() * (0.8 + Math.random() * 0.4); const hp = enemyPower * 10; setBattle({ name: `Joueur (Rang ${player.pvpRank + Math.floor(Math.random()*100)})`, emoji: "👤", hp: hp, maxHp: hp, beli: 0, xp: 0, isBoss: true, elem: "PHY" }); }} className="rbx-btn rbx-btn-orange" style={{ width: "100%" }}>CHERCHER UN ADVERSAIRE</button>
                ) : (
                  <div className="fade-in">
                    <h3 style={{ color: "#fff", margin: "0 0 10px", fontSize: "16px" }}>⚔️ {battle.name}</h3>
                    <div onClick={() => executeAttack("normal")} className={`${shake ? 'shake-anim' : ''}`} style={{ position: "relative", width: "100%", height: "180px", background: "radial-gradient(circle, #7c2d12 0%, #18181b 70%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #c2410c" }}>
                      <span style={{ fontSize: "80px" }}>{battle.emoji}</span>
                      {floatingTexts.map(t => (<span key={t.id} className="dmg-text" style={{ left: t.x, top: t.y, color: t.color, fontSize: t.isCrit ? "28px" : "18px" }}>{t.text}</span>))}
                    </div>
                    <div style={{ width: "100%", background: "#27272a", height: "20px", borderRadius: "6px", margin: "15px 0", position: "relative", overflow: "hidden" }}>
                      <div style={{ width: `${(battle.hp / battle.maxHp) * 100}%`, background: "#f97316", height: "100%" }} />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => { playClick(); setAutoClick(!autoClick); }} className={`rbx-btn ${autoClick ? 'rbx-btn-green' : ''}`} style={{ flex: 1 }}>AUTO FIGHT</button>
                      <button onClick={() => { playClick(); setBattle(null); setAutoClick(false); setPlayer(p => ({...p, pvpRank: Math.max(0, p.pvpRank - 25)})); addToast("Défaite ! -25 Rang", "#ef4444"); }} className="rbx-btn" style={{ background: "#7f1d1d" }}>ABANDONNER</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB TRAIN & UPGRADES (INCREMENTAL PIECE) ================= */}
        {mainTab === "train" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setTrainTab("stats")} className={`rbx-btn ${trainTab==='stats'?'rbx-btn-blue':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>ENTRAÎNEMENT</button>
              <button onClick={() => setTrainTab("upgrades")} className={`rbx-btn ${trainTab==='upgrades'?'rbx-btn-gold':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>UPGRADES INC.</button>
            </div>

            {trainTab === "stats" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="rbx-panel">
                  <h3 style={{ marginTop: 0 }}>Statistiques</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {['strength', 'haki', 'sword', 'gun', 'luck', 'agility'].map(s => (
                      <button key={s} onClick={() => trainStat(s)} className="rbx-btn" style={{ fontSize: "11px", justifyContent: "space-between" }}>
                        <span>{s.slice(0,3).toUpperCase()}</span>
                        <span>+{player.stats[s] || 0}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rbx-panel" style={{ border: "1px solid #a855f7" }}>
                  <h3 style={{ marginTop: 0 }}>Arbre Haki (Pts: {player.hakiPoints})</h3>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {['observation', 'armament', 'kings'].map(node => (
                      <div key={node} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#18181b", padding: "10px", borderRadius: "8px" }}>
                        <span style={{ fontSize: "12px" }}>{node.toUpperCase()} ({player.hakiTree[node]}/5)</span>
                        <button onClick={() => buyHakiTalent(node)} disabled={player.hakiPoints <= 0 || player.hakiTree[node] >= 5} className="rbx-btn rbx-btn-purple" style={{ padding: "6px 12px", fontSize: "11px" }}>UP</button>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleRebirth} className="rbx-btn rbx-btn-gold">REBIRTH ★{player.rebirth}</button>
              </div>
            )}

            {trainTab === "upgrades" && (
              <div className="rbx-panel fade-in">
                <h3 style={{ marginTop: 0, color: "#eab308" }}>Multiplicateurs Permanents</h3>
                <p style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "15px" }}>Achetez des upgrades exponentiels avec des Beli.</p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {[
                    { id: "dmg", name: "Dégâts Globaux (+10%)", color: "#ef4444" },
                    { id: "beli", name: "Gains Beli (+10%)", color: "#eab308" },
                    { id: "xp", name: "Gains XP (+10%)", color: "#3b82f6" },
                    { id: "speed", name: "Vitesse Attaque (-5ms)", color: "#22c55e" }
                  ].map(upg => {
                    const lvl = player.upgrades[upg.id] || 0;
                    const cost = 10000 * Math.pow(2.5, lvl);
                    return (
                      <div key={upg.id} style={{ background: "#18181b", padding: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${upg.color}` }}>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "bold", color: upg.color }}>{upg.name}</div>
                          <div style={{ fontSize: "10px", color: "#a1a1aa" }}>Niv. {lvl}</div>
                        </div>
                        <button onClick={() => buyIncrementalUpgrade(upg.id)} className="rbx-btn" style={{ padding: "6px 12px", fontSize: "11px", background: "#374151" }}>{Format.num(cost)} ฿</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB SUMMON (GACHA) ================= */}
        {mainTab === "summon" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "5px" }}>
              {["Crew", "Pet", "Fruit", "Weapon", "Armor"].map(b => {
                const mapBanner = b === "Armor" ? "Head" : b; 
                return (
                  <button key={b} onClick={() => { playClick(); setBanner(mapBanner); }} className={`rbx-btn ${banner === mapBanner ? 'rbx-btn-blue' : ''}`} style={{ flex: "0 0 auto", padding: "8px 15px", fontSize: "12px" }}>
                    {b.toUpperCase()}
                  </button>
                )
              })}
            </div>

            <div className="rbx-panel" style={{ textAlign: "center" }}>
              <h2 style={{ color: "#38bdf8", margin: "0 0 15px", fontSize: "20px", fontWeight: "900", letterSpacing: "2px" }}>
                INVOCATION : {banner === "Head" ? "ÉQUIPEMENT" : banner.toUpperCase()}
              </h2>

              <div style={{ textAlign: "left", marginBottom: "15px" }}>
                <span style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: "bold", marginLeft: "5px" }}>Taux (EX: 0.005% | Divine: 0.02%)</span>
                <div className="showcase-scroll">
                  {(banner === "Crew" ? CREW_MEMBERS : banner === "Pet" ? Object.values(PETS_DB) : Object.values(ITEMS_DB).filter(item => item.type === banner || (banner==='Head' && ['Chest','Gloves','Boots','Accessory'].includes(item.type))))
                    .sort((a,b) => (RARITY[b.rarity]?.val||0) - (RARITY[a.rarity]?.val||0)).map((item, i) => {
                    let animClass = "";
                    if (item.rarity === "EX") animClass = "ex-shatter";
                    else if (item.rarity === "Mythic" || item.rarity === "Divine" || item.rarity === "MR") animClass = "mythic-glow";
                    else if (item.rarity === "Legendary" || item.rarity === "LR") animClass = "legendary-shine";
                    else if (item.rarity === "Epic" || item.rarity === "UR") animClass = "epic-pulse";
                    else if (item.rarity === "Rare" || item.rarity === "SSR") animClass = "rare-shine";
                    else if (item.rarity === "Uncommon" || item.rarity === "SR") animClass = "uncommon-shine";
                    else animClass = "common-shine";

                    return (
                      <div key={i} className={animClass} style={{ flex: "0 0 auto", width: "70px", background: "#18181b", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", marginBottom: "5px" }}>{item.img}</div>
                        <div style={{ fontSize: "8px", color: RARITY[item.rarity]?.color || "#fff", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "15px" }}>
                <div style={{ background: "#18181b", padding: "8px", borderRadius: "8px", border: "1px solid #27272a", textAlign: "left" }}>
                  <div style={{ fontSize: "9px", color: "#eab308", fontWeight: "bold" }}>PITY LÉGENDAIRE</div>
                  <div className="pity-bar"><div className="pity-fill" style={{ background: "#eab308", width: `${((banner==="Crew" ? player.pity.crew : player.pity.item) / 100) * 100}%` }}></div></div>
                  <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "2px" }}>{(banner==="Crew" ? player.pity.crew : player.pity.item) % 100} / 100</div>
                </div>
                <div style={{ background: "#18181b", padding: "8px", borderRadius: "8px", border: "1px solid #27272a", textAlign: "left" }}>
                  <div style={{ fontSize: "9px", color: "#f472b6", fontWeight: "bold" }}>PITY EX (GARANTI)</div>
                  <div className="pity-bar"><div className="pity-fill" style={{ background: "#f472b6", width: `${(player.pity.ex / 800) * 100}%` }}></div></div>
                  <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "2px" }}>{player.pity.ex} / 800</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => performSummon(banner, 1)} className="rbx-btn rbx-btn-green ios-tap" style={{ flex: 1, flexDirection: "column", padding: "12px 0", opacity: autoSummonConfig.active ? 0.5 : 1, pointerEvents: autoSummonConfig.active ? 'none' : 'auto' }}>
                  <span style={{ fontSize: "14px" }}>PULL x1</span>
                  <span style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>💎 50</span>
                </button>
                <button onClick={() => performSummon(banner, 10)} className="rbx-btn rbx-btn-blue ios-tap" style={{ flex: 1, flexDirection: "column", padding: "12px 0", opacity: autoSummonConfig.active ? 0.5 : 1, pointerEvents: autoSummonConfig.active ? 'none' : 'auto' }}>
                  <span style={{ fontSize: "14px" }}>PULL x10</span>
                  <span style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>💎 450</span>
                </button>
              </div>

              {summonResult && !autoSummonConfig.active && (
                <div className="fade-in" style={{ marginTop: "20px", background: "#09090b", padding: "15px", borderRadius: "12px", border: "1px solid #27272a" }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: "14px", color: "#fff", textAlign: "left" }}>Nouveaux Objets :</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                    {summonResult.map((item, i) => {
                      let animClass = ""; let scale = 1;
                      if (item.rarity === "EX") { animClass = "ex-shatter"; scale = 1.3; }
                      else if (item.rarity === "Mythic" || item.rarity === "Divine" || item.rarity === "MR") { animClass = "mythic-glow"; scale = 1.1; }
                      else if (item.rarity === "Legendary" || item.rarity === "LR") { animClass = "legendary-shine"; scale = 1.05; }
                      else if (item.rarity === "Epic" || item.rarity === "UR") { animClass = "epic-pulse"; }
                      else if (item.rarity === "Rare" || item.rarity === "SSR") { animClass = "rare-shine"; }
                      else if (item.rarity === "Uncommon" || item.rarity === "SR") { animClass = "uncommon-shine"; }
                      else { animClass = "common-shine"; }

                      return (
                        <div key={i} className={`fade-in ${animClass}`} style={{ animationDelay: `${i * 0.05}s`, background: "#18181b", borderRadius: "8px", padding: "8px", textAlign: "center", width: "60px", transform: `scale(${scale})`, transition: "0.2s", zIndex: scale > 1 ? 10 : 1 }}>
                          {item.rarity === "EX" && <div className="rainbow-text" style={{fontSize: "7px", position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)"}}>EX!</div>}
                          <div style={{ fontSize: "24px" }}>{item.img}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB ROSTER (ÉQUIPAGE & PETS) ================= */}
        {mainTab === "roster" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setRosterTab("crew")} className={`rbx-btn ${rosterTab==='crew'?'rbx-btn-blue':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>ÉQUIPAGE</button>
              <button onClick={() => setRosterTab("pets")} className={`rbx-btn ${rosterTab==='pets'?'rbx-btn-green':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>FAMILIERS (PETS)</button>
            </div>

            {rosterTab === "crew" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {activeSyns.length > 0 && (
                  <div className="rbx-panel pulseEpic" style={{ padding: "10px", background: "linear-gradient(90deg, #18181b, #3b0764)", border: "1px solid #a855f7", textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#c084fc", fontWeight: "bold", textTransform: "uppercase" }}>Synergies Actives :</span>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", marginTop: "5px" }}>
                      {activeSyns.map((syn, i) => (
                        <span key={i} style={{ background: "rgba(168, 85, 247, 0.2)", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", color: "#eab308", border: "1px solid #a855f7" }}>{syn.name} (x{syn.mult})</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rbx-panel">
                  <h3 style={{ margin: "0 0 15px", color: "#38bdf8", fontSize: "16px", textTransform: "uppercase" }}>Formation</h3>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "5px", fontWeight: "bold" }}>⚔️ COMBATTANTS ACTIFS (Bonus 100%)</div>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                      {[0, 1, 2].map(i => {
                        const id = player.crewSetup.active[i];
                        const char = id ? CREW_MEMBERS.find(m => m.id === id) : null;
                        const isSelected = crewSelectSlot?.type === 'active' && crewSelectSlot?.index === i;
                        return (
                          <div key={`act_${i}`} onClick={() => { playClick(); setCrewSelectSlot({type: 'active', index: i}); }} style={{ flex: 1, height: "70px", background: "#18181b", border: isSelected ? "2px solid #38bdf8" : char ? `1px solid ${RARITY[char.rarity]?.color || '#555'}` : "1px dashed #334155", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                            <span style={{ fontSize: "24px" }}>{char ? char.img : "+"}</span>
                            {char && <span style={{ fontSize: "9px", color: RARITY[char.rarity]?.color, fontWeight: "bold", position: "absolute", bottom: "2px" }}>{char.rarity}</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "5px", fontWeight: "bold" }}>🛡️ SUPPORTS PASSIFS (Bonus 50%)</div>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                      {[0, 1, 2].map(i => {
                        const id = player.crewSetup.support[i];
                        const char = id ? CREW_MEMBERS.find(m => m.id === id) : null;
                        const isSelected = crewSelectSlot?.type === 'support' && crewSelectSlot?.index === i;
                        return (
                          <div key={`sup_${i}`} onClick={() => { playClick(); setCrewSelectSlot({type: 'support', index: i}); }} style={{ flex: 1, height: "60px", background: "#09090b", border: isSelected ? "2px solid #22c55e" : char ? `1px solid ${RARITY[char.rarity]?.color || '#555'}` : "1px dashed #334155", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.8, position: "relative" }}>
                            <span style={{ fontSize: "20px" }}>{char ? char.img : "+"}</span>
                            {char && <span style={{ fontSize: "8px", color: RARITY[char.rarity]?.color, fontWeight: "bold", position: "absolute", bottom: "2px" }}>{char.rarity}</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {crewSelectSlot && (
                  <div className="rbx-panel fade-in" style={{ border: `2px solid ${crewSelectSlot.type === 'active' ? '#38bdf8' : '#22c55e'}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <h4 style={{ margin: 0, color: "#fff" }}>Affecter au Slot {crewSelectSlot.index + 1}</h4>
                      <button onClick={() => setCrewSelectSlot(null)} className="rbx-btn" style={{ padding: "4px 8px", fontSize: "10px" }}>FERMER</button>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", maxHeight: "200px", overflowY: "auto", paddingRight: "5px" }}>
                      <div onClick={() => { playClick(); setPlayer(p => { let n = {...p.crewSetup}; n[crewSelectSlot.type][crewSelectSlot.index] = null; return {...p, crewSetup: n}; }); setCrewSelectSlot(null); }} style={{ background: "#7f1d1d", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        RETIRER
                      </div>
                      {player.crewList.map(id => {
                        const char = CREW_MEMBERS.find(c=>c.id===id);
                        if(!char) return null;
                        const isEq = player.crewSetup.active.includes(id) || player.crewSetup.support.includes(id);
                        return (
                          <div key={id} onClick={() => {
                            if (!isEq) {
                              playClick();
                              setPlayer(p => { let n = {...p.crewSetup}; n[crewSelectSlot.type][crewSelectSlot.index] = id; return {...p, crewSetup: n}; });
                              setCrewSelectSlot(null);
                            }
                          }} className={char.rarity === "EX" ? "ex-shatter" : ""} style={{ background: "#18181b", border: `1px solid ${RARITY[char.rarity]?.color}`, padding: "8px", borderRadius: "8px", textAlign: "center", cursor: isEq ? "not-allowed" : "pointer", opacity: isEq ? 0.3 : 1 }}>
                            <div style={{ fontSize: "24px", marginBottom: "2px" }}>{char.img}</div>
                            <div style={{ fontSize: "8px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden" }}>{char.name}</div>
                            <div style={{ fontSize: "8px", color: "#fbbf24", marginTop: "2px" }}>{player.memberFragments[id]||0} Frag</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                <div className="rbx-panel">
                   <h3 style={{ margin: "0 0 10px", color: "#eab308", fontSize: "14px" }}>📚 Pokedex Équipage</h3>
                   <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {CREW_MEMBERS.map(c => {
                        const owned = player.crewList.includes(c.id);
                        return (
                          <div key={c.id} style={{ width: "30px", height: "30px", background: owned ? "#18181b" : "#000", border: `1px solid ${owned ? RARITY[c.rarity].color : '#333'}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", opacity: owned ? 1 : 0.2, filter: owned ? "none" : "grayscale(100%)" }}>
                            <span style={{ fontSize: "16px" }}>{c.img}</span>
                          </div>
                        )
                      })}
                   </div>
                </div>
              </div>
            )}

            {rosterTab === "pets" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div className="rbx-panel">
                  <h3 style={{ margin: "0 0 15px", color: "#22c55e", fontSize: "16px", textTransform: "uppercase" }}>Familiers Actifs</h3>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                    {[0, 1].map(i => {
                      const instId = player.pets.active[i];
                      const petItem = instId ? player.pets.inventory.find(p => p.instanceId === instId) : null;
                      const petData = petItem ? PETS_DB[petItem.itemId] : null;
                      const isSelected = petSelectSlot === i;
                      
                      return (
                        <div key={`pet_${i}`} onClick={() => { playClick(); setPetSelectSlot(i); }} style={{ flex: 1, height: "80px", background: "#18181b", border: isSelected ? "2px solid #22c55e" : petData ? `1px solid ${RARITY[petData.rarity]?.color}` : "1px dashed #334155", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <span style={{ fontSize: "28px" }}>{petData ? petData.img : "🐾"}</span>
                          {petData && <span style={{ fontSize: "8px", color: "#a1a1aa", marginTop: "4px" }}>{petData.desc}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {petSelectSlot !== null && (
                  <div className="rbx-panel fade-in" style={{ border: `2px solid #22c55e` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <h4 style={{ margin: 0, color: "#fff" }}>Choisir Familier Slot {petSelectSlot + 1}</h4>
                      <button onClick={() => setPetSelectSlot(null)} className="rbx-btn" style={{ padding: "4px 8px", fontSize: "10px" }}>FERMER</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                      <div onClick={() => { playClick(); setPlayer(p => { let n = [...p.pets.active]; n[petSelectSlot] = null; return {...p, pets: {...p.pets, active: n}}; }); setPetSelectSlot(null); }} style={{ background: "#7f1d1d", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        RETIRER
                      </div>
                      {player.pets.inventory.map(invPet => {
                        const pData = PETS_DB[invPet.itemId];
                        if (!pData) return null;
                        const isEq = player.pets.active.includes(invPet.instanceId);
                        return (
                          <div key={invPet.instanceId} onClick={() => {
                            if (!isEq) {
                              playClick();
                              setPlayer(p => { let n = [...p.pets.active]; n[petSelectSlot] = invPet.instanceId; return {...p, pets: {...p.pets, active: n}}; });
                              setPetSelectSlot(null);
                            }
                          }} style={{ background: "#18181b", border: `1px solid ${RARITY[pData.rarity]?.color}`, padding: "8px", borderRadius: "8px", textAlign: "center", cursor: isEq ? "not-allowed" : "pointer", opacity: isEq ? 0.3 : 1 }}>
                            <div style={{ fontSize: "24px" }}>{pData.img}</div>
                            <div style={{ fontSize: "8px", color: "#fff" }}>{pData.name}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB INVENTORY ================= */}
        {mainTab === "inventory" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div className="rbx-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h4 style={{ margin: 0, color: "#fff" }}>Équipement RPG</h4>
                <button onClick={autoEquip} className="rbx-btn rbx-btn-gold" style={{ padding: "6px 12px", fontSize: "10px" }}>⚡ AUTO BUILD</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "15px" }}>
                {["Fruit", "Weapon", "Head", "Chest", "Gloves", "Boots", "Accessory"].map(type => {
                  let eqId = player.equipped[type === "Fruit" ? "fruitId" : type === "Weapon" ? "weaponId" : type === "Accessory" ? "accId" : `${type.toLowerCase()}Id`];
                  let item = eqId ? player.inventory.find(i => i.instanceId === eqId) : null;
                  let baseData = item ? ITEMS_DB[item.itemId] : null;

                  return (
                    <div key={type} style={{ background: "#18181b", padding: "8px", borderRadius: "8px", border: "1px solid #334155", display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "20px", background: "#09090b", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: `1px solid ${baseData ? RARITY[baseData.rarity].color : '#333'}` }}>
                        {baseData ? baseData.img : "❓"}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "8px", color: "#a1a1aa", textTransform: "uppercase" }}>{type}</div>
                        <div style={{ fontSize: "10px", fontWeight: "bold", color: baseData ? RARITY[baseData.rarity].color : "#555", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{baseData ? baseData.name : "Vide"}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
                <button onClick={sellCommons} className="rbx-btn" style={{ flex: 1, padding: "8px", fontSize: "9px", background: "#374151" }}>VENDRE COMMUNS</button>
              </div>

              <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase" }}>Sac à dos (Tap pour équiper)</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {player.inventory.map((invItem) => {
                  const item = ITEMS_DB[invItem.itemId];
                  if (!item) return null;
                  const isEq = Object.values(player.equipped).includes(invItem.instanceId);
                  const isV2 = invItem.awakenLvl >= 10;
                  
                  return (
                    <div key={invItem.instanceId} onClick={() => {
                      playClick();
                      let equipKey = item.type === "Fruit" ? "fruitId" : item.type === "Weapon" ? "weaponId" : item.type === "Accessory" ? "accId" : `${item.type.toLowerCase()}Id`;
                      setPlayer(p => ({ ...p, equipped: { ...p.equipped, [equipKey]: invItem.instanceId } }));
                    }} className={item.rarity === "Mythic" || item.rarity === "Divine" ? "mythic-glow" : item.rarity === "EX" ? "ex-shatter" : ""} style={{ background: "#18181b", border: isEq ? "2px solid #22c55e" : "1px solid #334155", borderRadius: "8px", padding: "8px", textAlign: "center", position: "relative" }}>
                      {isEq && <span style={{ position: "absolute", bottom: "2px", left: "2px", fontSize: "8px", color: "#22c55e", fontWeight: "900" }}>EQP</span>}
                      <span style={{ fontSize: "24px", filter: isV2 ? "drop-shadow(0 0 5px rgba(239, 68, 68, 0.8))" : "none" }}>{item.img}</span>
                      <button onClick={(e) => { e.stopPropagation(); awakenItem(invItem.instanceId); }} style={{ position: "absolute", top: "2px", right: "2px", background: isV2 ? "#ef4444" : "#a855f7", border: "none", color: "#fff", fontSize: "8px", borderRadius: "4px", padding: "2px", zIndex: 10 }}>
                        {isV2 ? "V2" : `+${invItem.awakenLvl || 0}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB HUB MULTI-MENUS ================= */}
        {mainTab === "hub" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "5px" }}>
              {["menu", "market", "ships", "relics", "options"].map(st => (
                <button key={st} onClick={() => { playClick(); setHubTab(st); }} className={`rbx-btn ${hubTab === st ? 'rbx-btn-blue' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "10px" }}>
                  {st === "options" ? "⚙️ SETTINGS" : st.toUpperCase()}
                </button>
              ))}
            </div>

            {hubTab === "menu" && (
              <div className="rbx-panel fade-in">
                <button onClick={claimDaily} className="rbx-btn rbx-btn-gold ios-tap" style={{ width: "100%", marginBottom: "15px" }}>🎁 RÉCOMPENSE QUOTIDIENNE</button>
                <div style={{ border: "1px solid #ef4444", background: "linear-gradient(180deg, #1e1b4b, #450a0a)", padding: "15px", borderRadius: "12px", textAlign: "center" }}>
                  <h4 style={{ margin: 0, color: "#ef4444" }}>🚨 EGGHEAD LAB RAID</h4>
                  <p style={{ fontSize: "12px", color: "#cbd5e1" }}>Boss: Saturn | Requis: Niv. 100</p>
                  <button onClick={startRaid} className="rbx-btn rbx-btn-green" style={{ width: "100%" }}>ENTRER DANS LE RAID</button>
                </div>
              </div>
            )}

            {hubTab === "market" && (
              <div className="rbx-panel fade-in">
                <h4>📈 Bourse & Marché Noir</h4>
                {Object.keys(marketPrices).map(id => (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#18181b", padding: "10px", borderRadius: "8px", marginBottom: "8px" }}>
                    <span>{ITEMS_DB[id].img} {ITEMS_DB[id].name} ({marketPrices[id]} ฿)</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => tradeMarketFruit(id, "BUY")} className="rbx-btn rbx-btn-green" style={{ padding: "4px 8px", fontSize: "10px" }}>ACH</button>
                      <button onClick={() => tradeMarketFruit(id, "SELL")} className="rbx-btn" style={{ padding: "4px 8px", fontSize: "10px", background: "#374151" }}>VEN</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hubTab === "ships" && (
              <div className="rbx-panel fade-in">
                <h4>⚓ Chantier Naval</h4>
                {Object.keys(SHIPS).map(id => (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#18181b", padding: "10px", borderRadius: "8px", marginBottom: "8px" }}>
                    <span>{SHIPS[id].img} {SHIPS[id].name}</span>
                    {player.shipId === id ? (
                      <span style={{ color: "#22c55e", fontSize: "12px" }}>ACTIF</span>
                    ) : (
                      <button onClick={() => buyShip(id, SHIPS[id].cost)} disabled={player.beli < SHIPS[id].cost} className="rbx-btn rbx-btn-gold" style={{ padding: "6px 12px", fontSize: "11px" }}>{Format.num(SHIPS[id].cost)} ฿</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {hubTab === "relics" && (
              <div className="rbx-panel fade-in">
                <h4 style={{ color: "#ef4444" }}>💀 Reliques Maudites</h4>
                {Object.keys(RELICS).map(id => {
                  const r = RELICS[id];
                  const isOwned = player.unlockedRelics.includes(id);
                  const isEq = player.equippedRelic === id;
                  return (
                    <div key={id} style={{ background: "#18181b", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: isEq ? "2px solid #ef4444" : "1px solid #334155" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ef4444" }}>{r.img} {r.name}</span>
                        {isOwned ? (
                          <button onClick={() => { playClick(); setPlayer(p => ({...p, equippedRelic: isEq ? null : id})); }} className={`rbx-btn ${isEq ? 'rbx-btn-blue' : ''}`} style={{ padding: "4px 8px", fontSize: "10px" }}>{isEq ? "DÉSÉQUIPER" : "ÉQUIPER"}</button>
                        ) : (
                          <button onClick={() => { playClick(); if(player.beli >= r.cost) { setPlayer(p => ({...p, beli: p.beli - r.cost, unlockedRelics: [...p.unlockedRelics, id]})); addToast("Relique achetée !", "#eab308"); } else addToast("Fonds insuffisants", "#ef4444"); }} className="rbx-btn rbx-btn-gold" style={{ padding: "4px 8px", fontSize: "10px" }}>{Format.num(r.cost)} ฿</button>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "5px" }}>{r.desc}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {hubTab === "options" && (
              <div className="rbx-panel fade-in">
                <h2 style={{ color: "#fff", margin: "0 0 20px", fontSize: "20px", fontWeight: "900" }}>⚙️ RÉGLAGES</h2>
                
                <div style={{ marginBottom: "15px" }}>
                  <span style={{ fontSize: "13px", color: "#38bdf8", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Code Promo</span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} style={{ flex: 1, background: "#09090b", border: "1px solid #27272a", color: "#fff", padding: "10px", borderRadius: "8px", outline: "none", fontSize: "12px" }} placeholder="ex: NEWERA_V21" />
                    <button onClick={redeemCode} className="rbx-btn rbx-btn-gold" style={{ padding: "10px 15px", fontSize: "11px" }}>VALIDER</button>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#18181b", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: "1px solid #27272a" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>Sons (SFX)</span>
                  <button onClick={() => setPlayer(p => ({...p, settings: {...p.settings, sound: !p.settings.sound}}))} className="rbx-btn" style={{ padding: "6px 12px", background: player.settings.sound ? "#22c55e" : "#3f3f46", border: "none", fontSize: "12px" }}>{player.settings.sound ? "ON" : "OFF"}</button>
                </div>
                
                <div style={{ background: "#18181b", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: "1px solid #27272a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>Musique (BGM)</span>
                    <button onClick={() => setPlayer(p => ({...p, settings: {...p.settings, music: !p.settings.music}}))} className="rbx-btn" style={{ padding: "6px 12px", background: player.settings.music ? "#22c55e" : "#3f3f46", border: "none", fontSize: "12px" }}>{player.settings.music ? "ON" : "OFF"}</button>
                  </div>
                  {player.settings.music && (
                    <div className="fade-in">
                      <select value={player.settings.bgmTrack || 0} onChange={(e) => setPlayer(p => ({...p, settings: {...p.settings, bgmTrack: parseInt(e.target.value)}}))} style={{ width: "100%", background: "#09090b", color: "#fff", border: "1px solid #334155", padding: "8px", borderRadius: "6px", fontSize: "12px", marginBottom: "10px" }}>
                        {BGM_TRACKS.map((t, idx) => <option key={t.id} value={idx}>{t.name}</option>)}
                      </select>
                      <input type="range" min="0" max="1" step="0.05" value={player.settings.bgmVolume || 0.4} onChange={(e) => setPlayer(p => ({...p, settings: {...p.settings, bgmVolume: parseFloat(e.target.value)}}))} style={{ width: "100%" }} />
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#18181b", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: "1px solid #27272a" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>Shake Screen (Séismes)</span>
                  <button onClick={() => setPlayer(p => ({...p, settings: {...p.settings, shake: !p.settings.shake}}))} className="rbx-btn" style={{ padding: "6px 12px", background: player.settings.shake ? "#3b82f6" : "#3f3f46", border: "none", fontSize: "12px" }}>{player.settings.shake ? "ON" : "OFF"}</button>
                </div>

                <div style={{ background: "#18181b", padding: "12px", borderRadius: "10px", marginBottom: "15px", border: "1px solid #334155" }}>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", display: "block", marginBottom: "5px" }}>🤖 Macro Légale (Tâche de fond)</span>
                  <button onClick={() => setLegalMacro(m => ({ ...m, active: !m.active, counter: 0 }))} className={`rbx-btn ${legalMacro.active ? 'rbx-btn-green' : 'rbx-btn-blue'}`} style={{ width: "100%", padding: "8px", fontSize: "11px" }}>
                    {legalMacro.active ? "ARRÊTER LA MACRO" : "ACTIVER LA MACRO"}
                  </button>
                </div>

                <button onClick={() => {
                  if (window.confirm("Voulez-vous vraiment TOUT effacer ? Votre progression sera perdue à jamais.")) { localStorage.removeItem(SAVE_KEY); window.location.reload(); }
                }} className="rbx-btn ios-tap" style={{ width: "100%", background: "#7f1d1d", borderColor: "#450a0a", fontSize: "12px", marginTop: "20px" }}>⚠️ EFFACER MA SAUVEGARDE</button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- BOTTOM NAVIGATION BAR V22 --- */}
      <div style={{ background: "rgba(9, 9, 11, 0.98)", borderTop: "1px solid #27272a", display: "flex", justifyContent: "space-between", padding: "10px 10px calc(env(safe-area-inset-bottom) + 15px)", zIndex: 100 }}>
        {[
          { id: "combat", icon: "⚔️", label: "COMBAT" },
          { id: "train", icon: "💪", label: "TRAIN" },
          { id: "summon", icon: "✨", label: "GACHA" },
          { id: "roster", icon: "⚓", label: "ÉQUIPE" },
          { id: "inventory", icon: "🎒", label: "SAC" },
          { id: "hub", icon: "🧭", label: "MENU" }
        ].map(t => (
          <div key={t.id} onClick={() => { playClick(); setMainTab(t.id); }} className="ios-tap" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "4px 0", opacity: mainTab === t.id ? 1 : 0.4, transition: "0.2s" }}>
            <span style={{ fontSize: "20px", filter: mainTab === t.id ? "drop-shadow(0 0 8px rgba(56,189,248,0.8))" : "none" }}>{t.icon}</span>
            <span style={{ fontSize: "8px", fontWeight: "900", color: mainTab === t.id ? "#38bdf8" : "#9ca3af" }}>{t.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}