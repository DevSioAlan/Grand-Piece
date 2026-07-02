
import { useState, useEffect } from 'react';
import { Format, SAVE_KEY } from '../data/constants';
import { SHIPS, RELICS, ITEMS_DB } from '../data/items';
import { BGM_TRACKS } from '../data/combat';

export function HubView({
    mainTab, player, playClick, hubTab, setHubTab, claimDaily, marketPrices, setPlayer, buyShip, startRaid, tradeMarketFruit, redeemCode, promoCode, setPromoCode, activeBounty, setBattle, setGameMode, setMainTab, addToast
}) {
    const [currentTime, setCurrentTime] = useState(() => Date.now());
    const [rouletteSpinning, setRouletteSpinning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const playRoulette = () => {
      if (player.beli < 500) { addToast("Fonds insuffisants", "#ef4444"); return; }
      playClick();
      setPlayer(p => ({ ...p, beli: p.beli - 500 }));
      setRouletteSpinning(true);

      setTimeout(() => {
        setRouletteSpinning(false);
        const rand = Math.random();
        if (rand < 0.50) {
          setPlayer(p => ({ ...p, beli: p.beli + 1000 }));
          addToast("JACKPOT ! +1000 ฿", "#eab308");
        } else if (rand < 0.80) {
          const commonItems = Object.values(ITEMS_DB).filter(i => i.rarity === "Common");
          const item = commonItems[Math.floor(Math.random() * commonItems.length)];
          setPlayer(p => ({ ...p, inventory: [...p.inventory, { instanceId: Date.now() + Math.random().toString(), itemId: item.id, awakenLvl: 0 }] }));
          addToast(`Gagné : ${item.name} (Commun)`, "#9ca3af");
        } else {
          const uncommonItems = Object.values(ITEMS_DB).filter(i => i.rarity === "Uncommon");
          const item = uncommonItems.length > 0 ? uncommonItems[Math.floor(Math.random() * uncommonItems.length)] : Object.values(ITEMS_DB)[0];
          setPlayer(p => ({ ...p, inventory: [...p.inventory, { instanceId: Date.now() + Math.random().toString(), itemId: item.id, awakenLvl: 0 }] }));
          addToast(`Gagné : ${item.name} (Peu Commun)`, "#22c55e");
        }
      }, 1500);
    };

    if (mainTab !== "hub") return null;
    return (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "5px" }}>
              {["menu", "market", "expeditions", "ships", "relics", "minigame", "options"].map(st => (
                <button key={st} onClick={() => { playClick(); setHubTab(st); }} className={`rbx-btn ${hubTab === st ? 'rbx-btn-blue' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "10px" }}>{st === "options" ? "⚙️ SETTINGS" : st.toUpperCase()}</button>
              ))}
            </div>


            {hubTab === "menu" && activeBounty && (
              <div className="rbx-panel fade-in" style={{ border: "2px solid #ef4444", background: "linear-gradient(180deg, #450a0a, var(--bg-secondary))", padding: "15px", borderRadius: "12px", textAlign: "center", marginBottom: "15px", position: "relative" }}>
                <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#ef4444", padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "900" }}>WANTED</span>
                <div style={{ fontSize: "50px" }}>{activeBounty.emoji}</div>
                <h4 style={{ margin: "5px 0", color: "#fff", fontSize: "20px" }}>{activeBounty.name}</h4>
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "12px" }}>{Format.num(activeBounty.beli)} ฿</span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "12px" }}>{activeBounty.gems} 💎</span>
                </div>
                <button onClick={() => { playClick(); setGameMode("idle"); setBattle({...activeBounty}); setMainTab("combat"); }} className="rbx-btn rbx-btn-orange" style={{ width: "100%", animation: "pulseRed 1.5s infinite" }}>AFFRONTER LA PRIME</button>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "5px" }}>Expire dans: {Math.ceil((activeBounty.expiresAt - currentTime) / 60000)} min</div>
              </div>
            )}

            {hubTab === "menu" && (
              <div className="rbx-panel fade-in">
                <button onClick={claimDaily} className="rbx-btn rbx-btn-gold ios-tap" style={{ width: "100%", marginBottom: "15px" }}>🎁 RÉCOMPENSE QUOTIDIENNE</button>
                <div style={{ border: "1px solid #ef4444", background: "linear-gradient(180deg, #1e1b4b, #450a0a)", padding: "15px", borderRadius: "12px", textAlign: "center" }}>
                  <h4 style={{ margin: 0, color: "#ef4444" }}>🚨 EGGHEAD LAB RAID</h4>
                  <p style={{ fontSize: "12px", color: "#cbd5e1" }}>Boss: Saturn | Requis: Niv. 100</p>
                  <button onClick={() => { playClick(); startRaid(); }} className="rbx-btn rbx-btn-green" style={{ width: "100%" }}>ENTRER DANS LE RAID</button>
                </div>
              </div>
            )}

            {hubTab === "market" && (
              <div className="rbx-panel fade-in">
                <h4>📈 Bourse & Marché Noir</h4>
                {Object.keys(marketPrices).map(id => (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", marginBottom: "8px" }}>
                    <span>{ITEMS_DB[id].img} {ITEMS_DB[id].name} ({marketPrices[id]} ฿)</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => tradeMarketFruit(id, "BUY")} className="rbx-btn rbx-btn-green" style={{ padding: "4px 8px", fontSize: "10px" }}>ACH</button>
                      <button onClick={() => tradeMarketFruit(id, "SELL")} className="rbx-btn" style={{ padding: "4px 8px", fontSize: "10px", background: "#374151" }}>VEN</button>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {hubTab === "expeditions" && (
              <div className="rbx-panel fade-in">
                <h4 style={{ margin: "0 0 15px", color: "#3b82f6" }}>🌍 Expéditions AFK</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[0, 1, 2].map(slotIdx => {
                    const exp = player.expeditions && player.expeditions[slotIdx];
                    if (exp) {
                       const timeLeft = Math.max(0, exp.endTime - currentTime);
                       return (
                         <div key={slotIdx} style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", border: "1px solid #334155" }}>
                           <span style={{ fontSize: "14px" }}>Expédition en cours...</span>
                           <div style={{ fontSize: "10px", color: "#38bdf8", marginTop: "5px" }}>Temps restant: {Math.ceil(timeLeft / 60000)} min</div>
                         </div>
                       );
                    } else {
                       return (
                         <div key={slotIdx} style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", border: "1px dashed #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <span style={{ fontSize: "12px", color: "#9ca3af" }}>Slot Libre</span>
                           <div style={{ display: "flex", gap: "5px" }}>
                             <button onClick={() => { playClick(); setPlayer(p => { let nExp = [...(p.expeditions||[null,null,null])]; nExp[slotIdx] = { endTime: currentTime + 2*3600000, rewards: { beli: 50000 * p.level.current, gems: 10 } }; return {...p, expeditions: nExp}; }); }} className="rbx-btn rbx-btn-blue" style={{ fontSize: "10px", padding: "4px 8px" }}>2H (~{Format.num(50000 * player.level.current)} ฿, 10 💎)</button>
                             <button onClick={() => { playClick(); setPlayer(p => { let nExp = [...(p.expeditions||[null,null,null])]; nExp[slotIdx] = { endTime: currentTime + 8*3600000, rewards: { beli: 250000 * p.level.current, gems: 50 } }; return {...p, expeditions: nExp}; }); }} className="rbx-btn rbx-btn-purple" style={{ fontSize: "10px", padding: "4px 8px" }}>8H (~{Format.num(250000 * player.level.current)} ฿, 50 💎)</button>
                           </div>
                         </div>
                       );
                    }
                  })}
                </div>
              </div>
            )}

            {hubTab === "ships" && (
              <div className="rbx-panel fade-in">
                <h4>⚓ Chantier Naval</h4>
                {Object.keys(SHIPS).map(id => (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", marginBottom: "8px" }}>
                    <div>
                      <span>{SHIPS[id].img} {SHIPS[id].name}</span>
                      <div style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "2px" }}>{SHIPS[id].desc}</div>
                    </div>
                    {player.shipId === id ? <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: "bold" }}>ACTIF</span> : <button onClick={() => buyShip(id, SHIPS[id].cost)} disabled={player.beli < SHIPS[id].cost} className="rbx-btn rbx-btn-gold" style={{ padding: "6px 12px", fontSize: "11px" }}>{Format.num(SHIPS[id].cost)} ฿</button>}
                  </div>
                ))}
              </div>
            )}

            {hubTab === "relics" && (
              <div className="rbx-panel fade-in">
                <h4 style={{ color: "#ef4444" }}>💀 Reliques Maudites</h4>
                {Object.keys(RELICS).map(id => {
                  const r = RELICS[id]; const isOwned = player.unlockedRelics.includes(id); const isEq = player.equippedRelic === id;
                  return (
                    <div key={id} style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: isEq ? "2px solid #ef4444" : "1px solid #334155" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ef4444" }}>{r.img} {r.name}</span>
                        {isOwned ? <button onClick={() => { playClick(); setPlayer(p => ({...p, equippedRelic: isEq ? null : id})); }} className={`rbx-btn ${isEq ? 'rbx-btn-blue' : ''}`} style={{ padding: "4px 8px", fontSize: "10px" }}>{isEq ? "DÉSÉQUIPER" : "ÉQUIPER"}</button> : <button onClick={() => { playClick(); if(player.beli >= r.cost) { setPlayer(p => ({...p, beli: p.beli - r.cost, unlockedRelics: [...p.unlockedRelics, id]})); addToast("Relique achetée !", "#eab308"); } else addToast("Fonds insuffisants", "#ef4444"); }} className="rbx-btn rbx-btn-gold" style={{ padding: "4px 8px", fontSize: "10px" }}>{Format.num(r.cost)} ฿</button>}
                      </div>
                      <div style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "5px" }}>{r.desc}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {hubTab === "minigame" && (
              <div className="rbx-panel fade-in" style={{ textAlign: "center" }}>
                <h4 style={{ color: "#eab308", margin: "0 0 15px", fontSize: "18px", textTransform: "uppercase" }}>🎰 ROULETTE PIRATE</h4>
                <div style={{ fontSize: "60px", marginBottom: "15px", filter: rouletteSpinning ? "blur(4px)" : "none", transition: "0.2s" }}>
                  {rouletteSpinning ? "🌪️" : "🎁"}
                </div>
                <p style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "15px" }}>Gagnez des Beli ou de l'équipement (Commun/Peu Commun) !</p>
                <button onClick={playRoulette} disabled={rouletteSpinning} className="rbx-btn rbx-btn-gold" style={{ width: "100%" }}>
                  {rouletteSpinning ? "En cours..." : "LANCER (500 ฿)"}
                </button>
              </div>
            )}

            {hubTab === "options" && (
              <div className="rbx-panel fade-in">
                <h2 style={{ color: "#fff", margin: "0 0 20px", fontSize: "20px", fontWeight: "900" }}>⚙️ RÉGLAGES</h2>
                <div style={{ marginBottom: "15px" }}>
                  <span style={{ fontSize: "13px", color: "#38bdf8", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Code Promo</span>
                  <div style={{ display: "flex", gap: "10px" }}><input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} style={{ flex: 1, background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "#fff", padding: "10px", borderRadius: "8px", outline: "none", fontSize: "12px" }} placeholder="ex: NEWERA_V21" /><button onClick={redeemCode} className="rbx-btn rbx-btn-gold" style={{ padding: "10px 15px", fontSize: "11px" }}>VALIDER</button></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>Thème de l'Application</span>
                  <select value={player.settings.theme || 'pirate'} onChange={(e) => setPlayer(p => ({...p, settings: {...p.settings, theme: e.target.value}}))} style={{ background: "var(--bg-primary)", color: "#fff", border: "1px solid #334155", padding: "8px", borderRadius: "6px", fontSize: "12px" }}>
                    <option value="pirate">Pirate (Sombre)</option>
                    <option value="marine">Marine (Clair)</option>
                    <option value="night">Nuit (Bleu Nuit)</option>
                  </select>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>Sons (SFX)</span>
                  <button onClick={() => setPlayer(p => ({...p, settings: {...p.settings, sound: !p.settings.sound}}))} className="rbx-btn" style={{ padding: "6px 12px", background: player.settings.sound ? "#22c55e" : "#3f3f46", border: "none", fontSize: "12px" }}>{player.settings.sound ? "ON" : "OFF"}</button>
                </div>
                <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}><span style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>Musique (BGM)</span><button onClick={() => setPlayer(p => ({...p, settings: {...p.settings, music: !p.settings.music}}))} className="rbx-btn" style={{ padding: "6px 12px", background: player.settings.music ? "#22c55e" : "#3f3f46", border: "none", fontSize: "12px" }}>{player.settings.music ? "ON" : "OFF"}</button></div>
                  {player.settings.music && (<div className="fade-in"><select value={player.settings.bgmTrack || 0} onChange={(e) => setPlayer(p => ({...p, settings: {...p.settings, bgmTrack: parseInt(e.target.value)}}))} style={{ width: "100%", background: "var(--bg-primary)", color: "#fff", border: "1px solid #334155", padding: "8px", borderRadius: "6px", fontSize: "12px", marginBottom: "10px" }}>{BGM_TRACKS.map((t, idx) => <option key={t.id} value={idx}>{t.name}</option>)}</select><input type="range" min="0" max="1" step="0.05" value={player.settings.bgmVolume || 0.4} onChange={(e) => setPlayer(p => ({...p, settings: {...p.settings, bgmVolume: parseFloat(e.target.value)}}))} style={{ width: "100%" }} /></div>)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", marginBottom: "8px", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>Shake Screen (Séismes)</span>
                  <button onClick={() => setPlayer(p => ({...p, settings: {...p.settings, shake: !p.settings.shake}}))} className="rbx-btn" style={{ padding: "6px 12px", background: player.settings.shake ? "#3b82f6" : "#3f3f46", border: "none", fontSize: "12px" }}>{player.settings.shake ? "ON" : "OFF"}</button>
                </div>
                <button onClick={() => { if (window.confirm("Voulez-vous vraiment TOUT effacer ?")) { localStorage.removeItem(SAVE_KEY); window.location.reload(); } }} className="rbx-btn ios-tap" style={{ width: "100%", background: "#7f1d1d", borderColor: "#450a0a", fontSize: "12px", marginTop: "20px" }}>⚠️ EFFACER MA SAUVEGARDE</button>
              </div>
            )}
          </div>





    );
}
