"use client";

import { motion } from "framer-motion";
import { Meeting, categoryColors } from "@/data/mockData";
import { parseDateToLocal, isSameDay } from "@/utils/dateUtil";
import { ClockIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";

interface DayViewProps {
  currentDate: Date;
  meetings: Meeting[];
}

export default function DayView({ currentDate, meetings }: DayViewProps) {
  const dayMeetings = meetings.filter((m) => {
    if (!m?.date) return false;
    return isSameDay(parseDateToLocal(m.date), currentDate);
  });

  // Sort meetings by time
  const sortedMeetings = [...dayMeetings].sort((a, b) => {
    const timeA = a.time.split(" - ")[0];
    const timeB = b.time.split(" - ")[0];
    return timeA.localeCompare(timeB);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = isSameDay(today, currentDate);

  return (
    <div className="space-y-4">
      {/* Day header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 md:p-6 rounded-2xl text-center ${
          isToday
            ? "bg-gradient-to-br from-[#AAA995] to-[#8B8A7A] text-white"
            : "bg-[#AAA995]/10 dark:bg-[#AAA995]/20"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold" suppressHydrationWarning>
          {currentDate.toLocaleString("default", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h2>
        <p className="text-sm md:text-base mt-2 opacity-90">
          {sortedMeetings.length} {sortedMeetings.length === 1 ? "meeting" : "meetings"} scheduled
        </p>
      </motion.div>

      {/* Meetings timeline */}
      <div className="space-y-3">
        {sortedMeetings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            <p className="text-lg">No meetings scheduled for this day</p>
          </motion.div>
        ) : (
          sortedMeetings.map((meeting, index) => {
            const category = meeting.category || 'internal';
            const colors = categoryColors[category] || categoryColors.internal;
            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`p-4 md:p-6 rounded-xl border-l-4 ${colors.border} ${colors.bg} hover:shadow-lg transition-shadow duration-200`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.badge} mt-1.5 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold mb-2">{meeting.title}</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm md:text-base">
                            <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-[#AAA995]" />
                            <span>{meeting.time}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm md:text-base">
                            <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-[#AAA995]" />
                            <span>Organized by: <strong>{meeting.initiator}</strong></span>
                          </div>
                          
                          <div className="flex items-start gap-2 text-sm md:text-base">
                            <UserGroupIcon className="w-4 h-4 md:w-5 md:h-5 text-[#AAA995] mt-0.5" />
                            <div className="flex-1">
                              <span className="block">Attendees:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {meeting.attendees.map((attendee, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-white/50 dark:bg-black/30 rounded-full text-xs"
                                  >
                                    {attendee}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${colors.text} ${colors.bg} border ${colors.border} capitalize`}>
                      {category}
                    </span>
                    {meeting.isSynced && (
                      <span className="text-green-600 font-bold text-sm">✓ Synced</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
