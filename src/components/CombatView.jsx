
import React from 'react';
import { Format, RARITY, getGrade, getTitle, REBIRTH_SHOP, SAVE_KEY, ELEMENTS } from '../data/constants';
import { ITEMS_DB, SHIPS, RELICS } from '../data/items';
import { PETS_DB } from '../data/pets';
import { SEAS, CREW_MEMBERS, BGM_TRACKS } from '../data/combat';

export function CombatView({
    mainTab, player, battle, setBattle, combatState, dps, getDmg, getDmgMult, activeSyns, gameMode, setGameMode, playClick, dragonBalls, hitstop, shake, showUltAnim, combatDeck, setCombatDeck, executeCard, executeVanish, executeRisingRush, raidWave, raidActive, floatingTexts, autoClick, setAutoClick, changeSea
}) {
    if (mainTab !== "combat") return null;
    return (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px", height: "100%" }}>

            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "5px" }}>
              <button onClick={() => { playClick(); setGameMode("idle"); setBattle(null); }} className={`rbx-btn ${gameMode === "idle" ? 'rbx-btn-blue' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "11px" }}>🗺️ GRIND</button>
              <button onClick={() => { playClick(); setGameMode("tower"); setBattle(null); }} className={`rbx-btn ${gameMode === "tower" ? 'rbx-btn-purple' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "11px" }}>🏯 TOUR</button>
              <button onClick={() => { playClick(); setGameMode("pvp"); setBattle(null); }} className={`rbx-btn ${gameMode === "pvp" ? 'rbx-btn-orange' : ''}`} style={{ flex: "0 0 auto", padding: "8px 12px", fontSize: "11px" }}>⚔️ ARENA</button>
            </div>

            {/* SELECTION SCREENS (When no battle is active) */}
            {!battle && (
              <>
                {gameMode === "idle" && (
                  <div className="rbx-panel fade-in" style={{ padding: "15px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                      <button onClick={() => changeSea(Object.keys(SEAS)[Object.keys(SEAS).indexOf(player.sea) - 1])} disabled={Object.keys(SEAS).indexOf(player.sea) === 0} className="rbx-btn" style={{ padding: "8px" }}>◀</button>
                      <div style={{textAlign: "center"}}>
                        <h2 style={{ margin: 0, fontSize: "18px", color: "#eab308", fontWeight: "900", textTransform: "uppercase" }}>{player.sea}</h2>
                        <span style={{ fontSize: "10px", color: "#a1a1aa" }}>{player.weather}</span>
                      </div>
                      <button onClick={() => changeSea(Object.keys(SEAS)[Object.keys(SEAS).indexOf(player.sea) + 1])} disabled={Object.keys(SEAS).indexOf(player.sea) === Object.keys(SEAS).length - 1} className="rbx-btn" style={{ padding: "8px" }}>▶</button>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      {SEAS[player.sea].map((e, idx) => (
                        <div key={idx} onClick={() => { playClick(); setBattle({ ...e, hp: e.hp, maxHp: e.hp }); }} className="rbx-btn ios-tap" style={{ justifyContent: "space-between", background: "#18181b", padding: "15px", border: `1px solid ${ELEMENTS[e.elem]?.color || '#333'}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "24px" }}>{e.emoji}</span>
                            <div style={{ textAlign: "left", textTransform: "none", lineHeight: "1.2" }}>
                              <span style={{ display: "block", color: e.isBoss ? "#ef4444" : "#fff", fontSize: "14px", fontWeight: "900" }}>{e.name}</span>
                              <span style={{ fontSize: "10px", color: e.isBoss ? "#ef4444" : "#22c55e", fontWeight: "bold" }}>{e.isBoss ? "Boss 💀" : `Élément [${e.elem||'STR'}]`}</span>
                            </div>
                          </div>
                          <span style={{ color: "#22c55e", fontSize: "14px" }}>▶</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {gameMode === "tower" && (
                  <div className="rbx-panel fade-in" style={{ textAlign: "center", padding: "15px", border: "2px solid #a855f7", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h2 style={{ color: "#a855f7", margin: "0 0 5px", fontSize: "20px", textTransform: "uppercase" }}>Tour d'Impel Down</h2>
                    <p style={{ fontSize: "11px", color: "#cbd5e1", marginBottom: "15px" }}>Étage actuel : <strong>{player.towerFloor}</strong></p>
                    <button onClick={() => {
                      playClick();
                      const hp = 50000 * Math.pow(1.5, player.towerFloor);
                      const isBossFloor = player.towerFloor % 10 === 0;
                      setBattle({
                        name: isBossFloor ? `Boss de Palier (Étage ${player.towerFloor})` : `Gardien (Étage ${player.towerFloor})`,
                        emoji: isBossFloor ? "👹" : "🧌",
                        elem: "INT",
                        hp: isBossFloor ? hp * 2 : hp,
                        maxHp: isBossFloor ? hp * 2 : hp,
                        beli: hp/10,
                        xp: hp/20,
                        isBoss: true,
                        drops: isBossFloor ? [{id: 'w_shark', chance: 1}] : []
                      });
                    }} className="rbx-btn rbx-btn-purple" style={{ width: "100%" }}>AFFRONTER L'ÉTAGE {player.towerFloor}</button>
                  </div>
                )}

                {gameMode === "pvp" && (
                  <div className="rbx-panel fade-in" style={{ textAlign: "center", padding: "15px", border: "2px solid #ef4444", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h2 style={{ color: "#ef4444", margin: "0 0 5px", fontSize: "20px", textTransform: "uppercase" }}>Arène PvP Asynchrone</h2>
                    <p style={{ fontSize: "11px", color: "#cbd5e1", marginBottom: "15px" }}>Rang actuel : <strong>{player.pvpRank}</strong></p>
                    <button onClick={() => {
                      playClick();
                      const enemyPower = player.power * (0.85 + Math.random() * 0.3);
                      const enemyHp = Math.floor(enemyPower * 50);
                      const names = ["Dread", "Skull", "Bones", "Iron", "Storm", "Black"];
                      const name = names[Math.floor(Math.random()*names.length)] + " Pirate";
                      setBattle({ name: name, emoji: "👤", elem: "PHY", hp: enemyHp, maxHp: enemyHp, beli: 5000, xp: 2000, isBoss: false });
                    }} className="rbx-btn rbx-btn-orange" style={{ width: "100%" }}>CHERCHER UN ADVERSAIRE</button>
                  </div>
                )}
              </>
            )}

            {/* UNIFIED COMBAT ARENA (When battle is active) */}
            {battle && (
              <div className="rbx-panel fade-in" style={{ padding: "15px", display: "flex", flexDirection: "column", flex: 1, border: gameMode === "tower" ? "2px solid #a855f7" : gameMode === "pvp" ? "2px solid #ef4444" : "1px solid #27272a" }}>
                <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                  {/* ENNEMY HP BAR */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: "bold" }}>Vous: {Format.num(player.playerHp.current)} PV</span>
                    <span style={{ color: battle.isBoss ? "#ef4444" : ELEMENTS[battle.elem]?.color || "#eab308", fontSize: "12px", fontWeight: "bold" }}>{battle.name} {ELEMENTS[battle.elem]?.icon}</span>
                  </div>
                  <div style={{ width: "100%", background: "#27272a", height: "12px", borderRadius: "4px", marginBottom: "10px", position: "relative", overflow: "hidden" }}>
                    <div style={{ width: `${(battle.hp / battle.maxHp) * 100}%`, background: gameMode === "tower" ? "#a855f7" : gameMode === "pvp" || battle.isBoss ? "#ef4444" : "#eab308", height: "100%", transition: "0.1s" }} />
                    <span style={{ position: "absolute", width: "100%", top: 0, left: 0, textAlign: "center", fontSize: "8px", lineHeight: "12px", fontWeight: "900", textShadow: "0 1px 2px #000" }}>{Format.num(battle.hp)} / {Format.num(battle.maxHp)}</span>
                  </div>

                  {/* ARENA (Swipable for Vanish) */}
                  <div onClick={executeVanish} className={`${shake ? 'shake-anim' : ''} ${hitstop ? 'hitstop' : ''} ios-tap`} style={{ flex: 1, minHeight: "200px", position: "relative", background: gameMode === "tower" ? "radial-gradient(circle, #3b0764 0%, #18181b 70%)" : gameMode === "pvp" ? "radial-gradient(circle, #7f1d1d 0%, #18181b 70%)" : "radial-gradient(circle, #27272a 0%, #18181b 70%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: battle.isBoss ? "2px solid #7f1d1d" : gameMode === "tower" ? "2px solid #7e22ce" : gameMode === "pvp" ? "2px solid #dc2626" : "2px solid #334155", overflow: "hidden" }}>
                    <span style={{ fontSize: "100px", filter: combatState.stunTime > 0 ? "grayscale(1) brightness(0.5)" : "none", transition: "0.2s" }}>{battle.emoji}</span>
                    {floatingTexts.map(t => (<span key={t.id} className="dmg-text" style={{ left: t.x, top: t.y, color: t.color, fontSize: t.isCrit ? "28px" : "18px" }}>{t.text}</span>))}

                    {/* DBL Elements */}
                    {combatState.comboCount > 1 && (
                        <div style={{ position: "absolute", top: "10px", left: "10px", fontSize: "20px", fontWeight: "900", color: "#eab308", filter: "drop-shadow(0 0 10px #eab308)", animation: "fadeIn 0.2s" }}>
                            {combatState.comboCount} COMBO
                        </div>
                    )}

                    {combatState.isInvincible && <div style={{position:"absolute", inset:0, border:"4px solid #fff", borderRadius:"16px", opacity:0.8}}></div>}
                    {combatState.enemyAttacking && <div className="enemy-attack-warn">!</div>}
                    <div className="vanish-gauge"><div className={`vanish-fill ${combatState.vanishing >= 100 ? 'vanish-ready' : ''}`} style={{ height: `${combatState.vanishing}%` }}></div></div>
                  </div>

                  {/* DBL BOTTOM UI */}
                  <div style={{ marginTop: "15px" }}>
                    {/* KI GAUGE */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#18181b", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" }}>{Math.floor(combatState.energy)}</div>
                      <div style={{ flex: 1, background: "#18181b", height: "14px", borderRadius: "7px", overflow: "hidden", border: "1px solid #334155" }}>
                        <div style={{ width: `${combatState.energy}%`, background: "#3b82f6", height: "100%", transition: "0.2s" }}></div>
                      </div>
                    </div>

                    {/* DECK & RISING RUSH */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                      <div style={{ display: "flex", gap: "8px", flex: 1, height: "90px" }}>
                        {combatDeck.map((card, i) => (
                          <div key={card.uid} className="dbl-card ios-tap" onClick={() => executeCard(card, i, combatState)} style={{ background: card.bg, opacity: combatState.energy < card.cost ? 0.4 : 1 }}>
                            <span className="dbl-card-cost">{card.cost}</span>
                            {card.hasDB && <span className="dbl-card-db">⭐</span>}
                            <span className="dbl-card-icon">{card.icon}</span>
                            <span style={{ fontSize: "9px" }}>{card.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* RISING RUSH BUTTON */}
                      <div onClick={executeRisingRush} className="ios-tap" style={{ width: "70px", height: "70px", borderRadius: "50%", background: dragonBalls >= 7 ? "radial-gradient(circle, #facc15, #a16207)" : "#18181b", border: `2px solid ${dragonBalls >= 7 ? '#fff' : '#334155'}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: dragonBalls >= 7 ? "pointer" : "default", boxShadow: dragonBalls >= 7 ? "0 0 20px #eab308" : "none", opacity: dragonBalls === 0 ? 0.5 : 1 }}>
                        <span style={{ fontSize: "20px", filter: "drop-shadow(0 0 5px #000)" }}>{dragonBalls >= 7 ? "🐉" : "⭐"}</span>
                        <span style={{ fontSize: "12px", fontWeight: "900", color: "#fff", textShadow: "0 1px 2px #000" }}>{dragonBalls}/7</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                      <button onClick={() => { playClick(); setAutoClick(!autoClick); }} className={`rbx-btn ${autoClick ? 'rbx-btn-green' : ''}`} style={{ flex: 1, padding: "8px" }}>{autoClick ? "AUTO: ON" : "AUTO FIGHT"}</button>
                      <button onClick={() => {
                        playClick();
                        setBattle(null);
                        setAutoClick(false);
                        if (setCombatDeck) setCombatDeck([]);
                      }} className="rbx-btn" style={{ background: "#7f1d1d", borderColor: "#450a0a", padding: "8px" }}>FUITE</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

                      </div>
    );
}
