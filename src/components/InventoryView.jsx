
import React from 'react';
import { Format, RARITY } from '../data/constants';
import { ITEMS_DB } from '../data/items';

export function InventoryView({
    mainTab, player, playClick, sellCommons, setPlayer, getEquipped, awakenItem, autoEquip, forgeItem
}) {
    if (mainTab !== "inventory") return null;

    return (

          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div className="rbx-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h4 style={{ margin: 0, color: "#fff" }}>Équipement RPG</h4>
                <button onClick={autoEquip} className="rbx-btn rbx-btn-gold" style={{ padding: "6px 12px", fontSize: "10px" }}>⚡ AUTO BUILD</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "15px" }}>
                {["Fruit", "Weapon", "Head", "Chest", "Gloves", "Boots", "Accessory"].map(type => {
                  let eqId = player.equipped[type === "Fruit" ? "fruitId" : type === "Weapon" ? "weaponId" : type === "Accessory" ? "accId" : `${type.toLowerCase()}Id`];
                  let item = eqId ? player.inventory.find(i => i.instanceId === eqId) : null;
                  let baseData = item ? ITEMS_DB[item.itemId] : null;

                  return (
                    <div key={type} style={{ background: "var(--bg-secondary)", padding: "8px", borderRadius: "8px", border: "1px solid #334155", display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "20px", background: "var(--bg-primary)", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: `1px solid ${baseData ? RARITY[baseData.rarity].color : '#333'}` }}>{baseData ? baseData.img : "❓"}</div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "8px", color: "#a1a1aa", textTransform: "uppercase" }}>{type}</div>
                        <div style={{ fontSize: "10px", fontWeight: "bold", color: baseData ? RARITY[baseData.rarity].color : "#555", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{baseData ? baseData.name : "Vide"}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
                <button onClick={sellCommons} className="rbx-btn" style={{ flex: 1, padding: "8px", fontSize: "9px", background: "#374151" }}>VENDRE COMMUNS</button>
              </div>

              <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase" }}>Sac à dos (Tap pour équiper)</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {player.inventory.map((invItem) => {
                  const item = ITEMS_DB[invItem.itemId]; if (!item) return null;
                  const isEq = Object.values(player.equipped).includes(invItem.instanceId); const isV2 = invItem.awakenLvl >= 10;
                  return (
                    <div key={invItem.instanceId} onClick={() => { playClick(); let equipKey = item.type === "Fruit" ? "fruitId" : item.type === "Weapon" ? "weaponId" : item.type === "Accessory" ? "accId" : `${item.type.toLowerCase()}Id`; setPlayer(p => ({ ...p, equipped: { ...p.equipped, [equipKey]: invItem.instanceId } })); }} className={item.rarity === "Mythic" || item.rarity === "Divine" ? "mythic-glow" : item.rarity === "EX" ? "ex-shatter" : ""} style={{ background: "var(--bg-secondary)", border: isEq ? "2px solid #22c55e" : "1px solid #334155", borderRadius: "8px", padding: "8px", textAlign: "center", position: "relative" }}>
                      {isEq && <span style={{ position: "absolute", bottom: "2px", left: "2px", fontSize: "8px", color: "#22c55e", fontWeight: "900" }}>EQP</span>}
                      <span style={{ fontSize: "24px", filter: isV2 ? "drop-shadow(0 0 5px rgba(239, 68, 68, 0.8))" : "none" }}>{item.img}</span>
                      <button onClick={(e) => { e.stopPropagation(); awakenItem(invItem.instanceId); }} style={{ position: "absolute", top: "2px", right: "2px", background: isV2 ? "#ef4444" : "#a855f7", border: "none", color: "#fff", fontSize: "8px", borderRadius: "4px", padding: "2px", zIndex: 10 }}>{isV2 ? "V2" : `+${invItem.awakenLvl || 0}`}</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
    );
}
