export interface UserProfile {
  name: string;
  ageRange: "middle-school" | "high-school" | "college" | "adult";
  primaryGoal: string;
  interests: string[];
  aversions: string[];
  dreamCareers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  description: string;
  dayInLife: string;
  skills: string[];
  education: string;
  salaryRange: string;
  timeToEntry: string;
  relatedPaths: string[];
}
