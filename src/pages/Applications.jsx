import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Applications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase.from("students").select("academic");

    if (!error && data) {
      // Group by country
      const grouped = {};

      data.forEach((s) => {
        const country = s.academic?.preferredCountry || "Unknown";

        if (!grouped[country]) {
          grouped[country] = 0;
        }

        grouped[country] += 1;
      });

      const formatted = Object.keys(grouped).map((key) => ({
        country: key,
        count: grouped[key],
      }));

      setData(formatted);
    } else {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>🌍 Applications by Country</h2>

      <div style={{ marginTop: "20px" }}>
        {data.length === 0 ? (
          <p>No data available</p>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                marginBottom: "10px",
                background: "#1e293b",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                color: "#fff",
              }}
            >
              <span>{item.country}</span>
              <strong>{item.count}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
