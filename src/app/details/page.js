// app/details/page.js
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function detailsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
            <Image src="" alt="Worker Avatar" layout="fill" objectFit="cover" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              Unknown Worker
            </h3>
            <p className="text-sm text-gray-500">Helper</p>
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-gray-500">Online</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">Rating: </span>
            </div>
          </div>

          <div className="text-right">
            <button className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm">
              Contact
            </button>
          </div>
        </div>

        {/* SERVICES LIST */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-start justify-between mb-3 mt-5">
          <div>
            <h4 className="text-md font-medium text-gray-800">Consultation</h4>
            <button className="mt-2 text-xs px-3 py-1 rounded-full border bg-white border-gray-300 text-gray-700">
              Show
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">₹100</div>
            </div>

            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
              {/* empty circle just like your sketch */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
