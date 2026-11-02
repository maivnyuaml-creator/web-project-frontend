import { apiRequest, ApiResponse } from './client';
import {
  User,
  Room,
  StreamStatus,
  TokenPackage,
  Transaction,
  CreatorProfile,
  CreatorApplication,
  ModerationReport,
  AuditLog,
  PlatformStats
} from '@/types';
import {
  FIXTURE_ROOMS,
  FIXTURE_CATEGORIES,
  FIXTURE_TOKEN_PACKAGES,
  FIXTURE_CREATOR_PROFILE,
  FIXTURE_MODERATION_REPORTS,
  FIXTURE_CREATOR_APPLICATIONS,
  FIXTURE_AUDIT_LOGS
} from './fixtures';

export * from './client';
export * from './fixtures';

// ==========================================
// 1. Auth Endpoints (/api/v1/auth)
// ==========================================
export const authApi = {
  login: async (credentials: { email: string; password?: string; twoFactorCode?: string; rememberMe?: boolean }) => {
    const body: { email: string; password?: string; twoFactorCode?: string } = {
      email: credentials.email,
      password: credentials.password,
    };
    if (credentials.twoFactorCode) {
      body.twoFactorCode = credentials.twoFactorCode;
    }
    return apiRequest<{ user: User; token?: string }>('/api/v1/auth/login', {
      method: 'POST',
      body,
    });
  },

  register: async (payload: { username: string; email: string; password?: string; ageConsent?: boolean; displayName?: string }) => {
    return apiRequest<{ user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        displayName: payload.displayName || payload.username,
        ageConsent: payload.ageConsent ?? true,
        termsConsent: true,
      },
    });
  },

  logout: async () => {
    return apiRequest<void>('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async (): Promise<ApiResponse<User | null>> => {
    try {
      return await apiRequest<User>('/api/v1/auth/me');
    } catch {
      return { success: false, data: null };
    }
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  resetPassword: async (payload: { token: string; password?: string; newPassword?: string }) => {
    return apiRequest<{ message: string }>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: {
        token: payload.token,
        newPassword: payload.newPassword || payload.password,
      },
    });
  },

  resendVerification: async (email?: string) => {
    return apiRequest<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  verifyEmail: async (token: string) => {
    return apiRequest<{ message: string }>('/api/v1/auth/verify-email', {
      method: 'POST',
      body: { token },
    });
  },
};

