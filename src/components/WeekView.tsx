"use client";

import { motion } from "framer-motion";
import { Meeting, categoryColors } from "@/data/mockData";
import { parseDateToLocal, isSameDay, formatDateLocal } from "@/utils/dateUtil";
import { useState } from "react";
import MeetingModal from "./MeetingModal";

interface WeekViewProps {
  currentDate: Date;
  meetings: Meeting[];
  searchQuery: string;
  onMeetingsUpdate: () => void;
}

export default function WeekView({ currentDate, meetings, searchQuery, onMeetingsUpdate }: WeekViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const getMeetingsForDay = (day: Date) => {
    return meetings.filter((m) => {
      if (!m?.date) return false;
      return isSameDay(parseDateToLocal(m.date), day);
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      {/* Week grid - Horizontal scroll on mobile */}
      <div className="flex md:grid md:grid-cols-7 gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#AAA995] scrollbar-track-gray-200">
        {weekDays.map((day, index) => {
          const dayMeetings = getMeetingsForDay(day);
          const isToday = isSameDay(today, day);
          const dateStr = formatDateLocal(day);
          
          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className={`flex flex-col rounded-xl border-2 overflow-hidden min-w-[280px] md:min-w-0 snap-center ${
                isToday
                  ? "border-[#AAA995] shadow-lg"
                  : "border-[#AAA995]/20"
              }`}
            >
              {/* Day header */}
              <div
                className={`p-2 md:p-3 text-center ${
                  isToday
                    ? "bg-gradient-to-br from-[#AAA995] to-[#8B8A7A] text-white"
                    : "bg-[#AAA995]/10 dark:bg-[#AAA995]/20"
                }`}
              >
                <div className="text-xs md:text-sm font-semibold" suppressHydrationWarning>
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-lg md:text-2xl font-bold" suppressHydrationWarning>
                  {day.getDate()}
                </div>
              </div>

              {/* Meetings list */}
              <div className="flex-1 p-2 space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
                {dayMeetings.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center mt-4">No meetings</p>
                ) : (
                  dayMeetings.map((meeting, idx) => {
                    const category = meeting.category || 'internal';
                    const colors = categoryColors[category] || categoryColors.internal;
                    return (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-2 rounded-lg cursor-pointer border ${colors.bg} ${colors.border} hover:shadow-md transition-colors duration-200`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs md:text-sm font-semibold truncate">
                              {meeting.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 truncate">
                              {meeting.time}
                            </p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${colors.badge} flex-shrink-0 mt-1`}></div>
                        </div>
                        <div className="mt-1">
                          <span className={`text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full ${colors.text} ${colors.bg} border ${colors.border} font-medium`}>
                            {category}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedDate && (
        <MeetingModal
          date={selectedDate}
          searchQuery={searchQuery}
          onClose={() => {
            setSelectedDate(null);
            onMeetingsUpdate();
          }}
        />
      )}
    </div>
  );
}
