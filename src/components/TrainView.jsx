
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

                <div className="rbx-panel" style={{ border: "1px solid #a855f7", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h3 style={{ marginTop: 0, width: "100%", textAlign: "left" }}>Arbre Haki (Pts: {player.hakiPoints})</h3>

                  {/* Haki Skill Tree Layout */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "10px 0" }}>

                    {/* Observation Node */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--bg-secondary)", padding: "10px", borderRadius: "12px", border: player.hakiTree['observation'] > 0 ? "2px solid #a855f7" : "1px solid #3f3f46", width: "180px", zIndex: 2 }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: player.hakiTree['observation'] > 0 ? "#d8b4fe" : "#9ca3af" }}>OBSERVATION</span>
                        <span style={{ fontSize: "10px", color: "#a1a1aa", marginBottom: "5px" }}>Niv. {player.hakiTree['observation']}/5</span>
                        <button onClick={() => buyHakiTalent('observation')} disabled={player.hakiPoints <= 0 || player.hakiTree['observation'] >= 5} className="rbx-btn rbx-btn-purple" style={{ padding: "4px 12px", fontSize: "10px", width: "100%" }}>{player.hakiTree['observation'] >= 5 ? "MAX" : "UPGRADE"}</button>
                    </div>

                    {/* Connector Line */}
                    <div style={{ width: "2px", height: "20px", background: player.hakiTree['observation'] > 0 ? "#a855f7" : "#3f3f46", zIndex: 1 }}></div>

                    {/* Armament Node */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--bg-secondary)", padding: "10px", borderRadius: "12px", border: player.hakiTree['armament'] > 0 ? "2px solid #a855f7" : "1px solid #3f3f46", width: "180px", opacity: player.hakiTree['observation'] >= 1 ? 1 : 0.5, zIndex: 2 }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: player.hakiTree['armament'] > 0 ? "#d8b4fe" : "#9ca3af" }}>ARMAMENT</span>
                        <span style={{ fontSize: "10px", color: "#a1a1aa", marginBottom: "5px" }}>Niv. {player.hakiTree['armament']}/5</span>
                        <button onClick={() => buyHakiTalent('armament')} disabled={player.hakiPoints <= 0 || player.hakiTree['armament'] >= 5 || player.hakiTree['observation'] < 1} className="rbx-btn rbx-btn-purple" style={{ padding: "4px 12px", fontSize: "10px", width: "100%" }}>{player.hakiTree['armament'] >= 5 ? "MAX" : "UPGRADE"}</button>
                    </div>

                    {/* Connector Line */}
                    <div style={{ width: "2px", height: "20px", background: player.hakiTree['armament'] > 0 ? "#a855f7" : "#3f3f46", zIndex: 1 }}></div>

                    {/* Kings Node */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--bg-secondary)", padding: "10px", borderRadius: "12px", border: player.hakiTree['kings'] > 0 ? "2px solid #eab308" : "1px solid #3f3f46", width: "180px", opacity: player.hakiTree['armament'] >= 1 ? 1 : 0.5, zIndex: 2, boxShadow: player.hakiTree['kings'] > 0 ? "0 0 10px rgba(234,179,8,0.3)" : "none" }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: player.hakiTree['kings'] > 0 ? "#fef08a" : "#9ca3af" }}>KINGS HAKI</span>
                        <span style={{ fontSize: "10px", color: "#a1a1aa", marginBottom: "5px" }}>Niv. {player.hakiTree['kings']}/5</span>
                        <button onClick={() => buyHakiTalent('kings')} disabled={player.hakiPoints <= 0 || player.hakiTree['kings'] >= 5 || player.hakiTree['armament'] < 1} className="rbx-btn rbx-btn-gold" style={{ padding: "4px 12px", fontSize: "10px", width: "100%" }}>{player.hakiTree['kings'] >= 5 ? "MAX" : "AWAKEN"}</button>
                    </div>

                  </div>
                </div>

                <button onClick={handleRebirth} className="rbx-btn rbx-btn-gold">REBIRTH ★{player.rebirth}</button>
              </div>
            )}

            {trainTab === "upgrades" && (
              <div className="rbx-panel fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3 style={{ marginTop: 0, color: "#eab308", width: "100%", textAlign: "left" }}>Boutique Incrémentale</h3>

                {/* Incremental Skill Tree Layout */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", paddingTop: "10px", position: "relative" }}>

                  {/* Central Hub Line */}
                  <div style={{ position: "absolute", top: "10px", bottom: "10px", left: "50%", width: "2px", background: "#3f3f46", transform: "translateX(-50%)", zIndex: 1 }}></div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", width: "100%", zIndex: 2 }}>

                    {[
                      { id: "dmg", name: "Dégâts", desc: "+10%", color: "#ef4444" },
                      { id: "beli", name: "Beli", desc: "+10%", color: "#eab308" },
                      { id: "xp", name: "XP", desc: "+10%", color: "#3b82f6" },
                      { id: "speed", name: "Vitesse", desc: "-5ms", color: "#22c55e" }
                    ].map((upg, index) => {
                      const lvl = player.upgrades[upg.id] || 0;
                      const cost = 10000 * Math.pow(2.5, lvl);

                      // Alternate left/right connection lines
                      const isLeft = index % 2 === 0;

                      return (
                        <div key={upg.id} style={{ position: "relative", display: "flex", justifyContent: isLeft ? "flex-end" : "flex-start", width: "100%" }}>

                          {/* Horizontal Connector */}
                          <div style={{ position: "absolute", top: "50%", [isLeft ? "right" : "left"]: "-15px", width: "15px", height: "2px", background: lvl > 0 ? upg.color : "#3f3f46", transform: "translateY(-50%)", zIndex: 1 }}></div>

                          {/* Node Card */}
                          <div style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "12px", border: `2px solid ${lvl > 0 ? upg.color : '#3f3f46'}`, width: "120px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: lvl > 0 ? `0 0 10px ${upg.color}33` : "none", zIndex: 2 }}>
                            <div style={{ fontSize: "12px", fontWeight: "bold", color: upg.color, textAlign: "center" }}>{upg.name}</div>
                            <div style={{ fontSize: "9px", color: "#a1a1aa", marginBottom: "2px" }}>{upg.desc} (Niv. {lvl})</div>
                            <button onClick={() => buyIncrementalUpgrade(upg.id)} className="rbx-btn" style={{ padding: "4px 8px", fontSize: "9px", background: player.beli >= cost ? upg.color : "#374151", color: player.beli >= cost ? "#000" : "#fff", width: "100%", marginTop: "5px", fontWeight: "bold", border: "none" }}>
                              {Format.num(cost)} ฿
                            </button>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>
              </div>
            )}

            {trainTab === "rebirth" && (
              <div className="rbx-panel fade-in" style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", border: "2px solid #eab308", boxShadow: "0 0 15px rgba(234,179,8,0.2)" }}>
                <h3 style={{ marginTop: 0, color: "#eab308", textShadow: "0 0 10px #eab308", textAlign: "center" }}>Ascension Divine</h3>
                <div style={{ textAlign: "center", marginBottom: "20px", background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(234,179,8,0.5)" }}>
                  <span style={{ fontSize: "14px", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "2px" }}>Rebirth Coins</span>
                  <div style={{ fontSize: "32px", color: "#eab308", fontWeight: "900", textShadow: "0 0 15px #eab308", margin: "5px 0" }}>{player.rebirthCoins} 🪙</div>
                </div>
                <div style={{ display: "grid", gap: "12px" }}>
                  {Object.values(REBIRTH_SHOP).map(upg => {
                    const owned = player.rebirthUpgrades[upg.id] || 0;
                    return (
                      <div key={upg.id} style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))", padding: "15px", borderRadius: "10px", borderLeft: "4px solid #eab308", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "15px", fontWeight: "900", color: "#fbbf24", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{upg.name}</div>
                          <div style={{ fontSize: "11px", color: "#d8b4fe", marginTop: "2px" }}>{upg.desc}</div>
                        </div>
                        <button onClick={() => buyRebirthUpgrade(upg.id)} className="rbx-btn rbx-btn-gold" style={{ padding: "8px 16px", fontSize: "12px", boxShadow: "0 0 10px rgba(234,179,8,0.3)" }}>
                          {upg.cost} 🪙 <br/><span style={{ fontSize: "9px" }}>({owned})</span>
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