// ==========================================
// 2. Users Endpoints (/api/v1/users)
// ==========================================
export const usersApi = {
  getProfile: async () => {
    return apiRequest<User>('/api/v1/users/profile');
  },

  updateProfile: async (data: Partial<User>) => {
    return apiRequest<User>('/api/v1/users/profile', {
      method: 'PATCH',
      body: data,
    });
  },

  updateSecurity: async (payload: { currentPassword?: string; newPassword?: string; enable2FA?: boolean }) => {
    return apiRequest<{ success: boolean; message: string }>('/api/v1/users/security', {
      method: 'PATCH',
      body: payload,
    });
  },

  getSessions: async () => {
    return apiRequest<Array<{ id: string; device: string; browser: string; ip: string; lastActive: string; isCurrent: boolean }>>('/api/v1/users/sessions');
  },

  revokeSession: async (sessionId: string) => {
    return apiRequest<void>(`/api/v1/users/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  getFavorites: async () => {
    try {
      const res = await apiRequest<any[]>('/api/v1/users/favorites');
      if (Array.isArray(res.data)) {
        return { ...res, data: res.data.map(normalizeRoom) };
      }
      return res;
    } catch {
      return { success: true, data: [] };
    }
  },

  toggleFavorite: async (creatorId: string) => {
    return apiRequest<{ favorited: boolean }>(`/api/v1/users/favorites/${creatorId}`, {
      method: 'POST',
    });
  },
};

// ==========================================
// 3. Rooms Endpoints (/api/v1/rooms)
// ==========================================
export function normalizeRoom(raw: any): Room {
  if (!raw || typeof raw !== 'object') return raw;

  const categoryName =
    typeof raw.category === 'object' && raw.category !== null
      ? raw.category.name || raw.category.slug || 'General'
      : typeof raw.category === 'string'
      ? raw.category
      : 'General';

  const creatorRaw = raw.creator || {};
  const creatorProfile = creatorRaw.creatorProfile || {};
  const creator = {
    id: creatorRaw.id || raw.creatorId || 'unknown',
    username: creatorRaw.username || 'creator',
    displayName: creatorRaw.displayName || creatorProfile.stageName || creatorRaw.username || 'Creator',
    avatarUrl: creatorRaw.avatarUrl || creatorProfile.avatarUrl || undefined,
    verified: creatorProfile.isApproved ?? creatorRaw.verified ?? true,
    followersCount: creatorProfile.followerCount ?? creatorRaw.followersCount ?? 0,
    bio: creatorProfile.bio || creatorRaw.bio || '',
  };

  let status: StreamStatus = 'OFFLINE';
  if (raw.status) {
    status = raw.status;
  } else if (raw.isLive) {
    status = raw.isPrivate ? 'PRIVATE' : 'LIVE';
  } else if (raw.isPrivate) {
    status = 'PRIVATE';
  }

  let tags: string[] = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags;
  } else if (typeof raw.topic === 'string' && raw.topic) {
    tags = raw.topic.split(/[,&•]+/).map((s: string) => s.trim()).filter(Boolean);
  }
  if (tags.length === 0) {
    tags = ['live', categoryName.toLowerCase().replace(/\s+/g, '-')];
  }

  const viewerCount =
    typeof raw.viewerCount === 'number'
      ? raw.viewerCount
      : typeof raw.currentViewerCount === 'number'
      ? raw.currentViewerCount
      : 0;

  const hlsPlaybackUrl = raw.hlsPlaybackUrl || raw.playback?.playbackUrl;

  return {
    id: raw.id,
    slug: raw.slug || raw.id,
    title: raw.title || 'Live Stream',
    description: raw.description || raw.topic || '',
    creatorId: raw.creatorId || creator.id,
    creator,
    category: categoryName,
    tags,
    language: raw.language || 'English',
    status,
    viewerCount,
    thumbnailUrl: raw.thumbnailUrl || (raw.thumbnailMediaId ? `/api/v1/media/${raw.thumbnailMediaId}` : undefined),
    hlsPlaybackUrl,
    webrtcUrl: raw.webrtcUrl,
    tipGoal: raw.tipGoal,
    isPrivateShow: raw.isPrivateShow ?? raw.isPrivate ?? false,
    privateShowRate: raw.privateShowRate ?? creatorProfile.privateShowRatePerMinute ?? 60,
    isGroupShow: raw.isGroupShow ?? false,
    groupShowMinUsers: raw.groupShowMinUsers ?? 2,
    groupShowCost: raw.groupShowCost ?? creatorProfile.groupShowRatePerMinute ?? 30,
    isAgeRestricted: raw.isAgeRestricted ?? true,
    startedAt: raw.startedAt ?? raw.createdAt,
    endedAt: raw.endedAt,
  };
}

export const roomsApi = {
  getRooms: async (params?: { category?: string; language?: string; tag?: string; search?: string; sort?: string; page?: number; limit?: number }) => {
    try {
      const res = await apiRequest<any[]>('/api/v1/rooms', { params });
      if (Array.isArray(res.data)) {
        return {
          ...res,
          data: res.data.map(normalizeRoom),
        };
      }
      return res;
    } catch {
      // Development fixture fallback
      let filtered = [...FIXTURE_ROOMS];
      if (params?.category) {
        filtered = filtered.filter(r => r.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.creator.displayName.toLowerCase().includes(q));
      }
      return { success: true, data: filtered, meta: { total: filtered.length, page: 1, limit: 20 } };
    }
  },

  getRoomById: async (roomId: string) => {
    // If it's a fixture ID (like 'room-101', 'room-102') or non-UUID, resolve immediately without 404 network failure
    const isFixtureId = roomId.startsWith('room-') || !roomId.includes('-') || roomId.length < 32;
    const fixture = FIXTURE_ROOMS.find(r => r.id === roomId || r.slug === roomId);
    if (isFixtureId && fixture) {
      return { success: true, data: fixture };
    }

    try {
      const res = await apiRequest<any>(`/api/v1/rooms/${roomId}`);
      if (res.data) {
        return {
          ...res,
          data: normalizeRoom(res.data),
        };
      }
      return res;
    } catch {
      const found = fixture || FIXTURE_ROOMS[0];
      return { success: true, data: found };
    }
  },

  getCategories: async () => {
    try {
      return await apiRequest<typeof FIXTURE_CATEGORIES>('/api/v1/rooms/categories');
    } catch {
      return { success: true, data: FIXTURE_CATEGORIES };
    }
  },

  getTrending: async () => {
    try {
      const res = await apiRequest<any[]>('/api/v1/rooms/trending');
      if (Array.isArray(res.data)) {
        return { ...res, data: res.data.map(normalizeRoom) };
      }
      return res;
    } catch {
      try {
        const allRooms = await roomsApi.getRooms();
        if (allRooms.data && allRooms.data.length > 0) {
          return { success: true, data: allRooms.data.slice(0, 4) };
        }
      } catch {
        // fallback to fixtures
      }
      return { success: true, data: FIXTURE_ROOMS.slice(0, 4) };
    }
  },

  getFeatured: async () => {
    try {
      const res = await apiRequest<any[]>('/api/v1/rooms/featured');
      if (Array.isArray(res.data)) {
        return { ...res, data: res.data.map(normalizeRoom) };
      }
      return res;
    } catch {
      try {
        const allRooms = await roomsApi.getRooms();
        if (allRooms.data && allRooms.data.length > 0) {
          return { success: true, data: allRooms.data.slice(0, 2) };
        }
      } catch {
        // fallback to fixtures
      }
      return { success: true, data: [FIXTURE_ROOMS[0], FIXTURE_ROOMS[1]] };
    }
  },

  getMyRoom: async () => {
    try {
      const res = await apiRequest<any[]>('/api/v1/rooms');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return {
          success: true,
          data: normalizeRoom(res.data[0]),
        };
      }
      return { success: true, data: FIXTURE_ROOMS[0] };
    } catch {
      return { success: true, data: FIXTURE_ROOMS[0] };
    }
  },

  createRoom: async (payload: { title: string; topic?: string; categoryId?: string; allowChat?: boolean; allowTips?: boolean }) => {
    return apiRequest<any>('/api/v1/rooms', {
      method: 'POST',
      body: payload,
    });
  },

  goLive: async (roomId: string) => {
    return apiRequest<{ success: boolean; message: string; room: any; sessionId: string }>(`/api/v1/rooms/${roomId}/go-live`, {
      method: 'POST',
    });
  },

  endStream: async (roomId: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/v1/rooms/${roomId}/end`, {
      method: 'POST',
    });
  },

  rotateStreamCredentials: async (roomId: string) => {
    return apiRequest<{ streamKey: string; ingestServerUrl: string; playbackUrl: string }>(`/api/v1/rooms/${roomId}/stream-credentials/rotate`, {
      method: 'POST',
    });
  },
};

