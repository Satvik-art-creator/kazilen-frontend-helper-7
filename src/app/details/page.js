"use client"

import React, { useState } from "react";
import { Star, Edit2, Check, X } from "lucide-react";

export default function WorkerDetails() {
  const [services, setServices] = useState([
    { id: 1, name: "Consultation", price: 100, open: false, editing: false, temp: "100" },
    { id: 2, name: "Fixed Charge", price: 600, open: false, editing: false, temp: "600" },
    { id: 3, name: "Book by Hour", price: 80, open: false, editing: false, temp: "80" },
  ]);

  const worker = {
    name: "Rajesh Kumar",
    role: "Helper",
    rating: 4.6,
    image: "https://i.pravatar.cc/150?img=12",
  };

  const toggleOpen = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, open: !s.open } : s
      )
    );
  };

  const startEdit = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, editing: true, temp: s.price.toString() } : s
      )
    );
  };

  const cancelEdit = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, editing: false, temp: s.price.toString() } : s
      )
    );
  };

  const saveEdit = (id) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const val = parseFloat(s.temp);
          if (!isNaN(val) && val > 0) {
            return { ...s, price: val, editing: false };
          }
          return { ...s, editing: false };
        }
        return s;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-lg space-y-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="rounded-2xl bg-white px-6 py-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {worker.name}
              </h1>
              <p className="text-sm text-slate-500">{worker.role}</p>
            </div>

            <div className="relative flex flex-col items-center">
                <img
                  src={worker.image}
                  alt="profile"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-200"
                />
              <div className="mt-1 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 shadow">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {worker.rating}
              </div>
            </div>
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="mx-auto w-full max-w-md space-y-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl bg-white px-6 py-5 shadow-md transition-transform duration-300 ease-out motion-safe:transform-gpu hover:scale-105 hover:shadow-lg"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-slate-900">
                    {s.name}
                  </h3>

                  {/* PRICE / EDIT */}
                  {!s.editing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-indigo-600">
                        ₹{s.price}
                      </span>
                      <button
                        onClick={() => startEdit(s.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={s.temp}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((x) =>
                              x.id === s.id ? { ...x, temp: e.target.value } : x
                            )
                          )
                        }
                        className="w-24 rounded-lg border border-indigo-300 px-2 py-1 text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(s.id)}
                        className="rounded-md bg-indigo-600 p-1.5 text-white"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => cancelEdit(s.id)}
                        className="rounded-md bg-slate-200 p-1.5 text-slate-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* SHOW BUTTON */}
                <button
                  onClick={() => toggleOpen(s.id)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    s.open
                      ? "bg-slate-200 text-slate-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {s.open ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
