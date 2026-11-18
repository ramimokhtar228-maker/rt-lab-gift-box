export type AppLang = 'ar' | 'en';

export type PrizeCategory =
  | 'DISCOUNT'
  | 'FREE_SERVICE'
  | 'PHYSICAL_GIFT'
  | 'SURPRISE'
  | 'PAID_OFFER'
  | 'discount'
  | 'free_test'
  | 'package'
  | 'home_visit'
  | 'gift';

export type DistributionTier =
  | 'disc_mid' // 30-50% discounts (Target 35%)
  | 'disc_high' // 60-80% discounts (Target 25%)
  | 'paid_offer' // Special paid bundles e.g. 5 tests at declared price (Target 20%)
  | 'free_gift' // Free specific test / home visit / symbolic gift (Target 12%)
  | 'grand_prize' // VIP packages / vouchers / seasonal grand prizes (Target 5%)
  | 'vip_surprise'; // VIP surprises, loyalty upgrades, raffle, birthday (Target 3%)

export type GameMode =
  | 'box'
  | 'three_boxes'
  | 'wheel'
  | 'scratch'
  | 'secret'
  | 'seasonal';

export type LoyaltyTier = 'Basic' | 'Plus' | 'VIP';

export type LinkStatus = 'pending' | 'opened' | 'redeemed' | 'expired' | 'cancelled';

export interface DistributionTargets {
  discMid: number; // default 35%
  discHigh: number; // default 25%
  paidOffer: number; // default 20%
  freeGift: number; // default 12%
  grandPrize: number; // default 5%
  vipSurprise: number; // default 3%
}

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
  defaultGameMode?: GameMode;
  activeCampaign?: string;
  distributionTargets?: DistributionTargets;
}

export interface Prize {
  id: string;
  title: string;
  description: string;
  terms?: string;
  discountLabel: string;
  category: PrizeCategory;
  distributionTier?: DistributionTier;
  estimatedCostEgp?: number;
  offerPriceEgp?: number;
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
  phoneHash?: string | null;
  status: LinkStatus;
  gameMode?: GameMode;
  selectedGameBox?: number | null;
  campaignName?: string | null;
  loyaltyTier?: LoyaltyTier;
  loyaltyPoints?: number;
  referralCode?: string | null;
  referredBy?: string | null;
  isBirthdayGift?: boolean;
  createdAt: string;
  expiresAt: string;
  openedAt: string | null;
  redeemedAt: string | null;
  redeemedBy: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  invoiceAmount?: number | null;
  rewardCost?: number | null;
  appointmentAt?: string | null;
  appointmentNote?: string | null;
  prizeId: string | null;
  prizeTitle: string | null;
  prizeDescription: string | null;
  prizeTerms?: string | null;
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
  gameMode?: GameMode;
  selectedGameBox?: number | null;
  campaignName?: string | null;
  loyaltyTier?: LoyaltyTier;
  loyaltyPoints?: number;
  referralCode?: string | null;
  isBirthdayGift?: boolean;
  createdAt: string;
  expiresAt: string;
  openedAt: string | null;
  redeemedAt: string | null;
  cancelledAt?: string | null;
  appointmentAt?: string | null;
  appointmentNote?: string | null;
  wheelLabels?: string[];
  prize: {
    title: string;
    description: string;
    terms?: string;
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
    cancelledLinks: number;
    activePrizes: number;
    totalPrices: number;
    openRatePct: number;
    redemptionRatePct: number;
    returningClientsPct: number;
    avgInvoiceEgp: number;
    totalRevenueEgp: number;
    totalRewardCostEgp: number;
    contributionMarginEgp: number;
  };
}

export interface OfflineSyncMutation {
  id: string;
  type: 'create_link' | 'redeem_code' | 'cancel_link' | 'update_appointment' | 'open_box';
  createdAt: string;
  payload: Record<string, unknown>;
}
