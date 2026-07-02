
import React, { useState, useEffect, useRef, useMemo } from "react";
import { RARITY, ELEMENTS, getElementAdvantage, REBIRTH_SHOP, Format, getGrade, getTitle, SAVE_KEY, DEFAULT_PLAYER } from './data/constants';
import { ITEMS_DB, SHIPS, RELICS } from './data/items';
import { PETS_DB } from './data/pets';
import { SEAS, CREW_MEMBERS, SYNERGIES, DBL_CARDS, BGM_TRACKS } from './data/combat';

import { useCombatEngine } from './hooks/useCombatEngine';
import { useGacha } from './hooks/useGacha';
import { useIncremental } from './hooks/useIncremental';

import { CombatView } from './components/CombatView';
import { TrainView } from './components/TrainView';
import { SummonView } from './components/SummonView';
import { RosterView } from './components/RosterView';
import { InventoryView } from './components/InventoryView';
import { HubView } from './components/HubView';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [introText, setIntroText] = useState("CHARGEMENT DU NOUVEAU MONDE...");
  
  // Navigation
  const [mainTab, setMainTab] = useState("combat");
  const [hubTab, setHubTab] = useState("menu");
  const [rosterTab, setRosterTab] = useState("crew");
  const [trainTab, setTrainTab] = useState("stats");
  const [gameMode, setGameMode] = useState("idle");
  
  const [player, setPlayer] = useState(DEFAULT_PLAYER);
  const [battle, setBattle] = useState(null);
  const [activeBounty, setActiveBounty] = useState(null);
  
  // Combat Action States (DBL V23)
  const [combatState, setCombatState] = useState({ energy: 100, ultimate: 0, vanishing: 100, isInvincible: false, enemyAttacking: false, comboCount: 0 });
  const [combatDeck, setCombatDeck] = useState([]);
  const [dragonBalls, setDragonBalls] = useState(0);
  const [comboCount, setComboCount] = useState(0); // NOUVEAU V24: Compteur de Combo

  const [currentTime, setCurrentTime] = useState(() => Date.now());
  useEffect(() => {
      const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
      return () => clearInterval(interval);
  }, []);

  const [floatingTexts, setFloatingTexts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [autoClick, setAutoClick] = useState(false);
  const [shake, setShake] = useState(false);
  const [hitstop, setHitstop] = useState(false);
  const [showUltAnim, setShowUltAnim] = useState({ active: false, char: null, text: "ULTIMATE!" });
  const [cinematicSummon, setCinematicSummon] = useState({ active: false, item: null });
  
  const [raidActive, setRaidActive] = useState(false);
  const [raidWave, setRaidWave] = useState(1);
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  const [summonResult, setSummonResult] = useState(null);
  const [banner, setBanner] = useState("Fruit");
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState({ gems: 0, beli: 0 });


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
  useEffect(() => {
    // Safe-area fix to avoid CSS crashing on specific devices
    document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 20px)');
    document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 20px)');
  }, []);

  const addToast = (msg, color="#3b82f6") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, {id, msg, color}]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // --- CINÉMATIQUE D'INTRO V23 ---

  useEffect(() => {
    if (battle && dragonBalls === 0) {
       // Check for 5* pet equipped
       const has5StarPet = player.pets.active.some(pInst => {
           if(!pInst) return false;
           const petItem = player.pets.inventory.find(i=>i.instanceId===pInst);
           return petItem && (petItem.stars || 1) >= 5;
       });
       if (has5StarPet) {
           setDragonBalls(1);
           addToast("Bonus Divin: +1 Dragon Ball", "#f472b6");
       }
    }
  }, [battle]);

  useEffect(() => {
    setTimeout(() => setIntroText("ÉVEIL DES FRUITS DU DÉMON..."), 1000);
    setTimeout(() => setIntroText("PRÉPARATION AU COMBAT..."), 2000);
    const fadeTimer = setTimeout(() => { setIsFadingOut(true); }, 3000); 
    const removeTimer = setTimeout(() => { setIsLoading(false); }, 3800);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

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

  // --- SAUVEGARDE & MIGRATION ---
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
          m.rebirthUpgrades = { ...DEFAULT_PLAYER.rebirthUpgrades, ...(parsed.rebirthUpgrades||{}) };
          m.pity = { ...DEFAULT_PLAYER.pity, ...(parsed.pity||{}) };
          
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
            setTimeout(() => addToast(`🌙 Gains AFK: ${Format.num(gainBeli)} ฿, ${gainXp} XP`, "#eab308"), 4000);
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
    } else if (player.gems < 50 && autoSummonConfig.active) {
      setAutoSummonConfig(c => ({ ...c, active: false }));
    }
    return () => clearInterval(summonTimer);
  }, [autoSummonConfig.active, player.gems, summonResult, cinematicSummon.active, banner]);

  // --- SYNERGIES & STATS ENGINE V23 ---















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
      addToast(`Objets vendus: ${Format.num(sold)} ฿`, "#22c55e");
    } else addToast("Rien à vendre.", "#9ca3af");
  };

  const awakenItem = (instanceId) => {
    playClick();
    const item = player.inventory.find(i => i.instanceId === instanceId);
    if (!item) return;
    const isV2 = item.awakenLvl >= 10;
    const reqSaturn = isV2 && item.itemId === "f_nika";
    const cost = 5000 * Math.pow(2, item.awakenLvl || 0);
    if (player.beli < cost) return addToast(`Fonds insuffisants.`, "#ef4444");
    if (reqSaturn && !player.inventory.find(i => i.itemId === "a_saturn")) return addToast("Aura de Saturn requise !", "#ef4444");

    setPlayer(p => ({
      ...p, beli: p.beli - cost,
      inventory: p.inventory.map(i => i.instanceId === instanceId ? { ...i, awakenLvl: (i.awakenLvl || 0) + 1 } : i)
    }));
    addToast("✨ Objet éveillé !", "#a855f7");
  };

  const claimDaily = () => {
    playClick(); const now = Date.now(); const oneDay = 24 * 60 * 60 * 1000;
    if (now - player.lastDaily > oneDay) {
      const gemsReward = 100 + Math.floor(Math.random() * 50);
      const beliReward = 15000 * player.level.current;
      setPlayer(p => ({ ...p, gems: p.gems + gemsReward, beli: p.beli + beliReward, lastDaily: now }));
      setDailyRewardAmount({ gems: gemsReward, beli: beliReward });
      setShowDailyModal(true);
    } else {
      addToast(`Revenez dans ${Math.ceil((oneDay - (now - player.lastDaily)) / 3600000)} heures !`, "#9ca3af");
    }
  };



  const tradeMarketFruit = (id, action) => {
    playClick();
    const currentPrice = marketPrices[id];

    if (action === "BUY") {
      if (player.beli >= currentPrice) {
        setPlayer(p => ({
          ...p,
          beli: p.beli - currentPrice,
          inventory: [...p.inventory, { instanceId: Date.now() + Math.random().toString(), itemId: id, awakenLvl: 0 }]
        }));
        addToast(`Fruit acheté !`, "#22c55e");
      } else {
        addToast(`Fonds insuffisants !`, "#ef4444");
      }
    } else if (action === "SELL") {
      const itemToSell = player.inventory.find(i => i.itemId === id && !Object.values(player.equipped).includes(i.instanceId));
      if (!itemToSell) {
        addToast(`Aucun fruit non-équipé disponible !`, "#ef4444");
      } else {
        const sellPrice = Math.floor(currentPrice * 0.75);
        setPlayer(p => ({
          ...p,
          beli: p.beli + sellPrice,
          inventory: p.inventory.filter(i => i.instanceId !== itemToSell.instanceId)
        }));
        addToast(`Fruit vendu pour ${Format.num(sellPrice)} ฿ !`, "#3b82f6");
      }
    }
  };

  const changeSea = (newSea) => {
    playClick();
    if (Date.now() < player.logPoseTime) return addToast(`🧭 Log Pose en charge...`, "#3b82f6");
    const newIdx = Object.keys(SEAS).indexOf(newSea);
    if (player.level.current < newIdx * 30) return addToast(`❌ Niveau ${newIdx * 30} requis.`, "#ef4444");
    setPlayer(p => ({ ...p, sea: newSea, logPoseTime: Date.now() + 60000 }));
    setBattle(null); setCombatDeck([]); setDragonBalls(0); setComboCount(0);
  };

  const redeemCode = () => {
    playClick();
    if (promoCode === "NEWERA_V21" && !player.redeemedCodes?.includes("NEWERA_V21")) {
      setPlayer(p => ({...p, gems: p.gems + 1000, redeemedCodes: [...(p.redeemedCodes||[]), "NEWERA_V21"]}));
      addToast("🎉 Code valide ! +1000 💎", "#22c55e");
    } else addToast("❌ Code invalide.", "#ef4444");
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
    addToast("⚡ Auto-Build", "#eab308");
  };



  // --- GACHA ENGINE ---


  // ==========================================
  // COMBAT ENGINE V24 (DBL ADVANCED STYLE)
  // ==========================================

  const spawnText = (prefix, dmg, isCrit, color="#fff") => {
    if(player.settings.hideDmg) return;
    const id = Date.now() + Math.random();
    const x = window.innerWidth / 2 + (Math.random() * 80 - 40);
    const y = 200 + (Math.random() * 80 - 40);
    setFloatingTexts(prev => [...prev, { id, x, y, text: `${prefix}${dmg>0?Format.num(dmg):''}${isCrit?'!':''}`, color, isCrit }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 600);
  };

  // 1. Deck Drawing Loop
  useEffect(() => {
    if (!battle || isLoading) return;
    const drawTimer = setInterval(() => {
      setCombatDeck(prev => {
        if (prev.length >= 4) return prev;
        const randCard = DBL_CARDS[Math.floor(Math.random() * DBL_CARDS.length)];
        const hasDB = Math.random() < 0.15 && dragonBalls < 7; // 15% chance for DB
        return [...prev, { ...randCard, uid: Date.now() + Math.random(), hasDB }];
      });
    }, 1200); 
    return () => clearInterval(drawTimer);
  }, [battle, isLoading, dragonBalls]);

  // 2. Main Battle Loop (Ki, Vanishing, Enemy AI)
  useEffect(() => {
    if(!battle || isLoading) return;
    const loop = setInterval(() => {
      // Regen Ki & Vanish
      const kiRegen = 15 * (1 + (player.rebirthUpgrades.rb_energy||0)*REBIRTH_SHOP.rb_energy.val);
      setCombatState(prev => ({
        ...prev, 
        energy: Math.min(100, prev.energy + kiRegen), 
        vanishing: Math.min(100, prev.vanishing + 10),
        stunTime: Math.max(0, prev.stunTime - 1) 
      }));
      
      // Enemy Boss AI Attack (Flash "!" warning)
      if(battle.isBoss && combatState.stunTime === 0 && Math.random() > 0.7) {
        setCombatState(prev => ({ ...prev, enemyAttacking: true }));
        setTimeout(() => {
          setCombatState(curr => {
            if (curr.enemyAttacking && !curr.isInvincible) { // S'il n'a pas esquivé ou contré
              const bossDmg = Math.floor(player.playerHp.max * 0.10); 
              setPlayer(p => ({...p, playerHp: {...p.playerHp, current: Math.max(0, p.playerHp.current - bossDmg)}}));
              setCombatState(prev => ({ ...prev, comboCount: 0 })); // Reset combo on damage
              if(player.settings.shake) { setShake(true); setTimeout(() => setShake(false), 200); }
              spawnText("DÉGÂTS REÇUS ", bossDmg, false, "#ef4444");
              setComboCount(0); // NOUVEAU V24: L'ennemi te touche, combo brisé !
            }
            return { ...curr, enemyAttacking: false };
          });
        }, 800); 
      }
    }, 1000);
    return () => clearInterval(loop);
  }, [battle, isLoading, combatState.stunTime, player.rebirthUpgrades]);


  // Player Death Check
  useEffect(() => {
    if(player.playerHp.current <= 0 && battle) {
      if (gameMode === "pvp") {
        setPlayer(p => ({...p, pvpRank: Math.max(0, p.pvpRank - 25), playerHp: {...p.playerHp, current: p.playerHp.max}}));
        addToast("☠️ Défaite... -25 Rang", "#ef4444");
      } else {
        setPlayer(p => ({...p, playerHp: {...p.playerHp, current: p.playerHp.max}, bounty: Math.max(0, Math.floor(p.bounty * 0.95))}));
        addToast("☠️ K.O... Prime réduite.", "#ef4444");
      }
      setBattle(null); setAutoClick(false);
    }
  }, [player.playerHp.current, battle]);

  // 3. Vanishing Step (Esquive Parfaite V24)
  const executeVanish = () => {
    if (combatState.vanishing < 100) return;
    playClick();
    const isPerfect = combatState.enemyAttacking; // V24: Esquive au bon moment = Perfect Vanish
    
    setCombatState(prev => ({ 
      ...prev, 
      vanishing: 0, 
      isInvincible: true, 
      enemyAttacking: false,
      energy: isPerfect ? Math.min(100, prev.energy + 50) : prev.energy // +50 Ki si parfait
    }));
    
    if (isPerfect) spawnText("ESQUIVE PARFAITE ! +50 KI", 0, false, "#3b82f6");
    else spawnText("Esquive", 0, false, "#9ca3af");

    setTimeout(() => setCombatState(prev => ({...prev, isInvincible: false})), 1000);
  };

  // 4. Executer une carte


  // 5. Rising Rush
  const executeRisingRush = () => {
    if (dragonBalls < 7 || !battle) return;
    playClick();
    setDragonBalls(0);
    setComboCount(0);
    
    const rushDmg = Math.floor(getDmg() * 20); // Dégâts massifs
    setShowUltAnim({ active: true, char: "🐉", text: "RISING RUSH!" }); 
    setTimeout(() => setShowUltAnim({active:false, char:null}), 2000);
    if(player.settings.shake) { setShake(true); setTimeout(() => setShake(false), 800); }

    spawnText("💥 RUSH ", rushDmg, true, "#ef4444");
    const newHp = Math.max(0, battle.hp - rushDmg);
    if (newHp <= 0) setTimeout(() => handleVictory(), 1000);
    else setBattle(prev => ({ ...prev, hp: newHp }));
  };

  const getAtkDelay = () => player.settings?.fastMode ? 500 : 1500;

  // Auto-Fight AI
  useEffect(() => {
    let autoTimer;
    if (autoClick && battle && !isLoading) {
      autoTimer = setInterval(() => {
        if (combatDeck.length > 0) {
          const playableCardIdx = combatDeck.findIndex(c => combatState.energy >= c.cost);
          if (playableCardIdx !== -1) executeCard(combatDeck[playableCardIdx], playableCardIdx);
        }
        if (combatState.enemyAttacking && combatState.vanishing >= 100) executeVanish();
        if (dragonBalls >= 7) executeRisingRush();
      }, getAtkDelay());
    }
    return () => clearInterval(autoTimer);
  }, [autoClick, battle, combatDeck, combatState.energy, dragonBalls, combatState.enemyAttacking]);

  const handleVictory = () => {
    const shipBonus = SHIPS[player.shipId]?.extraBeli || 1;
    let beliInc = 1 + (player.upgrades.beli * 0.1); let xpInc = 1 + (player.upgrades.xp * 0.1);
    player.pets.active.forEach(pInst => {
      if(!pInst) return;
      const petItem = player.pets.inventory.find(i=>i.instanceId===pInst);
      if(petItem) {
        const pDb = PETS_DB[petItem.itemId];
        const starsMult = 1 + ((petItem.stars || 1) - 1) * 0.5;
        if(pDb && (pDb.bonusType === 'beli' || pDb.bonusType === 'all')) beliInc += pDb.bonusVal * starsMult;
        if(pDb && (pDb.bonusType === 'xp' || pDb.bonusType === 'all')) xpInc += pDb.bonusVal * starsMult;
      }
    });

    setPlayer(p => {
      let newXp = p.level.xp + (battle.xp * xpInc); let newLvl = p.level.current; let newMax = p.level.max; let pointsHaki = p.hakiPoints;
      while (newXp >= newMax) { newLvl++; newXp -= newMax; newMax = Math.floor(newMax * 1.6); pointsHaki++; }
      if(newLvl > p.level.current) { setLevelUpFlash(true); setTimeout(() => setLevelUpFlash(false), 500); }

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
    
    setDragonBalls(0); setCombatDeck([]); setComboCount(0); // Reset
    
    if (battle.name === activeBounty?.name) {
      setActiveBounty(null);
      setBattle(null); setAutoClick(false);
      addToast("👑 PRIME RÉCOLTÉE !", "#eab308");
    } else if (gameMode === "tower") {
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
    setGameMode("idle"); setRaidActive(true); setRaidWave(1); setDragonBalls(0); setCombatDeck([]); setComboCount(0);
    setBattle({ name: "Garde d'Élite (Vague 1)", emoji: "🛡️", elem: "STR", hp: 10000, maxHp: 10000, beli: 1000, xp: 500, gems: 5, isBoss: false });
    setMainTab("combat");
  };

  const { getEquipped, getDmgMult, getDmg, dps, executeCard, synMult, activeSyns } = useCombatEngine(player, battle, setCombatState, dragonBalls, setDragonBalls, setCombatDeck, setShake, setHitstop, playClick, spawnText);
  const { performSummon, handleAutoSell } = useGacha(player, setPlayer, setAutoSummonConfig, setCinematicSummon, setSummonResult, playClick, addToast);
  const { forgeItem, fusePets, handleRebirth, buyRebirthUpgrade, trainStat, buyIncrementalUpgrade, buyHakiTalent, buyShip, enterRaid } = useIncremental(player, setPlayer, setBattle, setAutoClick, setLevelUpFlash, addToast, playClick);


  // Bounty System
  useEffect(() => {
    const bountyInterval = setInterval(() => {
      if (!activeBounty && Math.random() < 0.2) { // 20% chance every minute to spawn a bounty
        const bountyBosses = [
          { name: "Katakuri", emoji: "🍩", elem: "STR", hpMult: 100, drops: [{id: "f_mera", chance: 0.1}] },
          { name: "King", emoji: "🦅", elem: "PHY", hpMult: 150, drops: [{id: "w_shusui", chance: 0.1}] },
          { name: "Big Mom", emoji: "🍰", elem: "INT", hpMult: 300, drops: [{id: "r_poneglyph", chance: 0.05}] }
        ];
        const boss = bountyBosses[Math.floor(Math.random() * bountyBosses.length)];
        const hp = player.power * boss.hpMult;
        setActiveBounty({
          ...boss, hp, maxHp: hp, beli: 50000 * player.level.current, xp: 20000 * player.level.current,
          gems: 100, isBoss: true, expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes to fight
        });
        addToast("🚨 AVIS DE RECHERCHE: " + boss.name + " est apparu !", "#ef4444");
      }
    }, 60000);
    return () => clearInterval(bountyInterval);
  }, [activeBounty, player.power, player.level.current]);

  useEffect(() => {
    if (activeBounty && Date.now() > activeBounty.expiresAt) {
       setActiveBounty(null);
       addToast("La prime a expiré...", "#9ca3af");
    }
  }, [activeBounty, mainTab]);


  useEffect(() => {
    if (player.expeditions) {
      let rewards = { beli: 0, gems: 0, count: 0 };
      let updatedExp = [...player.expeditions];
      const now = Date.now();

      updatedExp.forEach((exp, i) => {
        if (exp && now >= exp.endTime) {
           rewards.count++;
           rewards.beli += exp.rewards.beli;
           rewards.gems += exp.rewards.gems;
           updatedExp[i] = null;
        }
      });

      if (rewards.count > 0) {
        setPlayer(p => ({ ...p, beli: p.beli + rewards.beli, gems: p.gems + rewards.gems, expeditions: updatedExp }));
        addToast(`${rewards.count} Expéditions terminées ! +${Format.num(rewards.beli)} ฿, +${rewards.gems} 💎`, "#22c55e");
      }
    }
  }, [player.expeditions]);

  // --- RENDER CINEMATICS & LOADING ---
  if (cinematicSummon.active && cinematicSummon.item) {
    const item = cinematicSummon.item;
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <style>{`
          .cine-bg { position: absolute; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent, ${RARITY[item.rarity].color}, transparent); animation: rotateCine 4s linear infinite; opacity: 0.5; }
          .cine-flash { position: absolute; inset: 0; background: #fff; animation: flashCine 4s ease-out forwards; pointer-events: none; }
          .cine-item { font-size: 150px; animation: popItem 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; filter: drop-shadow(0 0 50px ${RARITY[item.rarity].color}); z-index: 10; }
          .cine-text { font-size: 40px; font-weight: 900; color: #fff; text-shadow: 0 0 20px ${RARITY[item.rarity].color}; margin-top: 20px; animation: slideUp 1s ease-out forwards; z-index: 10; }
          @keyframes rotateCine { 100% { transform: rotate(360deg); } }
          @keyframes flashCine { 0%, 10% { opacity: 1; } 100% { opacity: 0; } }
          @keyframes popItem { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes slideUp { 0% { transform: translateY(50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

        /* V24 PET AURAS */
        .pet-aura-2 { box-shadow: 0 0 10px rgba(34,197,94,0.5); animation: petPulse 2s infinite; }
        .pet-aura-3 { box-shadow: 0 0 15px rgba(59,130,246,0.8), inset 0 0 5px rgba(59,130,246,0.5); border: 1px solid #3b82f6 !important; }
        .pet-aura-4 { box-shadow: 0 0 20px rgba(0,0,0,0.9), inset 0 0 10px rgba(239,68,68,0.5); border: 2px solid #000 !important; animation: hakiPulse 1.5s infinite alternate; }
        .pet-aura-5 { box-shadow: 0 0 30px rgba(244,114,182,0.8); border: 2px solid transparent !important; background: linear-gradient(#18181b, #18181b) padding-box, linear-gradient(45deg, #f472b6, #38bdf8, #f472b6) border-box; animation: shatterEX 1s infinite alternate, divineFloat 2s infinite alternate; }

        @keyframes petPulse { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 15px rgba(34,197,94,0.7); } }
        @keyframes hakiPulse { 0% { box-shadow: 0 0 10px rgba(0,0,0,0.9); } 100% { box-shadow: 0 0 25px rgba(239,68,68,0.8); } }
      `}</style>
        <div className="cine-bg"></div><div className="cine-flash"></div>
        <div className="cine-item">{item.img}</div><div className="cine-text">{item.name.toUpperCase()}</div>
      </div>
    );
  }



  if (isLoading) {
    return (
      <div className={`${isFadingOut ? 'fade-out' : ''}`} style={{ background: "#050505", height: "100dvh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#f8fafc" }}>
        <style>{`
          .intro-logo { font-size: 80px; animation: popLogo 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          .intro-title { font-size: 32px; font-weight: 900; text-align: center; margin-top: -10px; opacity: 0; animation: fadeText 1s 0.5s ease-out forwards; background: linear-gradient(180deg, #fff, #9ca3af); -webkit-background-clip: text; color: transparent; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
          .intro-loader-bar { height: 100%; width: 0%; background: #38bdf8; animation: loadBar 3s ease-in-out forwards; box-shadow: 0 0 10px #38bdf8; }
          @keyframes popLogo { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes fadeText { to { opacity: 1; } }
          @keyframes loadBar { 0% { width: 0%; } 20% { width: 30%; } 80% { width: 80%; } 100% { width: 100%; } }
        `}</style>
        <div className="intro-logo">🏴‍☠️</div><div className="intro-title">GRAND PIECE<br/>LEGENDS</div>
        <div style={{ fontSize: "14px", color: "#a1a1aa", marginTop: "10px", letterSpacing: "2px" }}>{introText}</div>
        <div style={{ width: "150px", height: "4px", background: "#27272a", borderRadius: "2px", marginTop: "30px", overflow: "hidden" }}><div className="intro-loader-bar"></div></div>
      </div>
    );
  }

  return (
    <div className={`theme-${player.settings?.theme || 'pirate'}`} style={{ background: gameMode === "tower" ? "#1e1b4b" : gameMode === "pvp" ? "#450a0a" : "var(--bg-primary)", height: "100dvh", width: "100vw", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden", transition: "background 0.5s" }}>
      {levelUpFlash && <div style={{ position: "absolute", inset: 0, background: "rgba(255, 255, 255, 0.4)", zIndex: 999, pointerEvents: "none", animation: "flashAnim 0.5s ease-out" }} />}
      
      {showUltAnim.active && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "ultimateReveal 2s forwards" }}>
          <div style={{ fontSize: "150px", filter: "drop-shadow(0 0 30px #ef4444)" }}>{showUltAnim.char}</div>
          <h1 className="rainbow-text" style={{fontSize:"60px", margin:0, fontStyle: "italic"}}>{showUltAnim.text}</h1>
        </div>
      )}

      {showDailyModal && (
        <div className="modal-overlay ios-tap" onClick={() => setShowDailyModal(false)} style={{ zIndex: 1100 }}>
          <div className="rbx-panel fade-in" style={{ width: "90%", maxWidth: "300px", border: "2px solid #eab308", textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "60px", animation: "divineFloat 2s infinite alternate" }}>🎁</div>
            <h2 style={{ color: "#eab308", margin: "10px 0" }}>BONUS QUOTIDIEN</h2>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#38bdf8", margin: "10px 0" }}>+{Format.num(dailyRewardAmount.gems)} 💎</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fbbf24", margin: "10px 0" }}>+{Format.num(dailyRewardAmount.beli)} ฿</div>
            <button onClick={() => setShowDailyModal(false)} className="rbx-btn rbx-btn-gold" style={{ width: "100%", marginTop: "15px" }}>SUPER !</button>
          </div>
        </div>
      )}

      {/* TOASTS SYSTEM */}
      <div style={{ position: "absolute", top: "var(--safe-area-top)", left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", flexDirection: "column", gap: "10px", pointerEvents: "none", width: "90%", maxWidth: "400px" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: "rgba(24,24,27,0.95)", border: `1px solid ${t.color}`, padding: "10px 15px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.5)", animation: "toastSlide 0.3s ease-out", display: "flex", justifyContent: "center" }}>{t.msg}</div>
        ))}
      </div>

      <style>{`
        * { box-sizing: border-box; user-select: none; touch-action: manipulation; }
        ::-webkit-scrollbar { display: none; }
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .fade-out { animation: fadeOut 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes flashAnim { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ultimateReveal { 0% { opacity: 0; transform: scale(0.8); } 20% { opacity: 1; transform: scale(1.2); } 80% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0; transform: scale(2); } }
        @keyframes toastSlide { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .common-shine { border: 1px solid #9ca3af; }
        .uncommon-shine { border: 1px solid #22c55e; box-shadow: 0 0 5px rgba(34,197,94,0.3); }
        .rare-shine { border: 1px solid #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.5); animation: rarePulse 2s infinite; }
        .epic-pulse { border: 2px solid #a855f7 !important; box-shadow: 0 0 15px rgba(168,85,247,0.6); animation: epicPulse 1.5s infinite; }
        .legendary-shine { position: relative; overflow: hidden; border: 2px solid #eab308 !important; box-shadow: 0 0 25px rgba(234,179,8,0.6); }
        .mythic-glow { border: 2px solid transparent !important; background: linear-gradient(#18181b, #18181b) padding-box, linear-gradient(45deg, #ef4444, #f97316, #ef4444) border-box; box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); animation: pulseRed 1.5s infinite alternate; }
        .divine-aura { border: 2px solid transparent !important; background: linear-gradient(#18181b, #18181b) padding-box, linear-gradient(45deg, #06b6d4, #3b82f6, #06b6d4) border-box; box-shadow: 0 0 30px rgba(6,182,212,0.8); animation: divineFloat 1s infinite alternate; }
        .ex-shatter { border: 2px solid transparent !important; background: linear-gradient(#000, #000) padding-box, linear-gradient(90deg, #f472b6, #38bdf8, #f472b6) border-box; box-shadow: 0 0 40px rgba(244, 114, 182, 0.8); animation: shatterEX 1s infinite alternate; z-index: 50;}
        
        @keyframes rarePulse { 0%, 100% { box-shadow: 0 0 5px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 15px rgba(59,130,246,0.6); } }
        @keyframes epicPulse { 0%, 100% { box-shadow: 0 0 10px rgba(168,85,247,0.4); } 50% { box-shadow: 0 0 25px rgba(168,85,247,0.8); } }
        @keyframes pulseRed { 0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); } 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.8); } }
        @keyframes divineFloat { 0% { transform: translateY(0px); box-shadow: 0 0 20px rgba(6,182,212,0.5); } 100% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(6,182,212,1); } }
        @keyframes shatterEX { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }

        /* V24 PET AURAS */
        .pet-star-2 { box-shadow: 0 0 10px rgba(255,255,255,0.3); animation: rarePulse 2s infinite; }
        .pet-star-3 { border: 2px solid #38bdf8 !important; box-shadow: 0 0 15px rgba(56, 189, 248, 0.6); }
        .pet-star-4 { border: 2px solid #ef4444 !important; box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); animation: pulseRed 1.5s infinite alternate; }
        .pet-star-5 { border: 2px solid #eab308 !important; box-shadow: 0 0 30px rgba(234, 179, 8, 1); transform: translateY(-5px); animation: divineFloat 1.5s infinite alternate; }

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
        
        .frame-default { border: 2px solid #3b82f6; }
        .frame-gold { border: 3px solid #eab308; box-shadow: 0 0 15px rgba(234, 179, 8, 0.5); }
        .frame-neon { border: 3px solid #a855f7; box-shadow: 0 0 20px #a855f7, inset 0 0 10px #a855f7; }
        .frame-flame { border: 3px solid #ef4444; box-shadow: 0 0 20px #ef4444; animation: pulseRed 1s infinite alternate; }

        /* V24 DBL COMBAT CARDS */
        .dbl-card { width: 60px; height: 90px; border-radius: 8px; border: 2px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 4px; color: #fff; font-weight: bold; position: relative; overflow: hidden; animation: popCard 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .dbl-card:active { transform: scale(0.95); filter: brightness(0.8); }
        .dbl-card-icon { font-size: 24px; z-index: 2; }
        .dbl-card-cost { position: absolute; top: 2px; left: 4px; font-size: 10px; background: rgba(0,0,0,0.6); padding: 2px 4px; border-radius: 4px; z-index: 2; }
        .dbl-card-db { position: absolute; top: 2px; right: 2px; font-size: 14px; filter: drop-shadow(0 0 5px #eab308); z-index: 3; animation: floatDB 2s infinite alternate; }
        @keyframes popCard { 0% { transform: translateY(20px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes floatDB { 0% { transform: translateY(0); } 100% { transform: translateY(-3px); } }
        
        .vanish-gauge { width: 10px; height: 100px; background: rgba(0,0,0,0.5); border-radius: 5px; border: 1px solid #555; overflow: hidden; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); }
        .vanish-fill { width: 100%; background: #3b82f6; transition: height 0.2s, background 0.2s; }
        .vanish-ready { background: #fff !important; box-shadow: 0 0 10px #fff; }
        .enemy-attack-warn { position: absolute; top: 10px; right: 25px; font-size: 40px; color: #ef4444; font-weight: 900; filter: drop-shadow(0 0 10px #ef4444); animation: flashWarn 0.2s infinite alternate; }
        @keyframes flashWarn { 0% { opacity: 0.2; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1.2); } }

        .intro-logo { font-size: 80px; animation: popLogo 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .intro-title { font-size: 32px; font-weight: 900; text-align: center; margin-top: -10px; opacity: 0; animation: fadeText 1s 0.5s ease-out forwards; background: linear-gradient(180deg, #fff, #9ca3af); -webkit-background-clip: text; color: transparent; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .intro-loader-bar { height: 100%; width: 0%; background: #38bdf8; animation: loadBar 3s ease-in-out forwards; box-shadow: 0 0 10px #38bdf8; }
        @keyframes popLogo { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeText { to { opacity: 1; } }
        @keyframes loadBar { 0% { width: 0%; } 20% { width: 30%; } 80% { width: 80%; } 100% { width: 100%; } }

        /* V24 PET AURAS */
        .pet-aura-2 { box-shadow: 0 0 10px rgba(34,197,94,0.5); animation: petPulse 2s infinite; }
        .pet-aura-3 { box-shadow: 0 0 15px rgba(59,130,246,0.8), inset 0 0 5px rgba(59,130,246,0.5); border: 1px solid #3b82f6 !important; }
        .pet-aura-4 { box-shadow: 0 0 20px rgba(0,0,0,0.9), inset 0 0 10px rgba(239,68,68,0.5); border: 2px solid #000 !important; animation: hakiPulse 1.5s infinite alternate; }
        .pet-aura-5 { box-shadow: 0 0 30px rgba(244,114,182,0.8); border: 2px solid transparent !important; background: linear-gradient(#18181b, #18181b) padding-box, linear-gradient(45deg, #f472b6, #38bdf8, #f472b6) border-box; animation: shatterEX 1s infinite alternate, divineFloat 2s infinite alternate; }
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
                </div>
              </div>
            )}

            {profileTab === "edit" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Nom d'Équipage</span>
                  <input type="text" value={player.profile.username} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, username: e.target.value}}))} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "5px" }} maxLength={15} />
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
                      <option value="default">Défaut</option><option value="gold">Or</option><option value="neon">Néon</option><option value="flame">Flammes</option>
                    </select>
                  </div>
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
      <div style={{ background: "var(--bg-secondary)", paddingTop: "calc(var(--safe-area-top) + 20px)", paddingBottom: "10px", paddingLeft: "15px", paddingRight: "15px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--border-color)", zIndex: 50 }}>
        <div>
          <div onClick={() => { playClick(); setShowProfile(true); }} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", border: "1px solid #333" }}>
            <div className={`frame-${player.profile.frame}`} style={{ fontSize: "20px", background: "#000", borderRadius: "50%", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center" }}>{player.profile.avatar}</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "900", color: getTitle(player.bounty).color }}>{player.profile.titleEquipped}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                <span style={{ fontSize: "10px", fontWeight: "bold", color: "#f8fafc" }}>Niv. {player.level.current}</span>
                <div style={{ width: "60px", height: "6px", background: "#27272a", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${(player.level.xp / player.level.max) * 100}%`, background: "#38bdf8", height: "100%" }} />
                </div>
              </div>
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
        <CombatView
            mainTab={mainTab} player={player} battle={battle} setBattle={setBattle} combatState={combatState} dps={dps} getDmg={getDmg} getDmgMult={getDmgMult} activeSyns={activeSyns}
            gameMode={gameMode} setGameMode={setGameMode} playClick={playClick} dragonBalls={dragonBalls} hitstop={hitstop} shake={shake} showUltAnim={showUltAnim}
            combatDeck={combatDeck} setCombatDeck={setCombatDeck} executeCard={executeCard} executeVanish={executeVanish} executeRisingRush={executeRisingRush}
            raidWave={raidWave} raidActive={raidActive} floatingTexts={floatingTexts} autoClick={autoClick} setAutoClick={setAutoClick} changeSea={changeSea}
        />
        <TrainView
            mainTab={mainTab} player={player} playClick={playClick} trainTab={trainTab} setTrainTab={setTrainTab}
            trainStat={trainStat} buyIncrementalUpgrade={buyIncrementalUpgrade} buyHakiTalent={buyHakiTalent} buyRebirthUpgrade={buyRebirthUpgrade} handleRebirth={handleRebirth}
        />
        <SummonView
            mainTab={mainTab} player={player} playClick={playClick} banner={banner} setBanner={setBanner}
            performSummon={performSummon} autoSummonConfig={autoSummonConfig} setAutoSummonConfig={setAutoSummonConfig} cinematicSummon={cinematicSummon} summonResult={summonResult} setSummonResult={setSummonResult}
        />
        <RosterView
            mainTab={mainTab} player={player} playClick={playClick} rosterTab={rosterTab} setRosterTab={setRosterTab}
            crewSelectSlot={crewSelectSlot} setCrewSelectSlot={setCrewSelectSlot} setPlayer={setPlayer} fusePets={fusePets} petSelectSlot={petSelectSlot} setPetSelectSlot={setPetSelectSlot}
        />
        <InventoryView
            mainTab={mainTab} player={player} playClick={playClick} sellCommons={sellCommons} setPlayer={setPlayer} getEquipped={getEquipped} awakenItem={awakenItem} autoEquip={autoEquip} forgeItem={forgeItem}
        />
        <HubView
            mainTab={mainTab} player={player} playClick={playClick} hubTab={hubTab} setHubTab={setHubTab}
            claimDaily={claimDaily} enterRaid={enterRaid} changeSea={changeSea} marketPrices={marketPrices}
            autoSummonConfig={autoSummonConfig} setAutoSummonConfig={setAutoSummonConfig} setPlayer={setPlayer} buyShip={buyShip} legalMacro={legalMacro} setLegalMacro={setLegalMacro}
            startRaid={startRaid} tradeMarketFruit={tradeMarketFruit} redeemCode={redeemCode} promoCode={promoCode} setPromoCode={setPromoCode} activeBounty={activeBounty} setBattle={setBattle} setGameMode={setGameMode} setMainTab={setMainTab} addToast={addToast}
        />
      </div>

      {/* --- BOTTOM NAVIGATION BAR V24 --- */}
      <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", padding: "10px 10px calc(var(--safe-area-bottom) + 15px)", zIndex: 100 }}>
        {[ { id: "combat", icon: "⚔️", label: "COMBAT" }, { id: "train", icon: "💪", label: "TRAIN" }, { id: "summon", icon: "✨", label: "GACHA" }, { id: "roster", icon: "⚓", label: "ÉQUIPE" }, { id: "inventory", icon: "🎒", label: "SAC" }, { id: "hub", icon: "🧭", label: "MENU" } ].map(t => {
          const isHubReady = t.id === "hub" && (currentTime - player.lastDaily > 24 * 60 * 60 * 1000);
          return (
          <div key={t.id} onClick={() => { playClick(); setMainTab(t.id); }} className="ios-tap" style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "4px 0", opacity: mainTab === t.id ? 1 : 0.4, transition: "0.2s" }}>
            {isHubReady && <div style={{ position: "absolute", top: 2, right: 10, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 5px #ef4444" }} />}
            {t.id === "train" && (player.beli >= 10000 * Math.pow(2.5, player.upgrades.dmg || 0)) && <div style={{ position: "absolute", top: 2, right: 10, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 5px #ef4444" }} />}
            <span style={{ fontSize: "20px", filter: mainTab === t.id ? "drop-shadow(0 0 8px rgba(56,189,248,0.8))" : "none" }}>{t.icon}</span><span style={{ fontSize: "8px", fontWeight: "900", color: mainTab === t.id ? "#38bdf8" : "#9ca3af" }}>{t.label}</span>
          </div>
        );})}
      </div>

    </div>
  );
}
