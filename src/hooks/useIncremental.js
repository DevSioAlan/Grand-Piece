
import { REBIRTH_SHOP } from "../data/constants";
import { ITEMS_DB } from "../data/items";

export function useIncremental(player, setPlayer, setBattle, setAutoClick, setLevelUpFlash, addToast, playClick) {

  const handleRebirth = () => {
    playClick();
    const reqLvl = 50 + (player.rebirth * 50);
    if (player.level.current < reqLvl) return addToast(`Niveau ${reqLvl} requis !`, "#ef4444");
    if (window.confirm("Renaître ? Vous obtiendrez des Rebirth Coins pour la boutique d'Ascension.")) {
      const coinsGained = Math.floor(player.level.current / 50);
      setPlayer(p => ({
        ...p, rebirth: p.rebirth + 1, rebirthCoins: p.rebirthCoins + coinsGained, level: { current: 1, xp: 0, max: 100 },
        stats: { strength: 0, haki: 0, sword: 0, gun: 0, luck: 0, agility: 0 }, beli: 0, power: 20
      }));
      setBattle(null); setAutoClick(false);
      setLevelUpFlash(true); setTimeout(() => setLevelUpFlash(false), 1000);
      addToast(`🌟 REBIRTH ! +${coinsGained} Rebirth Coins obtenus.`, "#eab308");
    }
  };

  const buyRebirthUpgrade = (id) => {
    playClick();
    const upg = REBIRTH_SHOP[id];
    if(player.rebirthCoins >= upg.cost) {
      setPlayer(p => ({
        ...p, rebirthCoins: p.rebirthCoins - upg.cost,
        rebirthUpgrades: { ...p.rebirthUpgrades, [id]: (p.rebirthUpgrades[id] || 0) + 1 }
      }));
      addToast(`Ascension ${upg.name} acquise !`, "#a855f7");
    } else {
      addToast("Pas assez de Rebirth Coins.", "#ef4444");
    }
  };

  const trainStat = (statName) => {
    playClick(); const cost = 100 * Math.pow(1.5, player.stats[statName] || 0);
    if (player.beli < cost) return addToast(`Fonds insuffisants`, "#ef4444");
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

  const buyShip = (id, cost) => {
    playClick();
    if (player.beli >= cost) { setPlayer(p => ({ ...p, beli: p.beli - cost, shipId: id })); addToast("Nouveau navire !", "#38bdf8"); }
    else addToast("Fonds insuffisants.", "#ef4444");
  };

  const fusePets = (itemId, stars) => {
    playClick();
    if (stars >= 5) return addToast("Ce familier est déjà au niveau maximum (5⭐) !", "#ef4444");

    const matchingPets = player.pets.inventory.filter(p => p.itemId === itemId && (p.stars || 1) === stars && !player.pets.active.includes(p.instanceId));
    if (matchingPets.length < 5) return addToast("Il faut 5 familiers identiques (non équipés) !", "#ef4444");

    const toRemove = matchingPets.slice(0, 5).map(p => p.instanceId);
    setPlayer(p => {
      const newInv = p.pets.inventory.filter(pi => !toRemove.includes(pi.instanceId));
      newInv.push({ instanceId: Date.now() + Math.random().toString(), itemId: itemId, stars: stars + 1 });
      return { ...p, pets: { ...p.pets, inventory: newInv } };
    });
    addToast(`Fusion Réussie ! Familier ⭐${stars + 1} créé !`, "#22c55e");
  };

  const enterRaid = () => {};

  const forgeItem = (itemId) => {
    playClick();
    const itemData = ITEMS_DB[itemId];
    if (!itemData) return;

    const copies = player.inventory.filter(i => i.itemId === itemId && i.awakenLvl === 0 && !Object.values(player.equipped).includes(i.instanceId));
    if (copies.length < 3) return addToast("Il faut 3 copies (non-équipées, non-éveillées) de " + itemData.name, "#ef4444");

    const rarityLevels = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Divine", "EX"];
    const currentRarityIdx = rarityLevels.indexOf(itemData.rarity);
    if (currentRarityIdx === -1 || currentRarityIdx >= rarityLevels.length - 1) return addToast("Cet objet a atteint la rareté maximale !", "#eab308");

    const targetRarity = rarityLevels[currentRarityIdx + 1];
    const possibleTargets = Object.values(ITEMS_DB).filter(i => i.type === itemData.type && i.rarity === targetRarity);
    if (possibleTargets.length === 0) return addToast("Aucun objet supérieur disponible dans cette catégorie.", "#9ca3af");

    const targetItem = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
    const toRemove = copies.slice(0, 3).map(c => c.instanceId);

    setPlayer(p => {
       const newInv = p.inventory.filter(i => !toRemove.includes(i.instanceId));
       newInv.push({ instanceId: Date.now() + Math.random().toString(), itemId: targetItem.id, awakenLvl: 0 });
       return { ...p, inventory: newInv };
    });

    addToast("Forge Réussie: " + targetItem.name + " (" + targetRarity + ") !", "#a855f7");
  };

  return { forgeItem, fusePets, handleRebirth, buyRebirthUpgrade, trainStat, buyIncrementalUpgrade, buyHakiTalent, buyShip, enterRaid };
}
