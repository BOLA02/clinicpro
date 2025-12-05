import { ActivityIcon, BrainIcon, EyeIcon, HeartIcon } from "lucide-react";

export const TIMESLOTS = [ 
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];


export const DAYS_OF_WEEK = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 0, name: "Sunday" },
];



export const services = [
  {
    icon: HeartIcon,
    title: "Cardiology",
    description: "Expert heart care and preventive cardiovascular services for all ages.",
  },
  {
    icon: BrainIcon,
    title: "Neurology",
    description: "Comprehensive neurological treatments and specialized brain care.",
  },
  {
    icon: ActivityIcon,
    title: "General Practice",
    description: "Routine checkups, preventive care, and general health management.",
  },
  {
    icon: EyeIcon,
    title: "Ophthalmology",
    description: "Vision care, eye exams, and advanced eye treatment options.",
  },
];

