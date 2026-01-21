"use client";

import { useEffect, useState } from "react";
import { ZODIACS } from "@/lib/zodiac";

export default function HoroscopeCard() {
  const [zodiac, setZodiac] = useState("aries");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const zodiacInfo = ZODIACS.find((z) => z.key === zodiac);

  useEffect(() => {
    async function loadHoroscope(z) {
      setLoading(true);
      const res = await fetch(`/api/horoscope?zodiac=${z}&date=${today}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    loadHoroscope(zodiac);
  }, [zodiac]);

  return (
    <article className="max-w-md bg-white shadow border rounded-lg p-4 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">
          आज का राशिफल |{" "}
          {new Date().toLocaleDateString("hi-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h3>

      </div>


      {/* Zodiac Info */}
      <div className="flex items-center gap-3 mb-3 border-b pb-3">
        {zodiacInfo?.image && (
          <img
            src={zodiacInfo.image.src}
            alt={zodiacInfo.en}
            className="h-16 w-16 rounded-full object-cover"
          />
        )}
        <select
        value={zodiac}
        onChange={(e) => setZodiac(e.target.value)}
        className="w-full rounded py-2"
      >
        {ZODIACS.map((z) => (
          <option key={z.key} value={z.key} >
            {z.hi} | ({z.en})
          </option>
        ))}
      </select>
      </div>

      {/* Content */}
  
        <div className="text-sm text-gray-700 leading-relaxed">
          {loading && <p>लोड हो रहा है...</p>}
          {!loading && !data && <p>आज का राशिफल उपलब्ध नहीं है।</p>}
          {!loading && data && <p>{data.content_hi}</p>}
        </div>
    </article>
  );
}
