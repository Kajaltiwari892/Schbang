export type MeetingCategory = "client" | "internal";

export interface Meeting {
  id: number;
  date: string;
  title: string;
  initiator: string;
  attendees: string[];
  time: string;
  isSynced: boolean;
  category?: MeetingCategory; // Optional for backward compatibility
}

// Category color mappings
export const categoryColors = {
  client: {
    bg: "bg-blue-500/20 dark:bg-blue-500/30",
    border: "border-blue-500/40",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-500",
    ring: "ring-blue-500/50",
  },
  internal: {
    bg: "bg-green-500/20 dark:bg-green-500/30",
    border: "border-green-500/40",
    text: "text-green-700 dark:text-green-300",
    badge: "bg-green-500",
    ring: "ring-green-500/50",
  },
};

// Initial meetings data
export const meetings: Meeting[] = [
  // September 2025
  {
    id: 1,
    date: "2025-09-29",
    title: "Team Sync",
    initiator: "Shubham",
    attendees: ["Rahul", "Rohit"],
    time: "10:00 AM - 11:00 AM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  {
    id: 2,
    date: "2025-09-29",
    title: "Client Meeting",
    initiator: "Akshita",
    attendees: ["Sam"],
    time: "2:00 PM - 3:00 PM",
    isSynced: false,
    category: "client" as MeetingCategory,
  },

  // October 2025
  {
    id: 10,
    date: "2025-10-01",
    title: "Daily Standup",
    initiator: "Shubham",
    attendees: ["Team"],
    time: "10:00 AM - 10:30 AM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  {
    id: 11,
    date: "2025-10-08",
    title: "Sprint Planning",
    initiator: "Shubham",
    attendees: ["Team"],
    time: "11:00 AM - 12:30 PM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  {
    id: 12,
    date: "2025-10-15",
    title: "UI/UX Review",
    initiator: "Kanchan",
    attendees: ["Design Team", "Frontend Team"],
    time: "2:00 PM - 3:30 PM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  {
    id: 13,
    date: "2025-10-22",
    title: "Client Demo",
    initiator: "Akshita",
    attendees: ["Client Team", "Product Owners"],
    time: "10:00 AM - 11:30 AM",
    isSynced: false,
    category: "client" as MeetingCategory,
  },
  {
    id: 14,
    date: "2025-10-31",
    title: "Monthly Review & Planning",
    initiator: "Gautami",
    attendees: ["Entire Team"],
    time: "4:00 PM - 5:30 PM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  // November 2025 meetings
  {
    id: 26,
    date: "2025-11-04",
    title: "Client Review",
    initiator: "Shubham",
    attendees: ["Rahul", "Akshita"],
    time: "2:00 PM - 3:00 PM",
    isSynced: false,
    category: "client" as MeetingCategory,
  },
  {
    id: 27,
    date: "2025-11-07",
    title: "Q4 Planning Session",
    initiator: "Shubham",
    attendees: ["Management", "Team Leads"],
    time: "10:00 AM - 12:00 PM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  {
    id: 28,
    date: "2025-11-14",
    title: "Technical Workshop",
    initiator: "Rahul",
    attendees: ["Development Team"],
    time: "1:00 PM - 3:00 PM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  {
    id: 29,
    date: "2025-11-21",
    title: "Product Strategy",
    initiator: "Akshita",
    attendees: ["Product Team", "Stakeholders"],
    time: "11:00 AM - 1:00 PM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
  {
    id: 30,
    date: "2025-11-28",
    title: "Team Building Activity",
    initiator: "Kanchan",
    attendees: ["All Employees"],
    time: "3:00 PM - 6:00 PM",
    isSynced: false,
    category: "internal" as MeetingCategory,
  },
];

// Load synced meetings from localStorage or initialize (client-side only)
export const loadMeetingsClient = (): Meeting[] => {
  if (typeof window === "undefined") return [];

  try {
    const savedMeetings = localStorage.getItem("meetings");
    if (savedMeetings) {
      const parsed = JSON.parse(savedMeetings);
      console.log(
        "📅 Loaded meetings from localStorage:",
        parsed.length,
        "meetings"
      );
      return parsed;
    }
    // If no saved meetings, initialize with default data
    console.log("📅 Initializing meetings with default data");
    localStorage.setItem("meetings", JSON.stringify(meetings));
    return meetings;
  } catch (error) {
    console.error("Error loading meetings from localStorage:", error);
    return meetings;
  }
};

// Function to update meetings in localStorage
const updateMeetings = (updatedMeetings: Meeting[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
    } catch (error) {
      console.error("Error saving meetings to localStorage:", error);
    }
  }
};

export const updateMeetingSyncStatus = (
  meetingId: number,
  isSynced: boolean
) => {
  const currentMeetings = loadMeetingsClient();
  const meetingIndex = currentMeetings.findIndex((m) => m.id === meetingId);
  if (meetingIndex !== -1) {
    const updatedMeetings = [...currentMeetings];
    updatedMeetings[meetingIndex] = {
      ...updatedMeetings[meetingIndex],
      isSynced,
    };
    updateMeetings(updatedMeetings);
    console.log("✅ Meeting synced:", meetingId, "isSynced:", isSynced);
    return updatedMeetings;
  }
  return currentMeetings;
};

// Helper function to clear all data (for debugging)
export const clearMeetingsData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("meetings");
    localStorage.removeItem("meetings_migrated_v2");
    console.log("🗑️ Cleared all meetings data");
  }
};
