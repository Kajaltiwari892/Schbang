"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { meetings as mockMeetings } from "@/data/mockData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MeetingModalProps {
  date: string;
  onClose: () => void;
}

export default function MeetingModal({ date, onClose }: MeetingModalProps) {
  const [meetings, setMeetings] = useState(
    mockMeetings.filter((m) => m.date === date)
  );
  const [loading, setLoading] = useState(false);

  const handleSync = (id: number) => {
    setLoading(true);
    setTimeout(() => {
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isSynced: true } : m))
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meetings on {date}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {meetings.length === 0 ? (
            <p>No meetings scheduled for this date.</p>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{meeting.title}</h3>
                  <p>By: {meeting.initiator}</p>
                  <p>Attendees: {meeting.attendees.join(", ")}</p>
                  <p>Time: {meeting.time}</p>
                </div>
                <div>
                  {meeting.isSynced ? (
                    <span className="text-green-600 font-bold">✓ Synced</span>
                  ) : (
                    <Button
                      disabled={loading}
                      onClick={() => handleSync(meeting.id)}
                    >
                      {loading ? "Syncing..." : "Sync"}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