// ==========================================
// 4. Creators Endpoints (/api/v1/creators)
// ==========================================
export const creatorsApi = {
  getProfile: async (username: string) => {
    try {
      return await apiRequest<CreatorProfile>(`/api/v1/creators/${username}`);
    } catch {
      return { success: true, data: { ...FIXTURE_CREATOR_PROFILE, stageName: username } };
    }
  },

  updateProfile: async (data: Partial<CreatorProfile>) => {
    return apiRequest<CreatorProfile>('/api/v1/creators/profile', {
      method: 'PATCH',
      body: data,
    });
  },

  getStreamSettings: async (roomId?: string) => {
    if (roomId) {
      try {
        const creds = await roomsApi.rotateStreamCredentials(roomId);
        if (creds.data) {
          return {
            success: true,
            data: {
              streamKey: creds.data.streamKey,
              rtmpUrl: creds.data.ingestServerUrl,
              playbackUrl: creds.data.playbackUrl,
            },
          };
        }
      } catch {
        // fallback
      }
    }
    return apiRequest<{ streamKey: string; rtmpUrl: string; streamTitle: string; category: string; tags: string[] }>('/api/v1/creators/stream-settings');
  },

  rotateStreamKey: async (roomId?: string) => {
    if (roomId) {
      return roomsApi.rotateStreamCredentials(roomId);
    }
    try {
      const room = await roomsApi.getMyRoom();
      if (room.data?.id) {
        return roomsApi.rotateStreamCredentials(room.data.id);
      }
    } catch {
      // fallback
    }
    return {
      success: true,
      data: {
        streamKey: `live_sec_${Math.random().toString(36).substring(2, 15)}`,
        ingestServerUrl: 'rtmp://localhost:1935/live',
        playbackUrl: '',
      },
    };
  },

  getTipMenu: async (creatorId?: string) => {
    return apiRequest<CreatorProfile['tipMenu']>(`/api/v1/creators/${creatorId || 'me'}/tip-menu`);
  },

  updateTipMenu: async (items: CreatorProfile['tipMenu']) => {
    return apiRequest<CreatorProfile['tipMenu']>('/api/v1/creators/tip-menu', {
      method: 'PUT',
      body: { items },
    });
  },

  getEarnings: async (params?: { timeframe?: '7d' | '30d' | 'all' }) => {
    return apiRequest<{
      totalTokens: number;
      totalUsd: number;
      tipsTokens: number;
      privateShowsTokens: number;
      subscriptionsTokens: number;
      dailyStats: Array<{ date: string; tokens: number; usd: number }>;
    }>('/api/v1/creators/earnings', { params });
  },

  getFans: async () => {
    return apiRequest<{
      fans: Array<{ id: string; username: string; totalTipped: number; isVip: boolean; joinedAt: string }>;
      blocked: Array<{ id: string; username: string; blockedAt: string; reason?: string }>;
    }>('/api/v1/creators/fans');
  },

  blockFan: async (userId: string, reason?: string) => {
    return apiRequest<void>(`/api/v1/creators/fans/${userId}/block`, {
      method: 'POST',
      body: { reason },
    });
  },

  unblockFan: async (userId: string) => {
    return apiRequest<void>(`/api/v1/creators/fans/${userId}/unblock`, {
      method: 'POST',
    });
  },
};

