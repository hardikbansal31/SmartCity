"use client";

import { useEffect, useState, useRef } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

export default function AutoCompleteInput({ placeholder, value, setValue }) {
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const provider = new OpenStreetMapProvider();
  const containerRef = useRef(null);

  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const results = await provider.search({ query: value });
      setSuggestions(results);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

  // Hide dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onFocus={() => setFocused(true)}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />
      {focused && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            margin: 0,
            padding: 0,
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                setValue(s.label);
                setFocused(false);
              }}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
