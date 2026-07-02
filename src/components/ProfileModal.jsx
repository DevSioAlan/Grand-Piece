
import React from 'react';
import { Format, getGrade, TITLES_BUFFS, RARITY } from '../data/constants';
import { ITEMS_DB } from '../data/items';
import { CREW_MEMBERS } from '../data/combat';

export function ProfileModal({
    showProfile, setShowProfile, player, profileTab, setProfileTab, setPlayer, getDmg
}) {
    if (!showProfile) return null;

    return (

      <div className="modal-overlay ios-tap" onClick={() => setShowProfile(false)}>
          <div className="rbx-panel fade-in" style={{ width: "100%", maxWidth: "400px", border: "2px solid #eab308", maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "15px" }}>
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#eab308" }}>PROFIL JOUEUR</span>
              <button onClick={() => setShowProfile(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", fontWeight: "bold" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button onClick={() => setProfileTab("stats")} className={`rbx-btn ${profileTab==='stats'?'rbx-btn-blue':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>STATS</button>
              <button onClick={() => setProfileTab("edit")} className={`rbx-btn ${profileTab==='edit'?'rbx-btn-green':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>ÉDITER</button>
              <button onClick={() => setProfileTab("analytics")} className={`rbx-btn ${profileTab==='analytics'?'rbx-btn-purple':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>ANALYTIQUE</button>
            </div>

            {profileTab === "stats" && (
              <div className="fade-in">
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                  <div className={`frame-${player.profile.frame}`} style={{ fontSize: "60px", background: "var(--bg-secondary)", padding: "10px", borderRadius: "15px" }}>{player.profile.avatar}</div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: "#fff" }}>{player.profile.username} {player.profile.flag}</div>
                    <div className="rainbow-text" style={{ fontSize: "14px" }}>{player.profile.titleEquipped}</div>
                    <div style={{ color: "#a1a1aa", fontSize: "12px", marginTop: "5px", fontStyle: "italic" }}>"{player.profile.bio}"</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  <div className="premium-shadow" style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", border: "1px solid #3b82f6", textAlign: "center" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af", display: "block", textTransform: "uppercase", fontWeight: "bold" }}>⚔️ PUISSANCE</span>
                    <span className={getGrade(getDmg()).isRainbow ? "rainbow-text" : ""} style={{ fontSize: "22px", fontWeight: "900", color: getGrade(getDmg()).color, textShadow: `0 0 10px ${getGrade(getDmg()).color}` }}>{Format.num(getDmg())}</span>
                  </div>
                  <div className="premium-shadow" style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", border: "1px solid #ef4444", textAlign: "center" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af", display: "block", textTransform: "uppercase", fontWeight: "bold" }}>💀 PRIME</span>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#ef4444", textShadow: "0 0 10px #ef4444" }}>{Format.num(player.bounty)}</span>
                  </div>
                </div>
              </div>
            )}


            {profileTab === "analytics" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div className="premium-shadow" style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", border: "1px solid #a855f7" }}>
                  <span style={{ fontSize: "12px", color: "#d8b4fe", fontWeight: "bold", display: "block" }}>Statistiques de Combat</span>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "14px" }}>
                    <span>DPS Moyen:</span>
                    <span style={{ fontWeight: "bold", color: "#fff" }}>{Format.num(getDmg() * 2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "14px", alignItems: "center" }}>
                    <span>Taux de Victoire Simulé:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                       <select value={player.settings?.aiTactic || 'aggressif'} onChange={(e) => setPlayer(p => ({...p, settings: {...(p.settings||{}), aiTactic: e.target.value}}))} style={{ background: "var(--bg-primary)", color: "#fff", border: "1px solid var(--border-color)", padding: "4px", borderRadius: "4px", fontSize: "10px" }}>
                         <option value="aggressif">Aggressif</option>
                         <option value="defensif">Défensif</option>
                         <option value="equilibrez">Équilibré</option>
                       </select>
                       <span style={{ fontWeight: "bold", color: (player.settings?.aiTactic || 'aggressif') === 'aggressif' ? '#ef4444' : '#22c55e' }}>
                         { (player.settings?.aiTactic || 'aggressif') === 'aggressif' ? '68%' : (player.settings?.aiTactic || 'aggressif') === 'defensif' ? '82%' : '75%' }
                       </span>
                    </div>
                  </div>
                </div>

                <div className="premium-shadow" style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", border: "1px solid #eab308" }}>
                  <span style={{ fontSize: "12px", color: "#fef08a", fontWeight: "bold", display: "block" }}>Historique RNG</span>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "14px" }}>
                    <span>Invocations Totales:</span>
                    <span style={{ fontWeight: "bold", color: "#fff" }}>{Format.num(player.profile?.totalSummons || 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "14px" }}>
                    <span>Taux EX/Divin Obtenu:</span>
                    <span style={{ fontWeight: "bold", color: "#38bdf8" }}>{ ((player.profile?.totalSummons || 0) > 0 ? (((player.inventory.filter(i => { const d = i.itemId ? ITEMS_DB[i.itemId] : null; return d && (d.rarity === 'EX' || d.rarity === 'Divine'); }).length) / player.profile.totalSummons) * 100).toFixed(2) : 0) }%</span>
                  </div>
                </div>

                <div className="premium-shadow" style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: "8px", border: "1px solid #22c55e" }}>
                  <span style={{ fontSize: "12px", color: "#bbf7d0", fontWeight: "bold", display: "block" }}>Valeur Nette du Compte</span>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "18px" }}>
                    <span>Valeur Estimée:</span>
                    <span style={{ fontWeight: "bold", color: "#22c55e" }}>
                        {Format.num(
                           (player.beli || 0) +
                           (player.gems || 0) * 100 +
                           (player.inventory || []).reduce((acc, item) => { const d = item.itemId ? ITEMS_DB[item.itemId] : null; return acc + (d ? (RARITY[d.rarity]?.val || 1) * 5000 : 0); }, 0) +
                           (player.crewSetup?.active || []).concat(player.crewSetup?.support || []).filter(Boolean).reduce((acc, id) => { const d = CREW_MEMBERS.find(c=>c.id===id); return acc + (d ? (RARITY[d.rarity]?.val || 1) * 10000 : 0); }, 0)
                        )} ฿
                    </span>
                  </div>
                </div>
              </div>
            )}

            {profileTab === "edit" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Nom d'Équipage</span>
                  <input type="text" value={player.profile.username} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, username: e.target.value}}))} style={{ width: "100%", background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "#fff", padding: "10px", borderRadius: "8px", marginTop: "5px" }} maxLength={15} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Titre Actif</span>
                    <select value={player.profile.titleEquipped} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, titleEquipped: e.target.value}}))} style={{ width: "100%", background: "var(--bg-primary)", color: "#fff", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px", marginTop: "5px", fontSize: "12px" }}>

                      {player.profile.titles.map(t => <option key={t} value={t}>{t} - {TITLES_BUFFS[t]?.desc || "Buff"}</option>)}

                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>Cadre (Frame)</span>
                    <select value={player.profile.frame} onChange={(e) => setPlayer(p => ({...p, profile: {...p.profile, frame: e.target.value}}))} style={{ width: "100%", background: "var(--bg-primary)", color: "#fff", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px", marginTop: "5px", fontSize: "12px" }}>
                      <option value="default">Défaut</option><option value="gold">Or</option><option value="neon">Néon</option><option value="flame">Flammes</option>
                    </select>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Avatar</span>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {["🏴‍☠️", "💀", "🦊", "🐯", "🤖", "⚔️", "⚓", "👑", "🐉", "🤡"].map(av => (
                      <div key={av} onClick={() => setPlayer(p => ({...p, profile: {...p.profile, avatar: av}}))} style={{ fontSize: "24px", background: player.profile.avatar === av ? "#3b82f6" : "var(--bg-secondary)", padding: "8px", borderRadius: "8px", border: "1px solid var(--border-color)", cursor: "pointer" }}>{av}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    );
}