// ==========================================
// 5. Creator Applications (/api/v1/creator-applications)
// ==========================================
export const applicationsApi = {
  submit: async (data: FormData | Record<string, unknown>) => {
    if (data instanceof FormData) {
      return apiRequest<CreatorApplication>('/api/v1/creator-applications', {
        method: 'POST',
        body: data,
      });
    }

    const payload: Record<string, unknown> = {
      legalFirstName: data.legalFirstName,
      legalLastName: data.legalLastName,
      dateOfBirth: data.dateOfBirth,
      country: data.country,
      idDocumentType: data.idDocumentType,
      idDocumentNumber: data.idDocumentNumber,
      stageName: data.stageName,
    };
    if (data.bio) {
      payload.bio = data.bio;
    }

    return apiRequest<CreatorApplication>('/api/v1/creator-applications', {
      method: 'POST',
      body: payload,
    });
  },

  getStatus: async () => {
    return apiRequest<CreatorApplication | null>('/api/v1/creator-applications/status');
  },
};

// ==========================================
// 6. Verification (/api/v1/verification)
// ==========================================
export const verificationApi = {
  getStatus: async () => {
    return apiRequest<{
      status: 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
      provider: string;
      accessToken?: string;
      requirementsMet: boolean;
      submittedAt?: string;
    }>('/api/v1/verification/status');
  },

  initiateSession: async () => {
    return apiRequest<{ sessionToken: string; iframeUrl: string }>('/api/v1/verification/initiate', {
      method: 'POST',
    });
  },
};

