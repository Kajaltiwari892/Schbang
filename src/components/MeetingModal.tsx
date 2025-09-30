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
} from "@/data/mockData";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { parseDateToLocal, isSameDay, formatDateLocal } from "@/utils/dateUtil";
import { motion, AnimatePresence } from "framer-motion";

interface MeetingModalProps {
  date: string;
  onClose: () => void;
}

export default function MeetingModal({ date, onClose }: MeetingModalProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  // Load meetings for the selected date (client-side only)
  useEffect(() => {
    const allMeetings = loadMeetingsClient();
    const selected = parseDateToLocal(date);
    const meetingsForDate = allMeetings.filter((m) =>
      isSameDay(parseDateToLocal(m.date), selected)
    );
    setMeetings(meetingsForDate);
  }, [date]);

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
          </DialogTitle>
        </DialogHeader>

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
              {meetings.map((meeting, index) => (
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
                  className="p-3 border rounded flex justify-between items-center"
                >
                <div>
                  <h3 className="font-bold">{meeting.title}</h3>
                  <p className="text-sm">By: {meeting.initiator}</p>
                  <p className="text-sm">
                    Attendees: {meeting.attendees.join(", ")}
                  </p>
                  <p className="text-sm">Time: {meeting.time}</p>
                </div>

                <div>
                  {meeting.isSynced ? (
                    <span className="text-green-600 font-bold">✓ Synced</span>
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
              ))}
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
