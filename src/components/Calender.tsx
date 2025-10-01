"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import MeetingModal from "./MeetingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatDateLocal,
  getMonthDays,
  parseDateToLocal,
  isSameDay,
} from "@/utils/dateUtil";
import { Meeting, loadMeetingsClient, categoryColors } from "@/data/mockData";
import WeekView from "./WeekView";
import DayView from "./DayView";
import {
  ComputerDesktopIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function Calendar() {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentDay, setCurrentDay] = useState(today.getDate());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Load meetings
  useEffect(() => {
    setIsClient(true);
    setMeetings(loadMeetingsClient());
  }, []);

  // Calculate these before any conditional returns
  const days = getMonthDays(currentYear, currentMonth);
  const currentDate = new Date(currentYear, currentMonth, currentDay);
  
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

  const prevPeriod = () => {
    if (viewMode === 'month') {
      prevMonth();
    } else if (viewMode === 'week') {
      const newDate = new Date(currentYear, currentMonth, currentDay);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      setCurrentDay(newDate.getDate());
    } else {
      const newDate = new Date(currentYear, currentMonth, currentDay);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      setCurrentDay(newDate.getDate());
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      nextMonth();
    } else if (viewMode === 'week') {
      const newDate = new Date(currentYear, currentMonth, currentDay);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      setCurrentDay(newDate.getDate());
    } else {
      const newDate = new Date(currentYear, currentMonth, currentDay);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      setCurrentDay(newDate.getDate());
    }
  };

  // Filter meetings based on search query
  const filteredMeetings = useMemo(() => {
    if (!searchQuery.trim()) return meetings;
    
    const query = searchQuery.toLowerCase();
    return meetings.filter((meeting) => {
      const titleMatch = meeting.title.toLowerCase().includes(query);
      const attendeeMatch = meeting.attendees.some((attendee) =>
        attendee.toLowerCase().includes(query)
      );
      const initiatorMatch = meeting.initiator.toLowerCase().includes(query);
      return titleMatch || attendeeMatch || initiatorMatch;
    });
  }, [meetings, searchQuery]);

  const meetingsForDay = (day: Date) =>
    filteredMeetings.filter((m) => {
      if (!m?.date) return false;
      return isSameDay(parseDateToLocal(m.date), day);
    });

  // Show loading state while client is initializing
  if (!isClient) {
    return (
      <div className="relative min-h-screen py-4 md:py-6 px-2 md:px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AAA995] mx-auto"></div>
          <p className="mt-4 text-[#AAA995]">Loading calendar...</p>
        </div>
      </div>
    );
  }

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
        className="w-full max-w-3xl mx-auto bg-white/90 dark:bg-[#0C0A09]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border-4 border-[#AAA995]/30 dark:border-[#AAA995]/20 overflow-hidden"
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
            className="mb-3 md:mb-4"
          >
            {/* Month/Year Title */}
            <h2 className="text-lg md:text-xl font-bold flex items-center justify-center gap-2 text-[#0C0A09] dark:text-white mb-2 md:mb-3">
              <CalendarDaysIcon className="w-5 h-5 md:w-6 md:h-6" />
              <span suppressHydrationWarning>
                {viewMode === 'day' 
                  ? currentDate.toLocaleString("default", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : new Date(currentYear, currentMonth).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
              </span>
            </h2>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-2 px-1">
              <Button
                onClick={prevPeriod}
                className="bg-[#AAA995] cursor-pointer hover:bg-[#8B8A7A] text-white rounded-lg md:rounded-xl px-4 md:px-5 py-1 md:py-2 text-sm transition-colors duration-200 flex-1 md:flex-none"
              >
                Previous
              </Button>

              <Button
                onClick={nextPeriod}
                className="bg-[#7c7b6e] cursor-pointer hover:bg-[#6a6960] text-white rounded-lg md:rounded-xl px-4 md:px-5 py-1 md:py-2 text-sm transition-colors duration-200 shadow-lg flex-1 md:flex-none"
              >
                Next
              </Button>
            </div>
          </motion.div>

          {/* View Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mb-3 md:mb-4"
          >
            <div className="flex justify-center gap-1.5 md:gap-2">
              <Button
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl transition-colors duration-200 ${
                  viewMode === 'month'
                    ? 'bg-[#AAA995] text-white'
                    : 'bg-[#AAA995]/20 text-[#AAA995] hover:bg-[#AAA995]/30'
                }`}
              >
                <Squares2X2Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Month</span>
              </Button>
              <Button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl transition-colors duration-200 ${
                  viewMode === 'week'
                    ? 'bg-[#AAA995] text-white'
                    : 'bg-[#AAA995]/20 text-[#AAA995] hover:bg-[#AAA995]/30'
                }`}
              >
                <ViewColumnsIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Week</span>
              </Button>
              <Button
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl transition-colors duration-200 ${
                  viewMode === 'day'
                    ? 'bg-[#AAA995] text-white'
                    : 'bg-[#AAA995]/20 text-[#AAA995] hover:bg-[#AAA995]/30'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Day</span>
              </Button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mb-3 md:mb-4"
          >
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#AAA995]" />
              <Input
                type="text"
                placeholder="Search by title or attendee name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-[#0C0A09]/80 border-[#AAA995]/30 focus:border-[#AAA995] focus:ring-[#AAA995]/20 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAA995] hover:text-[#7c7b6e] transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Legend */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mb-3 md:mb-4"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs">
              {Object.entries(categoryColors).map(([category, colors]) => (
                <div key={category} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.badge}`}></div>
                  <span className="capitalize text-gray-700 dark:text-gray-300">{category}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Conditional View Rendering */}
          {viewMode === 'month' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="grid grid-cols-7 gap-1.5 md:gap-2"
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
                
                // Check if date is in the past
                const isPastDate = day < today && !isToday;

                // Get category colors for the day
                const categoryDots = dayMeetings.reduce((acc, meeting) => {
                  const category = meeting.category || 'internal'; // Fallback to 'internal' if no category
                  if (!acc[category]) {
                    acc[category] = { count: 0, color: categoryColors[category]?.badge || 'bg-gray-500' };
                  }
                  acc[category].count++;
                  return acc;
                }, {} as Record<string, { count: number; color: string }>);

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
                    whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                    onClick={() => setSelectedDate(dateStr)}
                    className={` aspect-square p-0.5 md:p-1 text-center rounded-md flex flex-col items-center justify-center gap-0.5 transition-shadow duration-200 cursor-pointer hover:shadow-lg
                  ${!isCurrentMonth ? "opacity-40" : ""}
                  ${
                    isToday
                      ? "bg-gradient-to-br from-[#AAA995] to-[#8B8A7A] text-white shadow-lg ring-2 ring-[#AAA995]/50"
                      : isPastDate && hasMeeting
                      ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                      : hasMeeting
                      ? "bg-[#AAA995]/20 dark:bg-[#AAA995]/30 border border-[#AAA995]/30"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                  }`}
                  >
                    <span
                      className={`text-xs md:text-sm ${
                        isToday ? "font-bold" : "font-semibold"
                      } ${!isCurrentMonth ? "opacity-70" : ""}`}
                    >
                      {/* Show date number on mobile, "Today" on desktop */}
                      <span className="md:hidden">{day.getDate()}</span>
                      <span className="hidden md:inline">
                        {isToday ? "Today" : day.getDate()}
                      </span>
                    </span>

                    {dayMeetings.length > 0 && (
                      <div className="flex  items-center justify-center gap-0.5 w-full mt-0.5">
                        {/* Mobile: Only count, Desktop: Count + dots */}
                        <div className="flex items-center gap-0.5 bg-white/50 dark:bg-black/30 px-0.5 py-0.5 rounded-full">
                          <ComputerDesktopIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          <span className="text-[8px] md:text-[9px] font-medium">
                            {dayMeetings.length}
                          </span>
                        </div>
                        {/* Show dots only on desktop */}
                        <div className="hidden md:flex gap-0.5 items-center">
                          {Object.entries(categoryDots).map(
                            ([category, data]) => (
                              <div
                                key={category}
                                className={`w-1.5 h-1.5 rounded-full ${data.color}`}
                                title={`${data.count} ${category} meeting(s)`}
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              meetings={filteredMeetings}
              searchQuery={searchQuery}
              onMeetingsUpdate={() => setMeetings(loadMeetingsClient())}
            />
          )}

          {viewMode === 'day' && (
            <DayView
              currentDate={currentDate}
              meetings={filteredMeetings}
            />
          )}
        </div>
      </motion.div>

      {/* Meeting modal */}
      {selectedDate && (
        <MeetingModal
          date={selectedDate}
          searchQuery={searchQuery}
          onClose={() => {
            setSelectedDate(null);

            setMeetings(loadMeetingsClient());
          }}
        />
      )}
    </div>
  );
}
