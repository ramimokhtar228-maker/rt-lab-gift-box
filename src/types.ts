export type PrizeCategory =
  | 'DISCOUNT'
  | 'FREE_SERVICE'
  | 'PHYSICAL_GIFT'
  | 'SURPRISE'
  | 'discount'
  | 'free_test'
  | 'package'
  | 'home_visit'
  | 'gift';

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
  whatsappInviteTemplate: string;
  whatsappWinnerReplyTemplate: string;
  whatsappPatientClaimTemplate: string;
  shareBaseUrl?: string;
}

export interface Prize {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  category: PrizeCategory;
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
  expiresAt: string;
  openedAt: string | null;
  redeemedAt: string | null;
  redeemedBy: string | null;
  appointmentAt?: string | null;
  appointmentNote?: string | null;
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
  appointmentAt?: string | null;
  appointmentNote?: string | null;
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
