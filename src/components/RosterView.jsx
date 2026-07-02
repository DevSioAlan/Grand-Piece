
import React from 'react';
import { Format, RARITY, getGrade, getTitle, REBIRTH_SHOP, SAVE_KEY } from '../data/constants';
import { ITEMS_DB, SHIPS, RELICS } from '../data/items';
import { PETS_DB } from '../data/pets';
import { CREW_MEMBERS, BGM_TRACKS } from '../data/combat';

export function RosterView({
    mainTab, player, playClick, rosterTab, setRosterTab, crewSelectSlot, setCrewSelectSlot, setPlayer, fusePets, petSelectSlot, setPetSelectSlot
}) {
    if (mainTab !== "roster") return null;
    return (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { playClick(); setRosterTab("crew"); }} className={`rbx-btn ${rosterTab==='crew'?'rbx-btn-blue':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>ÉQUIPAGE</button>
              <button onClick={() => { playClick(); setRosterTab("pets"); }} className={`rbx-btn ${rosterTab==='pets'?'rbx-btn-green':''}`} style={{flex:1, padding:"8px", fontSize:"10px"}}>FAMILIERS</button>
            </div>

            {rosterTab === "crew" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div className="rbx-panel">
                  <h3 style={{ margin: "0 0 15px", color: "#38bdf8", fontSize: "16px", textTransform: "uppercase" }}>Formation</h3>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "5px", fontWeight: "bold" }}>⚔️ COMBATTANTS ACTIFS</div>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                      {[0, 1, 2].map(i => {
                        const id = player.crewSetup.active[i]; const char = id ? CREW_MEMBERS.find(m => m.id === id) : null;
                        const isSelected = crewSelectSlot?.type === 'active' && crewSelectSlot?.index === i;
                        return (
                          <div key={`act_${i}`} onClick={() => { playClick(); setCrewSelectSlot({type: 'active', index: i}); }} style={{ flex: 1, height: "70px", background: "var(--bg-secondary)", border: isSelected ? "2px solid #38bdf8" : char ? `1px solid ${RARITY[char.rarity]?.color}` : "1px dashed #334155", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                            <span style={{ fontSize: "24px" }}>{char ? char.img : "+"}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "5px", fontWeight: "bold" }}>🛡️ SUPPORTS PASSIFS</div>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                      {[0, 1, 2].map(i => {
                        const id = player.crewSetup.support[i]; const char = id ? CREW_MEMBERS.find(m => m.id === id) : null;
                        const isSelected = crewSelectSlot?.type === 'support' && crewSelectSlot?.index === i;
                        return (
                          <div key={`sup_${i}`} onClick={() => { playClick(); setCrewSelectSlot({type: 'support', index: i}); }} style={{ flex: 1, height: "60px", background: "var(--bg-primary)", border: isSelected ? "2px solid #22c55e" : char ? `1px solid ${RARITY[char.rarity]?.color}` : "1px dashed #334155", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.8, position: "relative" }}>
                            <span style={{ fontSize: "20px" }}>{char ? char.img : "+"}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {crewSelectSlot && (
                  <div className="rbx-panel fade-in" style={{ border: `2px solid ${crewSelectSlot.type === 'active' ? '#38bdf8' : '#22c55e'}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <h4 style={{ margin: 0, color: "#fff" }}>Affecter au Slot</h4>
                      <button onClick={() => { playClick(); setCrewSelectSlot(null); }} className="rbx-btn" style={{ padding: "4px 8px", fontSize: "10px" }}>FERMER</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", maxHeight: "200px", overflowY: "auto", paddingRight: "5px" }}>
                      <div onClick={() => { playClick(); setPlayer(p => { let n = { active: [...p.crewSetup.active], support: [...p.crewSetup.support] }; n[crewSelectSlot.type][crewSelectSlot.index] = null; return {...p, crewSetup: n}; }); setCrewSelectSlot(null); }} style={{ background: "#7f1d1d", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>RETIRER</div>
                      {player.crewList.map(id => {
                        const char = CREW_MEMBERS.find(c=>c.id===id); if(!char) return null;
                        const isEq = player.crewSetup.active.includes(id) || player.crewSetup.support.includes(id);
                        return (
                          <div key={id} onClick={() => { if (!isEq) { playClick(); setPlayer(p => { let n = { active: [...p.crewSetup.active], support: [...p.crewSetup.support] }; n[crewSelectSlot.type][crewSelectSlot.index] = id; return {...p, crewSetup: n}; }); setCrewSelectSlot(null); } }} className={char.rarity === "EX" ? "ex-shatter" : ""} style={{ background: "var(--bg-secondary)", border: `1px solid ${RARITY[char.rarity]?.color}`, padding: "8px", borderRadius: "8px", textAlign: "center", cursor: isEq ? "not-allowed" : "pointer", opacity: isEq ? 0.3 : 1 }}>
                            <div style={{ fontSize: "24px", marginBottom: "2px" }}>{char.img}</div><div style={{ fontSize: "8px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden" }}>{char.name}</div>
                            <div style={{ fontSize: "7px", color: "#38bdf8", marginTop: "2px", fontWeight: "bold" }}>XP: {player.memberFragments?.[id] || 0} / 50</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {rosterTab === "pets" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div className="rbx-panel">
                  <h3 style={{ margin: "0 0 15px", color: "#22c55e", fontSize: "16px", textTransform: "uppercase" }}>Familiers Actifs</h3>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                    {[0, 1].map(i => {
                      const instId = player.pets.active[i]; const petItem = instId ? player.pets.inventory.find(p => p.instanceId === instId) : null;
                      const petData = petItem ? PETS_DB[petItem.itemId] : null; const isSelected = petSelectSlot === i;
                      return (
                        <div key={`pet_${i}`} onClick={() => { playClick(); setPetSelectSlot(i); }} className={petItem ? `pet-aura-${petItem.stars||1}` : ""} style={{ flex: 1, height: "80px", background: "var(--bg-secondary)", border: isSelected ? "2px solid #22c55e" : petData ? `1px solid ${RARITY[petData.rarity]?.color}` : "1px dashed #334155", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                          {petItem && <span style={{position:"absolute", top:"4px", right:"4px", fontSize:"10px", color:"#eab308", fontWeight:"bold"}}>⭐{petItem.stars||1}</span>}
                          <span style={{ fontSize: "28px" }}>{petData ? petData.img : "🐾"}</span>
                          {petData && <span style={{ fontSize: "8px", color: "#a1a1aa", marginTop: "4px" }}>{petData.desc}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {petSelectSlot !== null && (
                  <div className="rbx-panel fade-in" style={{ border: `2px solid #22c55e` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <h4 style={{ margin: 0, color: "#fff" }}>Choisir Familier</h4>
                      <button onClick={() => { playClick(); setPetSelectSlot(null); }} className="rbx-btn" style={{ padding: "4px 8px", fontSize: "10px" }}>FERMER</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                      <div onClick={() => { playClick(); setPlayer(p => { let n = [...p.pets.active]; n[petSelectSlot] = null; return {...p, pets: {...p.pets, active: n}}; }); setPetSelectSlot(null); }} style={{ background: "#7f1d1d", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>RETIRER</div>
                      {player.pets.inventory.map(invPet => {
                        const pData = PETS_DB[invPet.itemId]; if (!pData) return null;
                        const isEq = player.pets.active.includes(invPet.instanceId);
                        return (
                          <div key={invPet.instanceId} className={`pet-aura-${invPet.stars||1}`} style={{ background: "var(--bg-secondary)", border: `1px solid ${RARITY[pData.rarity]?.color}`, padding: "8px", borderRadius: "8px", textAlign: "center", cursor: isEq ? "not-allowed" : "pointer", opacity: isEq ? 0.3 : 1, position: "relative", marginBottom: "10px" }}>
                            <div onClick={() => { if (!isEq) { playClick(); setPlayer(p => { let n = [...p.pets.active]; n[petSelectSlot] = invPet.instanceId; return {...p, pets: {...p.pets, active: n}}; }); setPetSelectSlot(null); } }}>
                              <div style={{ fontSize: "24px" }}>{pData.img}</div><div style={{ fontSize: "8px", color: "#fff" }}>{pData.name}</div>
                              <div style={{ fontSize: "10px", color: "#eab308", fontWeight: "bold" }}>⭐{invPet.stars||1}</div>
                            </div>

                            <button onClick={(e) => { e.stopPropagation(); fusePets(invPet.itemId, invPet.stars||1); }} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#3b82f6", border: "none", color: "#fff", fontSize: "10px", borderRadius: "50%", width: "20px", height: "20px" }}>+</button>
                            {invPet.stars < 5 && player.pets.inventory.filter(p => p.itemId === invPet.itemId && (p.stars || 1) === (invPet.stars || 1) && !player.pets.active.includes(p.instanceId)).length >= 5 && (
                                <button onClick={(e) => { e.stopPropagation(); playClick(); fusePets(invPet.itemId, invPet.stars || 1); }} className="rbx-btn rbx-btn-gold" style={{ position: "absolute", bottom: "-15px", left: "50%", transform: "translateX(-50%)", fontSize: "8px", padding: "2px 4px", whiteSpace: "nowrap", zIndex: 10 }}>FUSION ✨</button>
                            )}

                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
    );
}
