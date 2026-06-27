
import React from 'react';
import { Format, getGrade } from '../data/constants';

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
    );
}
