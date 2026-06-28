import { useMemo } from "react";
import { RELICS, ITEMS_DB } from "../data/items";
import { PETS_DB } from "../data/pets";
import { REBIRTH_SHOP, getElementAdvantage } from "../data/constants";
import { CREW_MEMBERS, SYNERGIES } from "../data/combat";

export function useCombatEngine(player, battle, setCombatState, dragonBalls, setDragonBalls, setCombatDeck, setShake, setHitstop, playClick, spawnText) {

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

  const { synMult, activeSyns } = useMemo(() => {
    let activeSyns = []; let synMult = 1.0;
    const allCrewIds = [...player.crewSetup.active, ...player.crewSetup.support].filter(Boolean);
    const allCrewData = allCrewIds.map(id => CREW_MEMBERS.find(m => m.id === id)).filter(Boolean);
    const allTags = allCrewData.flatMap(c => c.tags || []);

    SYNERGIES.forEach(syn => {
      let isMet = false;
      if (syn.req) { isMet = syn.req.every(reqId => allCrewIds.includes(reqId)); }
      else if (syn.tag && syn.count) { if (allTags.filter(t => t === syn.tag).length >= syn.count) isMet = true; }
      if (isMet) { synMult *= syn.mult; activeSyns.push({ name: syn.name, mult: syn.mult }); }
    });
    return { synMult, activeSyns };
  }, [player.crewSetup]);

  const getDmgMult = () => {
    let bountyBonus = 1 + (player.bounty / 100000);
    let hakiArmament = 1 + (player.hakiTree.armament * 0.15);
    let relicBonus = player.equippedRelic ? RELICS[player.equippedRelic].mult : 1;
    let incDmg = 1 + (player.upgrades.dmg * 0.1);

    // Rebirth Upgrades (V23)
    let rbDmg = 1 + ((player.rebirthUpgrades.rb_haki || 0) * REBIRTH_SHOP.rb_haki.val);

    // Pets Bonus (V23 Fusion Stars)
    let petDmg = 1.0;
    player.pets.active.forEach(pInst => {
      if(!pInst) return;
      const petItem = player.pets.inventory.find(i=>i.instanceId===pInst);
      if(petItem) {
        const pDb = PETS_DB[petItem.itemId];
        const starsMult = 1 + ((petItem.stars || 1) - 1) * 0.5; // +50% efficacité par étoile
        if(pDb && (pDb.bonusType === 'dmg' || pDb.bonusType === 'all')) petDmg *= (1 + pDb.bonusVal * starsMult);
      }
    });

    let mult = (1 + (player.stats.strength * 0.1) + (player.stats.haki * 0.5) + (player.rebirth * 5)) * bountyBonus * hakiArmament * relicBonus * incDmg * petDmg * rbDmg;

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

  const executeCard = (card, index, combatState) => {
    if (!battle || combatState.energy < card.cost) return;
    playClick();

    // Consume Card & Energy
    setCombatDeck(prev => prev.filter((_, i) => i !== index));
    if (card.hasDB && dragonBalls < 7) setDragonBalls(prev => prev + 1);

    // Effet Éveil (Green Card)
    if (card.id === "green") {
      setCombatState(prev => ({ ...prev, energy: Math.min(100, prev.energy - card.cost + 40), vanishing: 100 }));
      spawnText("ÉVEIL! ", 0, false, "#22c55e");
      return;
    }

    // Calcul Dégâts

    let dmg = getDmg() * card.mult * (1 + (combatState.comboCount * 0.1));


    let stun = card.id === "special" ? 2 : 0;

    // Contre Card Logic
    if (card.id === "counter") {
        if (combatState.enemyAttacking) {
            spawnText("CONTRE PARFAIT! ", 0, true, "#38bdf8");
            setCombatState(prev => ({ ...prev, energy: Math.max(0, prev.energy - card.cost), stunTime: 2, enemyAttacking: false }));
            return { finalDmg: 0, stun: 2 };
        } else {
            spawnText("RATÉ... ", 0, false, "#9ca3af");
            setCombatState(prev => ({ ...prev, energy: Math.max(0, prev.energy - card.cost), comboCount: 0 }));
            return { finalDmg: 0, stun: 0 };
        }
    }


    if(player.settings.shake) { setShake(true); setTimeout(() => setShake(false), card.id==="special"?300:150); }
    if(card.id==="strike") { setHitstop(true); setTimeout(() => setHitstop(false), 80); }

    let isCrit = Math.random() < 0.1 + (player.stats.luck * 0.01);
    let finalDmg = Math.floor(isCrit ? dmg * 2 : dmg);

    setCombatState(prev => ({ ...prev, energy: Math.max(0, prev.energy - card.cost), stunTime: stun > 0 ? stun : prev.stunTime }));

    spawnText(card.icon + " ", finalDmg, isCrit, card.id==="special"?"#3b82f6":card.id==="blast"?"#eab308":"#fff");

    if(card.id === "strike" || card.id === "blast") {
        setCombatState(prev => ({ ...prev, comboCount: prev.comboCount + 1 }));
    }


    // L'application des dégats est asynchrone pour l'effet visuel
    return { finalDmg, stun }; // Returns damage to be processed by the main loop
  };

  return { getEquipped, getDmgMult, getDmg, executeCard, synMult, activeSyns };
}