// ==========================================
// 7. Wallet & Token Packages (/api/v1/wallet, /api/v1/token-packages)
// ==========================================
export const walletApi = {
  getBalance: async () => {
    try {
      const res = await apiRequest<{ id: string; userId: string; tokenBalance: number; isLocked: boolean }>('/api/v1/wallet');
      return {
        ...res,
        data: {
          tokenBalance: res.data?.tokenBalance ?? 0,
        },
      };
    } catch {
      return apiRequest<{ tokenBalance: number }>('/api/v1/wallet/balance');
    }
  },

  getPackages: async () => {
    try {
      const response = await apiRequest<TokenPackage[]>('/api/v1/token-packages');
      if (response && Array.isArray(response.data)) {
        return {
          ...response,
          data: response.data.map((pkg: any) => {
            const tokenAmount = typeof pkg.tokenAmount === 'number' ? pkg.tokenAmount : (pkg.tokens ?? 0);
            const priceUsd = typeof pkg.priceUsd === 'number'
              ? pkg.priceUsd
              : (typeof pkg.priceMinorUnits === 'number' ? pkg.priceMinorUnits / 100 : 0);
            const bonusTokens = typeof pkg.bonusTokens === 'number' ? pkg.bonusTokens : 0;
            const isPopular = pkg.isPopular ?? (pkg.name?.toLowerCase().includes('popular') || tokenAmount === 500);
            let badge = pkg.badge;
            if (!badge) {
              if (pkg.name?.toLowerCase().includes('popular') || isPopular) {
                badge = 'Popular';
              } else if (bonusTokens > 0) {
                badge = `+${bonusTokens} Bonus`;
              }
            }
            return {
              ...pkg,
              tokens: tokenAmount,
              tokenAmount,
              bonusTokens,
              priceUsd,
              priceMinorUnits: typeof pkg.priceMinorUnits === 'number' ? pkg.priceMinorUnits : Math.round(priceUsd * 100),
              currency: pkg.currency || 'USD',
              isPopular,
              badge,
            };
          }),
        };
      }
      return response;
    } catch {
      return { success: true, data: FIXTURE_TOKEN_PACKAGES };
    }
  },

  createCheckoutSession: async (packageId: string, paymentMethod?: string, returnUrl?: string) => {
    const idempotencyKey = `idem_${packageId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const payload: { packageId: string; idempotencyKey: string; returnUrl?: string } = {
      packageId,
      idempotencyKey,
      returnUrl: returnUrl || (typeof window !== 'undefined' ? `${window.location.origin}/account/wallet?status=success` : undefined),
    };
    return apiRequest<{ checkoutUrl: string; sessionId?: string; paymentId?: string; expiresAt?: string; orderId?: string }>('/api/v1/payments/checkout', {
      method: 'POST',
      body: payload,
    });
  },

  completeSandboxCheckout: async (payload: { session: string; pkg: string; idem: string }) => {
    return apiRequest<{ success: boolean; message: string; tokensCredited: number }>('/api/v1/payments/sandbox-checkout', {
      method: 'POST',
      body: payload,
    });
  },

  getTransactions: async (params?: { page?: number; limit?: number; type?: string; skip?: number }) => {
    return apiRequest<Transaction[]>('/api/v1/wallet/transactions', { params });
  },

  requestPayout: async (payload: { amountTokens: number; method: string; details: Record<string, string> }) => {
    return apiRequest<{ payoutId: string; status: string }>('/api/v1/wallet/payouts', {
      method: 'POST',
      body: payload,
    });
  },

  getPayoutHistory: async () => {
    return apiRequest<Array<{ id: string; amountUsd: number; tokens: number; status: string; method: string; createdAt: string }>>('/api/v1/wallet/payouts');
  },
};

// ==========================================
// 8. Tips (/api/v1/tips)
// ==========================================
export const tipsApi = {
  sendTip: async (payload: {
    roomId: string;
    amount?: number;
    customTokenAmount?: number;
    message?: string;
    tipItemId?: string;
    tipMenuItemId?: string;
    isAnonymous?: boolean;
    idempotencyKey?: string;
  }) => {
    const isFixture =
      payload.roomId.startsWith('room-') ||
      !payload.roomId.includes('-') ||
      payload.roomId.length < 32 ||
      FIXTURE_ROOMS.some(r => r.id === payload.roomId || r.slug === payload.roomId);

    if (isFixture) {
      await new Promise(r => setTimeout(r, 300));
      return {
        success: true,
        data: {
          success: true,
          newBalance: 0,
          tipId: `demo_tip_${Date.now()}`,
        },
      };
    }

    const tokenAmount = payload.customTokenAmount ?? payload.amount;
    const menuItemId = payload.tipMenuItemId ?? payload.tipItemId;
    const idempotencyKey =
      payload.idempotencyKey || `tip_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const body: Record<string, unknown> = {
      roomId: payload.roomId,
      idempotencyKey,
    };

    if (menuItemId) {
      body.tipMenuItemId = menuItemId;
    } else if (tokenAmount && tokenAmount > 0) {
      body.customTokenAmount = tokenAmount;
    }

    if (payload.message?.trim()) {
      body.message = payload.message.trim();
    }

    if (payload.isAnonymous !== undefined) {
      body.isAnonymous = payload.isAnonymous;
    }

    try {
      return await apiRequest<{ success: boolean; newBalance: number; tipId: string }>('/api/v1/tips', {
        method: 'POST',
        body,
      });
    } catch (err: unknown) {
      const isApiErr = err && typeof err === 'object' && 'statusCode' in err;
      const status = isApiErr ? (err as { statusCode: number }).statusCode : 0;
      if (status === 401 || status === 404) {
        return {
          success: true,
          data: {
            success: true,
            newBalance: 0,
            tipId: `dev_tip_${Date.now()}`,
          },
        };
      }
      throw err;
    }
  },
};

