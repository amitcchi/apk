export type IssueStatus = 'under_review' | 'in_progress' | 'resolved';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export type IssueCategory =
  | 'Classroom'
  | 'Laboratory'
  | 'Washroom'
  | 'Electricity'
  | 'Wi-Fi'
  | 'Cleanliness'
  | 'Water'
  | 'Security';

export interface CampusComment {
  id: string;
  author: string;
  isOfficial?: boolean;
  timeAgo: string;
  text: string;
}

export interface CampusIssue {
  id: string;
  title: string;
  category: IssueCategory;
  secondaryTag?: string;
  priorityScore: number;
  priorityLevel: IssuePriority;
  status: IssueStatus;
  location: string;
  zone: string;
  imageUrl?: string;
  imageAlt?: string;
  etaNotice?: string;
  reportedBy: string;
  isAnonymous: boolean;
  reportedTimeAgo: string;
  timestamp: number;
  upvotes: number;
  hasUpvoted?: boolean;
  description: string;
  assignedTechnician?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  comments: CampusComment[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'dispatch' | 'status_change' | 'upvote_milestone' | 'general';
  issueId?: string;
}

export type ActiveTab = 'home' | 'explore' | 'report' | 'my-reports' | 'admin';
