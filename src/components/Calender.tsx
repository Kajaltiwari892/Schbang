"use client";

import { useState, useMemo, useEffect } from "react";
import MeetingModal from "./MeetingModal";
import { Button } from "@/components/ui/button";
import {
  formatDateLocal,
  getMonthDays,
  parseDateToLocal,
  isSameDay,
} from "@/utils/dateUtil";
import { Meeting, loadMeetingsClient } from "@/data/mockData";
import {
  ComputerDesktopIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function Calendar() {
  // Create stable today reference at midnight (local time)
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load meetings only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // One-time migration: clear old corrupted data
    if (typeof window !== 'undefined') {
      const migrated = localStorage.getItem('meetings_migrated_v2');
      if (!migrated) {
        localStorage.removeItem('meetings');
        localStorage.setItem('meetings_migrated_v2', 'true');
      }
    }
    
    setMeetings(loadMeetingsClient());
  }, []);

  const days = getMonthDays(currentYear, currentMonth); // returns Date[]

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  // Return meetings that fall on `day` (safe local compare)
  const meetingsForDay = (day: Date) =>
    meetings.filter((m) => {
      if (!m?.date) return false;
      return isSameDay(parseDateToLocal(m.date), day);
    });

  return (
    <div className="relative min-h-screen py-6 px-4 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#AAA995]/20 dark:bg-[#AAA995]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Calendar Container */}
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-[#0C0A09]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        {/* Month navigation */}
        <div className="flex justify-between items-center mb-4">
        <Button
          onClick={prevMonth}
          className="bg-[#AAA995] cursor-pointer hover:bg-[#AAA995]/90 text-white rounded-xl px-5 py-2 transition-all hover:scale-105"
        >
          Previous
        </Button>

        <h2 className="text-xl font-bold flex items-center gap-2 text-[#0C0A09] dark:text-white">
          <CalendarDaysIcon className="w-6 h-6" />
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <Button
          onClick={nextMonth}
          className="bg-[#AAA995] cursor-pointer hover:bg-[#AAA995]/90 text-white rounded-xl px-5 py-2 transition-all hover:scale-105"
        >
          Next
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-bold text-center text-[#AAA995] dark:text-[#AAA995]/80 text-sm py-1">
            {d}
          </div>
        ))}

        {/* Days */}
        {days.map((day) => {
          const dateStr = formatDateLocal(day); // 'YYYY-MM-DD' local
          const isToday = isSameDay(today, day);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const dayMeetings = meetingsForDay(day);
          const hasMeeting = dayMeetings.length > 0;

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`p-2 text-center cursor-pointer rounded-lg flex flex-col items-center justify-center min-h-[75px] gap-1 transition-all hover:scale-105 hover:shadow-lg
                ${!isCurrentMonth ? "opacity-40" : ""}
                ${
                  isToday
                    ? "bg-gradient-to-br from-[#AAA995] to-[#8B8A7A] text-white shadow-lg ring-2 ring-[#AAA995]/50"
                    : hasMeeting
                    ? "bg-[#AAA995]/20 dark:bg-[#AAA995]/30 border border-[#AAA995]/30"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                }`}
            >
              <span
                className={`text-base ${isToday ? "font-bold" : "font-semibold"} ${
                  !isCurrentMonth ? "opacity-70" : ""
                }`}
              >
                {isToday ? "Today" : day.getDate()}
              </span>

              {dayMeetings.length > 0 && (
                <div className="flex items-center gap-1 bg-white/50 dark:bg-black/30 px-1.5 py-0.5 rounded-full">
                  <ComputerDesktopIcon className="w-2.5 h-2.5" />
                  <span className="text-[11px] font-medium">
                    {dayMeetings.length}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      </div>

      {/* Meeting modal */}
      {selectedDate && (
        <MeetingModal
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            // Reload meetings to reflect any sync status changes
            setMeetings(loadMeetingsClient());
          }}
        />
      )}
    </div>
  );
}
