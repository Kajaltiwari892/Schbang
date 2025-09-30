"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
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
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load meetings
  useEffect(() => {
    setIsClient(true);
    setMeetings(loadMeetingsClient());
  }, []);

  const days = getMonthDays(currentYear, currentMonth);

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

  const meetingsForDay = (day: Date) =>
    meetings.filter((m) => {
      if (!m?.date) return false;
      return isSameDay(parseDateToLocal(m.date), day);
    });

  return (
    <div className="relative min-h-screen py-4 md:py-6 px-2 md:px-4 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#949382]/30 dark:bg-[#949382]/20 rounded-full blur-3xl animate-float shadow-[0_0_80px_40px_rgba(148,147,130,0.3)]" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#949382]/25 dark:bg-[#949382]/15 rounded-full blur-3xl animate-float-delayed shadow-[0_0_100px_50px_rgba(148,147,130,0.25)]" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#949382]/28 dark:bg-[#949382]/18 rounded-full blur-3xl animate-float-slow shadow-[0_0_90px_45px_rgba(148,147,130,0.28)]" />
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-[#949382]/32 dark:bg-[#949382]/22 rounded-full blur-3xl animate-float shadow-[0_0_70px_35px_rgba(148,147,130,0.32)]" />
      </div>

      {/* Calendar Container - Calendar-like design */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.8 },
          scale: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        className="max-w-4xl mx-auto bg-white/90 dark:bg-[#0C0A09]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border-4 border-[#AAA995]/30 dark:border-[#AAA995]/20 overflow-hidden"
      >
        {/* Calendar Top Binding */}
        <div className="bg-gradient-to-r from-[#AAA995] to-[#8B8A7A] h-8 md:h-10 flex items-center justify-center gap-4 md:gap-8 relative">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white/30 rounded-full ring-2 ring-white/50"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white/30 rounded-full ring-2 ring-white/50"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white/30 rounded-full ring-2 ring-white/50"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white/30 rounded-full ring-2 ring-white/50"></div>
        </div>

        <div className="p-4 md:p-6">
          {/* Month navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mb-4"
          >
            {/* Month/Year Title */}
            <h2 className="text-lg md:text-xl font-bold flex items-center justify-center gap-2 text-[#0C0A09] dark:text-white mb-3">
              <CalendarDaysIcon className="w-5 h-5 md:w-6 md:h-6" />
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-2">
              <Button
                onClick={prevMonth}
                className="bg-[#AAA995] cursor-pointer hover:bg-[#AAA995]/90 text-white rounded-xl px-3 md:px-5 py-2 transition-all hover:scale-105 flex-1 md:flex-none"
              >
                Previous
              </Button>

              <Button
                onClick={nextMonth}
                className="bg-[#7c7b6e] cursor-pointer hover:bg-[#7c7b6e]/90 text-white rounded-xl px-3 md:px-5 py-2 transition-all hover:scale-105 shadow-lg flex-1 md:flex-none"
              >
                Next
              </Button>
            </div>
          </motion.div>

          {/* Weekday headers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="grid grid-cols-7 gap-1 md:gap-2"
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + i * 0.05,
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-bold text-center text-[#AAA995] dark:text-[#AAA995]/80 text-xs md:text-sm py-1"
              >
                {d}
              </motion.div>
            ))}

            {/* Days */}
            {days.map((day, index) => {
              const dateStr = formatDateLocal(day);
              const isToday = isSameDay(today, day);
              const isCurrentMonth = day.getMonth() === currentMonth;
              const dayMeetings = meetingsForDay(day);
              const hasMeeting = dayMeetings.length > 0;

              return (
                <motion.div
                  key={dateStr}
                  initial={{ opacity: 0, scale: 0.8, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 0.9 + index * 0.015,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    scale: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    transition: {
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-1.5 md:p-2 text-center cursor-pointer rounded-lg flex flex-col items-center justify-center min-h-[60px] md:min-h-[75px] gap-0.5 md:gap-1 transition-all hover:shadow-lg
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
                    className={`text-sm md:text-base ${
                      isToday ? "font-bold" : "font-semibold"
                    } ${!isCurrentMonth ? "opacity-70" : ""}`}
                  >
                    {isToday ? "Today" : day.getDate()}
                  </span>

                  {dayMeetings.length > 0 && (
                    <div className="flex items-center gap-0.5 md:gap-1 bg-white/50 dark:bg-black/30 px-1 md:px-1.5 py-0.5 rounded-full">
                      <ComputerDesktopIcon className="w-2 md:w-2.5 h-2 md:h-2.5" />
                      <span className="text-[10px] md:text-[11px] font-medium">
                        {dayMeetings.length}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Meeting modal */}
      {selectedDate && (
        <MeetingModal
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);

            setMeetings(loadMeetingsClient());
          }}
        />
      )}
    </div>
  );
}
