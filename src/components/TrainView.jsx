
import React from 'react';
import { Format, REBIRTH_SHOP } from '../data/constants';

export function TrainView({
    mainTab, player, playClick, trainTab, setTrainTab,
    trainStat, buyIncrementalUpgrade, buyHakiTalent, buyRebirthUpgrade, handleRebirth
}) {
    if (mainTab !== "train") return null;

    return (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "5px" }}>
              <button onClick={() => { playClick(); setTrainTab("stats"); }} className={`rbx-btn ${trainTab==='stats'?'rbx-btn-blue':''}`} style={{flex:"0 0 auto", padding:"8px 12px", fontSize:"10px"}}>ENTRAÎNEMENT</button>
              <button onClick={() => { playClick(); setTrainTab("upgrades"); }} className={`rbx-btn ${trainTab==='upgrades'?'rbx-btn-gold':''}`} style={{flex:"0 0 auto", padding:"8px 12px", fontSize:"10px"}}>UPGRADES INC.</button>
              <button onClick={() => { playClick(); setTrainTab("rebirth"); }} className={`rbx-btn ${trainTab==='rebirth'?'rbx-btn-purple':''}`} style={{flex:"0 0 auto", padding:"8px 12px", fontSize:"10px"}}>ASCENSION</button>
            </div>

            {trainTab === "stats" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="rbx-panel">
                  <h3 style={{ marginTop: 0 }}>Statistiques</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {['strength', 'haki', 'sword', 'gun', 'luck', 'agility'].map(s => (
                      <button key={s} onClick={() => trainStat(s)} className="rbx-btn" style={{ fontSize: "11px", justifyContent: "space-between" }}>
                        <span>{s.slice(0,3).toUpperCase()}</span><span>+{player.stats[s] || 0}</span>
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
                <h3 style={{ marginTop: 0, color: "#eab308" }}>Boutique Incrémentale</h3>
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
                        <div><div style={{ fontSize: "12px", fontWeight: "bold", color: upg.color }}>{upg.name}</div><div style={{ fontSize: "10px", color: "#a1a1aa" }}>Niv. {lvl}</div></div>
                        <button onClick={() => buyIncrementalUpgrade(upg.id)} className="rbx-btn" style={{ padding: "6px 12px", fontSize: "11px", background: "#374151" }}>{Format.num(cost)} ฿</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {trainTab === "rebirth" && (
              <div className="rbx-panel fade-in" style={{ border: "2px solid #a855f7" }}>
                <h3 style={{ marginTop: 0, color: "#a855f7" }}>Ascension Divine</h3>
                <div style={{ textAlign: "center", marginBottom: "15px" }}>
                  <span style={{ fontSize: "12px", color: "#cbd5e1" }}>Rebirth Coins:</span>
                  <div style={{ fontSize: "24px", color: "#eab308", fontWeight: "bold" }}>{player.rebirthCoins} 🪙</div>
                </div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {Object.values(REBIRTH_SHOP).map(upg => {
                    const owned = player.rebirthUpgrades[upg.id] || 0;
                    return (
                      <div key={upg.id} style={{ background: "#18181b", padding: "12px", borderRadius: "8px", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>{upg.name}</div>
                          <div style={{ fontSize: "10px", color: "#a855f7" }}>{upg.desc}</div>
                        </div>
                        <button onClick={() => buyRebirthUpgrade(upg.id)} className="rbx-btn rbx-btn-purple" style={{ padding: "6px 12px", fontSize: "12px" }}>
                          {upg.cost} 🪙 ({owned})
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
    );
}
