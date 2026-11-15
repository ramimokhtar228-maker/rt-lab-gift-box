export type PrizeCategory = 'discount' | 'free_test' | 'package' | 'home_visit' | 'gift';

export type LinkStatus = 'pending' | 'opened' | 'redeemed' | 'expired';

export interface LabProfile {
  labName: string;
  tagline: string;
  director: string;
  hotlineNumber: string;
  whatsappNumber: string;
  address: string;
  workingHours: string;
  branches: string[];
  logoUrl: string;
  shareBaseUrl?: string;
  /** Template sent when sharing a box link with a patient */
  whatsappInviteTemplate: string;
  /** Template sent by Admin when replying to a winner confirming prize + time limit */
  whatsappWinnerReplyTemplate: string;
  /** Template sent by Patient to Lab WhatsApp after opening the box */
  whatsappPatientClaimTemplate: string;
}

export interface Prize {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  category: PrizeCategory;
  /** Duration in hours before the opened prize expires (e.g. 24 = 24 hours, 168 = 7 days) */
  validHours: number;
  weight: number;
  stock: number;
  usedCount: number;
  active: boolean;
}

export interface GiftLink {
  id: string;
  token: string;
  clientName: string;
  clientPhone: string;
  visitRef: string;
  branchName: string;
  status: LinkStatus;
  createdAt: string;
  /** Link expiration before opening, or once opened: exact prize expiration timestamp */
  expiresAt: string;
  openedAt: string | null;
  redeemedAt: string | null;
  redeemedBy: string | null;
  prizeId: string | null;
  prizeTitle: string | null;
  prizeDescription: string | null;
  prizeDiscountLabel: string | null;
  prizeCategory: PrizeCategory | null;
  prizeCode: string | null;
  validHours: number | null;
  notes?: string;
}

export interface LabPriceItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  category: string;
  price: number;
  offerPrice?: number;
  duration?: string;
  active: boolean;
}

export interface FullBackupPayload {
  version: string;
  exportedAt: string;
  labProfile: LabProfile;
  prizes: Prize[];
  giftLinks: GiftLink[];
  prices: LabPriceItem[];
}

export interface BoxPublicResponse {
  token: string;
  clientName: string;
  visitRef: string;
  branchName: string;
  status: LinkStatus;
  createdAt: string;
  expiresAt: string;
  openedAt: string | null;
  redeemedAt: string | null;
  prize: {
    title: string;
    description: string;
    discountLabel: string;
    category: PrizeCategory;
    prizeCode: string;
    validHours: number;
  } | null;
}

export interface AdminDashboardData {
  labProfile: LabProfile;
  prizes: Prize[];
  giftLinks: GiftLink[];
  prices: LabPriceItem[];
  stats: {
    totalLinks: number;
    pendingLinks: number;
    openedLinks: number;
    redeemedLinks: number;
    expiredLinks: number;
    activePrizes: number;
    totalPrices: number;
  };
}
