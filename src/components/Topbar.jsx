"use client";

import { useEffect, useState } from "react";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  const [dateTime, setDateTime] = useState("");
  const [user, setUser] = useState(null);

  // ✔ Load user function
  
  // ✔ Run once AND listen for login/logout event
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
  
      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
      }
    }
    loadUser();

    const handler = () => loadUser();
    window.addEventListener("auth-change", handler);

    return () => window.removeEventListener("auth-change", handler);
  }, []);

  // Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  };

  // Auto time update
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(
        now.toLocaleDateString("hi-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
          " | " +
          now.toLocaleTimeString("hi-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-green-700 text-sm text-white py-1 px-5 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-medium">🌐 हिन्दी न्यूज़</span>
          <span className="hidden sm:block">{dateTime}</span>
        </div>

        <div className="flex items-center gap-4">

          {/* Login Button */}
          {!user && (
            <Link href="/login" className="px-3 py-1 bg-orange-600 text-white rounded">
              Login
            </Link>
          )}

          {/* Logged-in state */}
          {user && (
            <>
              {(user.role === "writer" || user.role === "admin") && (
                <>
                <Link href="/" className="px-3 py-1 bg-indigo-600 text-white rounded">
                  Home
                </Link>
                <Link href="/dashboard" className="px-3 py-1 bg-indigo-600 text-white rounded">
                  Dashboard
                </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
