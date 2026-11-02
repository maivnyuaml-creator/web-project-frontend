// ==========================================
// User & Auth Types
// ==========================================

export type UserRole = 'VIEWER' | 'CREATOR' | 'ADMIN' | 'MODERATOR';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  tokenBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==========================================
// Room & Streaming Types
// ==========================================

export type StreamStatus = 'LIVE' | 'OFFLINE' | 'PRIVATE' | 'GROUP';

export interface TipGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

export interface Room {
  id: string;
  slug: string;
  title: string;
  description?: string;
  creatorId: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    verified: boolean;
    followersCount: number;
    bio?: string;
  };
  category: string;
  tags: string[];
  language: string;
  status: StreamStatus;
  viewerCount: number;
  thumbnailUrl?: string;
  hlsPlaybackUrl?: string;
  webrtcUrl?: string;
  tipGoal?: TipGoal;
  isPrivateShow: boolean;
  privateShowRate: number; // tokens per minute
  isGroupShow: boolean;
  groupShowMinUsers: number;
  groupShowCost: number; // token cost to enter
  isAgeRestricted: boolean;
  startedAt?: string;
  endedAt?: string;
}

// ==========================================
// Chat & Socket Types
// ==========================================

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderBadge?: string;
  content: string;
  tipAmount?: number;
  timestamp: string;
  isNotice?: boolean;
  isSystem?: boolean;
  isPrivate?: boolean;
}

export interface TipEvent {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  amount: number;
  message?: string;
  timestamp: string;
  animationType?: 'standard' | 'fire' | 'heart' | 'galaxy';
}

export interface SocketEvents {
  'join-room': (roomId: string) => void;
  'leave-room': (roomId: string) => void;
  'send-message': (payload: { roomId: string; content: string }) => void;
  'new-message': (message: ChatMessage) => void;
  'tip-sent': (tip: TipEvent) => void;
  'room-status-changed': (payload: { roomId: string; status: StreamStatus; viewerCount: number }) => void;
  'viewer-count': (payload: { roomId: string; count: number }) => void;
  'goal-updated': (payload: { roomId: string; tipGoal: TipGoal }) => void;
}

// ==========================================
// Creator Types
// ==========================================

export interface TipMenuItem {
  id: string;
  name: string;
  description?: string;
  tokens: number;
  action?: string;
  icon?: string;
}

export interface CreatorScheduleItem {
  id: string;
  dayOfWeek: number; // 0-6 (Sun-Sat)
  startTime: string; // "18:00"
  endTime: string; // "22:00"
  title: string;
  isRecurring: boolean;
}

export type MediaReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreatorMediaItem {
  id: string;
  creatorId: string;
  title: string;
  type: 'PHOTO' | 'VIDEO';
  previewUrl: string;
  fullUrl?: string;
  priceTokens: number;
  isUnlocked: boolean;
  reviewStatus: MediaReviewStatus;
  createdAt: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  stageName: string;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  age: number;
  country: string;
  languages: string[];
  tags: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    onlyfans?: string;
    fansly?: string;
  };
  followersCount: number;
  subscribersCount: number;
  isApproved: boolean;
  verificationStatus: VerificationStatus;
  streamKey?: string;
  rtmpUrl?: string;
  tipMenu: TipMenuItem[];
  goals: TipGoal[];
  privateShowRate: number;
  groupShowCost: number;
  schedule: CreatorScheduleItem[];
}

export interface CreatorApplication {
  id: string;
  userId: string;
  userEmail?: string;
  username?: string;
  stageName?: string;
  legalFirstName: string;
  legalLastName: string;
  dateOfBirth: string;
  country: string;
  idDocumentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
  idDocumentNumber?: string;
  bio?: string;
  idDocumentFrontUrl?: string;
  idDocumentBackUrl?: string;
  selfieWithIdUrl?: string;
  socialLinks?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

// ==========================================
// Wallet & Transactions
// ==========================================

export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  tokenAmount?: number;
  bonusTokens: number;
  priceUsd: number;
  priceMinorUnits?: number;
  currency?: string;
  isPopular?: boolean;
  badge?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionType =
  | 'PURCHASE'
  | 'TIP_SENT'
  | 'TIP_RECEIVED'
  | 'PRIVATE_SHOW'
  | 'GROUP_SHOW'
  | 'PAYOUT'
  | 'SUBSCRIPTION'
  | 'REFUND';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amountTokens: number;
  amountUsd?: number;
  status: TransactionStatus;
  paymentMethod?: string;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  amountUsd: number;
  tokensDeducted: number;
  method: 'PAXUM' | 'SEPA' | 'CRYPTO' | 'WIRE';
  details: Record<string, string>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

// ==========================================
// Moderation & Reports & Admin
// ==========================================

export type ReportReason =
  | 'UNDERAGE_CONCERN'
  | 'NON_CONSENSUAL'
  | 'HARASSMENT'
  | 'VIOLENCE'
  | 'COPYRIGHT'
  | 'FRAUD'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterUsername: string;
  targetType: 'ROOM' | 'USER' | 'MESSAGE' | 'MEDIA';
  targetId: string;
  targetName: string;
  reason: ReportReason;
  description: string;
  evidenceUrls?: string[];
  status: ReportStatus;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  moderatorNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface PlatformStats {
  activeLiveRooms: number;
  totalViewersOnline: number;
  todayRevenueUsd: number;
  todayTokensCirculated: number;
  pendingCreatorApplications: number;
  pendingReports: number;
  totalUsers: number;
  activeCreators: number;
}
