import { RARITY, REBIRTH_SHOP } from "../data/constants";
import { ITEMS_DB } from "../data/items";
import { PETS_DB } from "../data/pets";
import { CREW_MEMBERS } from "../data/combat";

export function useGacha(player, setPlayer, setAutoSummonConfig, setCinematicSummon, setSummonResult, playClick, addToast) {
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

  const performSummon = (bannerType, amount, isAuto = false) => {
    if (!isAuto) playClick();
    const cost = amount === 1 ? 50 : 450;
    if (player.gems < cost) { setAutoSummonConfig(c => ({...c, active: false})); if(!isAuto) addToast("Pas assez de gemmes !", "#ef4444"); return; }

    let pulls = []; let hasEX = false; let maxRarityVal = 0; let bestItemForCine = null;
    let newLegPity = player.pity.legendary + amount;
    let newMythicPity = player.pity.mythic + amount;
    let newEXPity = player.pity.ex + amount;

    const isCrew = bannerType === "Crew";
    const isPet = bannerType === "Pet";
    const poolData = isCrew ? CREW_MEMBERS : isPet ? Object.values(PETS_DB) : Object.values(ITEMS_DB).filter(i => i.type === bannerType || (bannerType==='Head' && ['Head','Chest','Gloves','Boots','Accessory'].includes(i.type)));

    for(let i=0; i<amount; i++) {
      const rand = Math.random(); let rarity = "Common";
      if (newEXPity >= 800) { rarity = "EX"; newEXPity = 0; }
      else if (newMythicPity >= 400) { rarity = "Divine"; newMythicPity = 0; }
      else if (newLegPity >= 100) { rarity = "Legendary"; newLegPity = 0; }
      else {
        if(rand < (0.005 + (player.rebirthUpgrades.rb_luck || 0)*REBIRTH_SHOP.rb_luck.val)) { rarity = "EX"; hasEX = true; newEXPity = 0; }
        else if(rand < 0.02) { rarity = "Divine"; newMythicPity = 0; }
        else if(rand < 0.08) { rarity = "Mythic"; }
        else if(rand < 0.20) { rarity = "Legendary"; }
        else if(rand < 0.40) { rarity = "Epic"; }
        else if(rand < 0.70) { rarity = "Rare"; }
      }

      if((isCrew || isPet) && (rarity === "Common" || rarity === "Uncommon")) rarity = "Common";
      const available = poolData.filter(f => f.rarity === rarity || ((isCrew || isPet) && f.rarity === "Rare"));
      const chosen = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : poolData[0];

      if (RARITY[chosen?.rarity]?.val > maxRarityVal) { maxRarityVal = RARITY[chosen.rarity].val; bestItemForCine = chosen; }

      if(isCrew) pulls.push({ type: "crew", id: chosen.id });
      else if(isPet) pulls.push({ type: "pet", id: chosen.id, instanceId: Date.now() + Math.random().toString() });
      else pulls.push({ type: "item", instanceId: Date.now() + Math.random().toString(), itemId: chosen.id, awakenLvl: 0 });
    }

    setPlayer(p => {
      let newP = { ...p, gems: p.gems - cost, profile: {...p.profile, totalSummons: p.profile.totalSummons + amount}, pity: { legendary: newLegPity, mythic: newMythicPity, ex: newEXPity } };
      if (isCrew) {
        pulls.forEach(pull => {
          if(newP.crewList.includes(pull.id)) newP.memberFragments[pull.id] = (newP.memberFragments[pull.id]||0) + 5;
          else newP.crewList.push(pull.id);
        });
      } else if (isPet) {
        pulls.forEach(pull => { newP.pets.inventory.push({ instanceId: pull.instanceId, itemId: pull.id, stars: 1 }); });
      } else {
        const keptItems = handleAutoSell(pulls);
        newP.inventory = [...newP.inventory, ...keptItems];
      }
      return newP;
    });

    if (!player.settings.skipLowAnim || maxRarityVal >= RARITY.Mythic.val) {
      setCinematicSummon({ active: true, item: bestItemForCine });
      setTimeout(() => { setCinematicSummon({ active: false, item: null }); setSummonResult(pulls); }, hasEX ? 5000 : 3000);
    } else {
      setSummonResult(pulls);
    }
  };

  return { performSummon, handleAutoSell };
}
