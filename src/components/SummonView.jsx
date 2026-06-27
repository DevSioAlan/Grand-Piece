
import React from 'react';
import { Format, RARITY, getGrade, getTitle, REBIRTH_SHOP, SAVE_KEY } from '../data/constants';
import { ITEMS_DB, SHIPS, RELICS } from '../data/items';
import { PETS_DB } from '../data/pets';
import { CREW_MEMBERS, BGM_TRACKS } from '../data/combat';

export function SummonView({
    mainTab, player, playClick, banner, setBanner, performSummon, autoSummonConfig, setAutoSummonConfig, cinematicSummon, summonResult, setSummonResult
}) {
    if (mainTab !== "summon") return null;
    return (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "5px" }}>
              {["Crew", "Pet", "Fruit", "Weapon", "Armor"].map(b => {
                const mapBanner = b === "Armor" ? "Head" : b;
                return (
                  <button key={b} onClick={() => { playClick(); setBanner(mapBanner); }} className={`rbx-btn ${banner === mapBanner ? 'rbx-btn-blue' : ''}`} style={{ flex: "0 0 auto", padding: "8px 15px", fontSize: "12px" }}>
                    {b.toUpperCase()}
                  </button>
                )
              })}
            </div>

            <div className="rbx-panel" style={{ textAlign: "center" }}>
              <h2 style={{ color: "#38bdf8", margin: "0 0 15px", fontSize: "20px", fontWeight: "900", letterSpacing: "2px" }}>INVOCATION</h2>

              <div style={{ textAlign: "left", marginBottom: "15px" }}>
                <div className="showcase-scroll">
                  {(banner === "Crew" ? CREW_MEMBERS : banner === "Pet" ? Object.values(PETS_DB) : Object.values(ITEMS_DB).filter(item => item.type === banner || (banner==='Head' && ['Chest','Gloves','Boots','Accessory'].includes(item.type))))
                    .sort((a,b) => (RARITY[b.rarity]?.val||0) - (RARITY[a.rarity]?.val||0)).map((item, i) => {
                    let animClass = item.rarity === "EX" ? "ex-shatter" : item.rarity === "Divine" || item.rarity === "Mythic" ? "mythic-glow" : item.rarity === "Legendary" ? "legendary-shine" : item.rarity === "Epic" ? "epic-pulse" : "common-shine";
                    return (
                      <div key={i} className={animClass} style={{ flex: "0 0 auto", width: "70px", background: "#18181b", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", marginBottom: "5px" }}>{item.img}</div>
                        <div style={{ fontSize: "8px", color: RARITY[item.rarity]?.color || "#fff", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "15px" }}>
                <div style={{ background: "#18181b", padding: "8px", borderRadius: "8px", border: "1px solid #27272a", textAlign: "left" }}>
                  <div style={{ fontSize: "9px", color: "#eab308", fontWeight: "bold" }}>PITY LÉGENDAIRE</div>
                  <div className="pity-bar"><div className="pity-fill" style={{ background: "#eab308", width: `${(player.pity.legendary / 100) * 100}%` }}></div></div>
                  <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "2px" }}>{player.pity.legendary % 100} / 100</div>
                </div>
                <div style={{ background: "#18181b", padding: "8px", borderRadius: "8px", border: "1px solid #27272a", textAlign: "left" }}>
                  <div style={{ fontSize: "9px", color: "#f472b6", fontWeight: "bold" }}>PITY EX (GARANTI)</div>
                  <div className="pity-bar"><div className="pity-fill" style={{ background: "#f472b6", width: `${(player.pity.ex / 800) * 100}%` }}></div></div>
                  <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "2px" }}>{player.pity.ex} / 800</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => performSummon(banner, 1)} className="rbx-btn rbx-btn-green ios-tap" style={{ flex: 1, flexDirection: "column", padding: "12px 0", opacity: autoSummonConfig.active ? 0.5 : 1 }}>
                  <span style={{ fontSize: "14px" }}>PULL x1</span><span style={{ fontSize: "11px", marginTop: "4px" }}>💎 50</span>
                </button>
                <button onClick={() => performSummon(banner, 10)} className="rbx-btn rbx-btn-blue ios-tap" style={{ flex: 1, flexDirection: "column", padding: "12px 0", opacity: autoSummonConfig.active ? 0.5 : 1 }}>
                  <span style={{ fontSize: "14px" }}>PULL x10</span><span style={{ fontSize: "11px", marginTop: "4px" }}>💎 450</span>
                </button>
              </div>

              {summonResult && !autoSummonConfig.active && (
                <div className="fade-in" style={{ marginTop: "20px", background: "#09090b", padding: "15px", borderRadius: "12px", border: "1px solid #27272a" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                    {summonResult.map((item, i) => {
                      let animClass = item.rarity === "EX" ? "ex-shatter" : item.rarity === "Divine" || item.rarity === "Mythic" ? "mythic-glow" : item.rarity === "Legendary" ? "legendary-shine" : item.rarity === "Epic" ? "epic-pulse" : "common-shine";
                      let scale = item.rarity === "EX" ? 1.3 : item.rarity === "Divine" ? 1.1 : 1.0;
                      return (
                        <div key={i} className={`fade-in ${animClass}`} style={{ animationDelay: `${i * 0.05}s`, background: "#18181b", borderRadius: "8px", padding: "8px", textAlign: "center", width: "60px", transform: `scale(${scale})` }}>
                          <div style={{ fontSize: "24px" }}>{item.img}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
    );
}
