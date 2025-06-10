import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZKbtmIY_GcwKzFe6T71AqZozyXzkKfllQ_h_qXeD6zTj6gaLEetZwzAdBhLJTOmwHCVjH8oAbnUO5/pub?gid=242990310&single=true&output=csv";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => res.text())
      .then(text => {
        const rows = text.split("\n").slice(1);
        const parsed = rows.map(row => {
          const [nombre, porcentaje, imagen] = row.split(",");
          return {
            nombre,
            porcentaje: parseFloat(porcentaje),
            imagen: imagen?.trim()
          };
        }).filter(e => !isNaN(e.porcentaje));

        parsed.sort((a, b) => b.porcentaje - a.porcentaje);
        setData(parsed);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Intención de Voto - Región Caribe (Oposición)</h1>
      <ResponsiveContainer width="100%" height={60 * data.length}>
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 50, left: 100, bottom: 10 }}>
          <XAxis type="number" domain={[0, 20]} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="nombre" tick={{ fontSize: 14 }} width={150} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="porcentaje" fill="#d4af37">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#d4af37" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "40px" }}>
        {data.map((item, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <img src={item.imagen} alt={item.nombre} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} />
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>{item.nombre}</p>
            <p>{item.porcentaje}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
