import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./application.css";

// ── Add your images in src/assets/countries/ ──
// Uncomment and add the ones you have:

// import chinaImg      from "../assets/countries/china.jpg";
// import australiaImg  from "../assets/countries/australia.jpg";
import ukImg from "../assets/images/UK.jpg";
// import usaImg        from "../assets/countries/usa.jpg";
// import canadaImg     from "../assets/countries/canada.jpg";
// import germanyImg    from "../assets/countries/germany.jpg";
// import japanImg      from "../assets/countries/japan.jpg";
// import indiaImg      from "../assets/countries/india.jpg";
// import franceImg     from "../assets/countries/france.jpg";
// import newzealandImg from "../assets/countries/newzealand.jpg";

// ── Map country name (lowercase) → { image, flag } ──
// Add/remove entries to match your data
const COUNTRY_META = {
  china: { image: null, flag: "🇨🇳" },
  australia: { image: null, flag: "🇦🇺" },
  uk: { image: ukImg, flag: "🇬🇧" },
  "united kingdom": { image: null, flag: "🇬🇧" },
  usa: { image: null, flag: "🇺🇸" },
  "united states": { image: null, flag: "🇺🇸" },
  canada: { image: null, flag: "🇨🇦" },
  germany: { image: null, flag: "🇩🇪" },
  japan: { image: null, flag: "🇯🇵" },
  india: { image: null, flag: "🇮🇳" },
  france: { image: null, flag: "🇫🇷" },
  "new zealand": { image: null, flag: "🇳🇿" },
  nepal: { image: null, flag: "🇳🇵" },
  malaysia: { image: null, flag: "🇲🇾" },
  singapore: { image: null, flag: "🇸🇬" },
  "south korea": { image: null, flag: "🇰🇷" },
  uae: { image: null, flag: "🇦🇪" },
  // When you add images, replace null with the imported variable:
  // china: { image: chinaImg, flag: "🇨🇳" },
};

function getCountryMeta(countryName) {
  const key = countryName?.toLowerCase().trim();
  return COUNTRY_META[key] || null;
}

export default function Applications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("academic");

    if (!error && data) {
      const grouped = {};
      data.forEach((s) => {
        const country = s.academic?.preferredCountry || "Unknown";
        if (!grouped[country]) grouped[country] = 0;
        grouped[country] += 1;
      });

      const formatted = Object.keys(grouped)
        .map((key) => ({ country: key, count: grouped[key] }))
        .sort((a, b) => b.count - a.count); // highest first

      setData(formatted);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  const totalApplications = data.reduce((s, d) => s + d.count, 0);
  const maxCount = data.length > 0 ? Math.max(...data.map((d) => d.count)) : 1;

  return (
    <div className="country-section">
      <h2 className="country-section-title">Applications by Country</h2>

      {!loading && data.length > 0 && (
        <p className="country-section-sub">
          {data.length} {data.length === 1 ? "country" : "countries"}{" "}
          &nbsp;·&nbsp; {totalApplications} total applications
        </p>
      )}

      {loading ? (
        <div className="country-grid">
          {[...Array(4)].map((_, i) => (
            <div className="country-card country-card-skeleton" key={i} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="country-empty">No data available</div>
      ) : (
        <div className="country-grid">
          {data.map((item, index) => {
            const meta = getCountryMeta(item.country);
            const barWidth = Math.round((item.count / maxCount) * 100);

            return (
              <div className="country-card" key={index}>
                {/* Image or emoji fallback */}
                {meta?.image ? (
                  <img
                    className="country-card-image"
                    src={meta.image}
                    alt={item.country}
                  />
                ) : (
                  <div className="country-card-image-fallback">
                    {meta?.flag || "🌍"}
                  </div>
                )}

                <div className="country-card-body">
                  <div className="country-card-top">
                    <span className="country-card-name">{item.country}</span>
                    <span className="country-card-flag">
                      {meta?.flag || "🌍"}
                    </span>
                  </div>

                  <div className="country-card-count">
                    <div className="count-bar-track">
                      <div
                        className="count-bar-fill"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="count-number">{item.count}</span>
                  </div>

                  <div className="count-label">
                    {item.count === 1 ? "application" : "applications"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