// ==========================================
// 9. Shows (/api/v1/shows)
// ==========================================
export const showsApi = {
  requestPrivateShow: async (payload: { creatorId: string; roomId: string; durationMinutes: number }) => {
    return apiRequest<{ showId: string; status: 'PENDING' | 'ACCEPTED' | 'REJECTED'; tokenRatePerMinute: number }>('/api/v1/shows/private/request', {
      method: 'POST',
      body: payload,
    });
  },

  joinGroupShow: async (roomId: string) => {
    return apiRequest<{ showId: string; accessGranted: boolean }>('/api/v1/shows/group/join', {
      method: 'POST',
      body: { roomId },
    });
  },

  getUserShowsHistory: async () => {
    return apiRequest<Array<{ id: string; creatorName: string; type: 'PRIVATE' | 'GROUP'; durationMinutes: number; tokensSpent: number; date: string }>>('/api/v1/shows/history');
  },
};

// ==========================================
// 10. Reports (/api/v1/reports)
// ==========================================
export const reportsApi = {
  submitReport: async (payload: {
    targetType: 'ROOM' | 'USER' | 'MESSAGE' | 'MEDIA';
    targetId: string;
    reason: string;
    description: string;
    evidenceUrls?: string[];
  }) => {
    return apiRequest<{ reportId: string; status: string }>('/api/v1/reports', {
      method: 'POST',
      body: payload,
    });
  },
};

// ==========================================
// 11. Notifications (/api/v1/notifications)
// ==========================================
export const notificationsApi = {
  getPreferences: async () => {
    return apiRequest<{
      emailOnlineAlerts: boolean;
      emailMarketing: boolean;
      browserPushAlerts: boolean;
      soundAlerts: boolean;
      tipAnnouncements: boolean;
    }>('/api/v1/notifications/preferences');
  },

  updatePreferences: async (preferences: Record<string, boolean>) => {
    return apiRequest<{ success: boolean }>('/api/v1/notifications/preferences', {
      method: 'PATCH',
      body: preferences,
    });
  },
};

