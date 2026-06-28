import { REBIRTH_SHOP } from "../data/constants";

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

  return { handleRebirth, buyRebirthUpgrade, trainStat, buyIncrementalUpgrade, buyHakiTalent, buyShip };
}
