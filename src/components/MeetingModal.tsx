"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Meeting,
  loadMeetingsClient,
  updateMeetingSyncStatus,
  categoryColors,
} from "@/data/mockData";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { parseDateToLocal, isSameDay, formatDateLocal } from "@/utils/dateUtil";
import { motion, AnimatePresence } from "framer-motion";

interface MeetingModalProps {
  date: string;
  onClose: () => void;
  searchQuery?: string;
}

export default function MeetingModal({ date, onClose, searchQuery = "" }: MeetingModalProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  // Check if the selected date is in the past
  const selectedDate = parseDateToLocal(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastDate = selectedDate < today;

  // Load meetings for the selected date (client-side only)
  useEffect(() => {
    const allMeetings = loadMeetingsClient();
    const selected = parseDateToLocal(date);
    let meetingsForDate = allMeetings.filter((m) =>
      isSameDay(parseDateToLocal(m.date), selected)
    );

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      meetingsForDate = meetingsForDate.filter((meeting) => {
        const titleMatch = meeting.title.toLowerCase().includes(query);
        const attendeeMatch = meeting.attendees.some((attendee) =>
          attendee.toLowerCase().includes(query)
        );
        const initiatorMatch = meeting.initiator.toLowerCase().includes(query);
        return titleMatch || attendeeMatch || initiatorMatch;
      });
    }

    setMeetings(meetingsForDate);
  }, [date, searchQuery]);

  const handleSync = async (id: number) => {
    // Set loading state for this specific meeting
    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      // Simulate API call (or call real API)
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updated = updateMeetingSyncStatus(id, true);

      // Re-filter for the same selected date (safe compare)
      const selected = parseDateToLocal(date);
      const meetingsForDate = updated.filter((m) =>
        isSameDay(parseDateToLocal(m.date), selected)
      );
      setMeetings(meetingsForDate);
    } catch (error) {
      console.error("Failed to sync meeting:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogTrigger>Meetings</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Meetings on {formatDateLocal(parseDateToLocal(date))}
            {isPastDate && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                (Past Date)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isPastDate && meetings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200"
          >
            <p className="font-medium">⏰ The meeting is over now</p>
            <p className="text-xs mt-1 opacity-80">This meeting date has passed and cannot be modified.</p>
          </motion.div>
        )}

        <div className="space-y-4 mt-2">
          {meetings.length === 0 ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              No meetings scheduled for this date.
            </motion.p>
          ) : (
            <AnimatePresence mode="popLayout">
              {meetings.map((meeting, index) => {
                const category = meeting.category || 'internal';
                const colors = categoryColors[category] || categoryColors.internal;
                return (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, x: -15, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 15, scale: 0.96 }}
                    transition={{ 
                      delay: index * 0.08,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    className={`p-3 border-l-4 ${colors.border} ${colors.bg} rounded flex justify-between items-start gap-3`}
                  >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-base">{meeting.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.text} ${colors.bg} border ${colors.border} capitalize`}>
                        {category}
                      </span>
                    </div>
                    <p className="text-sm">By: {meeting.initiator}</p>
                    <p className="text-sm">
                      Attendees: {meeting.attendees.join(", ")}
                    </p>
                    <p className="text-sm">Time: {meeting.time}</p>
                  </div>

                  <div className="flex-shrink-0">
                    {meeting.isSynced ? (
                      <span className="text-green-600 font-bold">✓ Synced</span>
                    ) : isPastDate ? (
                      <span className="text-gray-400 text-xs">Past</span>
                    ) : (
                      <Button
                        disabled={loading[meeting.id] || false}
                        onClick={() => handleSync(meeting.id)}
                      >
                        {loading[meeting.id] ? "Syncing..." : "Sync"}
                      </Button>
                    )}
                  </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
