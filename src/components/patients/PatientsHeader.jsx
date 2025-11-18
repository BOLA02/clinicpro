"use client";

import React, { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


export function PatientsHeader() {
  
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <button className="px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-2 flex-shrink-0">
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filter</span>
            </button>
          </div>

         
        </div>
      </div>

      
    </>
  );
}