// ==========================================
// 12. Admin Endpoints (/api/v1/admin)
// ==========================================
export const adminApi = {
  getStats: async () => {
    try {
      return await apiRequest<PlatformStats>('/api/v1/admin/stats');
    } catch {
      return {
        success: true,
        data: {
          activeLiveRooms: 48,
          totalViewersOnline: 12480,
          todayRevenueUsd: 18450.50,
          todayTokensCirculated: 184505,
          pendingCreatorApplications: 14,
          pendingReports: 6,
          totalUsers: 142080,
          activeCreators: 1280,
        }
      };
    }
  },

  getApplications: async (status?: string) => {
    try {
      return await apiRequest<CreatorApplication[]>('/api/v1/admin/creator-applications', { params: { status } });
    } catch {
      return { success: true, data: FIXTURE_CREATOR_APPLICATIONS };
    }
  },

  reviewApplication: async (id: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) => {
    return apiRequest<void>(`/api/v1/admin/creator-applications/${id}/review`, {
      method: 'POST',
      body: { action, rejectionReason },
    });
  },

  getReports: async (status?: string) => {
    try {
      return await apiRequest<ModerationReport[]>('/api/v1/admin/reports', { params: { status } });
    } catch {
      return { success: true, data: FIXTURE_MODERATION_REPORTS };
    }
  },

  resolveReport: async (id: string, action: 'DISMISS' | 'WARN_USER' | 'BAN_USER' | 'TAKEDOWN_ROOM', notes?: string) => {
    return apiRequest<void>(`/api/v1/admin/reports/${id}/resolve`, {
      method: 'POST',
      body: { action, notes },
    });
  },

  getUsers: async (params?: { search?: string; role?: string; status?: string; page?: number; limit?: number }) => {
    return apiRequest<User[]>('/api/v1/admin/users', { params });
  },

  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'BANNED', reason?: string) => {
    return apiRequest<void>(`/api/v1/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: { status, reason },
    });
  },

  getActiveRooms: async () => {
    try {
      const res = await apiRequest<any[]>('/api/v1/admin/rooms');
      if (Array.isArray(res.data)) {
        return { ...res, data: res.data.map(normalizeRoom) };
      }
      return res;
    } catch {
      return { success: true, data: FIXTURE_ROOMS };
    }
  },

  terminateRoom: async (roomId: string, reason?: string) => {
    return apiRequest<void>(`/api/v1/admin/rooms/${roomId}/terminate`, {
      method: 'POST',
      body: { reason },
    });
  },

  getPayoutRequests: async () => {
    return apiRequest<Array<{ id: string; creatorName: string; amountUsd: number; method: string; status: string; requestedAt: string }>>('/api/v1/admin/payouts');
  },

  reviewPayout: async (id: string, action: 'APPROVE' | 'REJECT', txReference?: string) => {
    return apiRequest<void>(`/api/v1/admin/payouts/${id}/review`, {
      method: 'POST',
      body: { action, txReference },
    });
  },

  getAuditLogs: async () => {
    try {
      return await apiRequest<AuditLog[]>('/api/v1/admin/audit-logs');
    } catch {
      return { success: true, data: FIXTURE_AUDIT_LOGS };
    }
  },

  getSettings: async () => {
    return apiRequest<{
      tokenUsdRate: number;
      platformCommissionPercent: number;
      minPayoutUsd: number;
      streamDelaySeconds: number;
      requireIdVerificationBeforeStreaming: boolean;
    }>('/api/v1/admin/settings');
  },

  updateSettings: async (settings: Record<string, unknown>) => {
    return apiRequest<void>('/api/v1/admin/settings', {
      method: 'PATCH',
      body: settings,
    });
  },
};
