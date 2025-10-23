// src/components/Orders/AssignRiderModal.jsx
import React, { useEffect, useMemo, useState } from "react";

const AssignRiderModal = ({ open, onClose, riders = [], onConfirm }) => {
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    // reset when reopening
    if (open) setSelectedEmail("");
  }, [open]);

  const availableRiders = useMemo(
    () => (Array.isArray(riders)
      ? riders.filter(r => !r.status || r.status === "AVAILABLE")
      : []),
    [riders]
  );

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", width: 520, borderRadius: 12, padding: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Assign Rider</h3>

        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          style={{
            width: "100%", height: 40, borderRadius: 8, border: "1px solid #ddd",
            padding: "0 10px", marginBottom: 16
          }}
        >
          <option value="" disabled>
            {availableRiders.length ? "Select an available rider" : "No available riders"}
          </option>
          {availableRiders.map((r) => (
            <option key={r.id} value={r.email}>
              {r.name || r.email} {r.zone ? `• ${r.zone}` : ""} {r.currentLoad ? `• Load ${r.currentLoad}` : ""}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 14px" }}>Cancel</button>
          <button
            onClick={() => onConfirm(selectedEmail)}
            disabled={!selectedEmail}
            style={{
              padding: "8px 14px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 8,
              border: 0,
              opacity: selectedEmail ? 1 : 0.6,
              cursor: selectedEmail ? "pointer" : "not-allowed"
            }}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRiderModal;
