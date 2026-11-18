import type { BoxPublicResponse, GiftLink, LabProfile, PrizeCategory } from '../types';
import { resolvePrizeTermsLines } from '../data/defaultPrizes';
import { normalizeArabicDigits } from './phoneHash';

export function formatWhatsAppPhone(raw: string): string {
  let digits = normalizeArabicDigits(String(raw || '')).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }
  if (digits.startsWith('01') && digits.length === 11) {
    return `2${digits}`;
  }
  if (digits.startsWith('0') && digits.length >= 10) {
    return `20${digits.slice(1)}`;
  }
  return digits;
}

export function formatArabicDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function getTimeRemaining(expiresAt: string): {
  expired: boolean;
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  humanLabel: string;
} {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) {
    return {
      expired: true,
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      humanLabel: 'انتهت الصلاحية',
    };
  }
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} يوم`);
  if (hours > 0) parts.push(`${hours} ساعة`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} دقيقة`);
  const humanLabel = parts.length > 0 ? `متبقي ${parts.join(' و ')}` : `متبقي ${seconds} ثانية`;
  return {
    expired: false,
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    humanLabel,
  };
}

function applyTemplate(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, val] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, val);
  }
  return out;
}

export function resolvePublicBaseUrl(serverShareBaseUrl?: string, labShareBaseUrl?: string): string {
  const custom = (labShareBaseUrl || '').trim();
  if (custom) return custom.replace(/\/$/, '');
  if (serverShareBaseUrl && serverShareBaseUrl.trim()) {
    return serverShareBaseUrl.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const origin = window.location.origin.includes('://ais-dev-')
      ? window.location.origin.replace('://ais-dev-', '://ais-pre-')
      : window.location.origin;
    return `${origin}${base}`;
  }
  return '';
}

function encodeBase64UrlUtf8(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    bytes.forEach((b) => {
      bin += String.fromCharCode(b);
    });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

export function buildBoxUrl(
  baseUrl: string,
  token: string,
  meta?: {
    clientName?: string;
    clientPhone?: string;
    branchName?: string;
    visitRef?: string;
    expiresAt?: string;
    gameMode?: string;
    labProfile?: LabProfile;
    prizes?: Array<{ title: string; discountLabel: string; validHours: number; weight: number; active: boolean }>;
  }
): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const params = new URLSearchParams();
  params.set('box', token);
  if (meta?.clientName) {
    const activePrizes = (meta.prizes || [])
      .filter((p) => p.active)
      .slice(0, 8)
      .map((p) => [p.title, p.discountLabel, p.validHours, p.weight]);
    const encoded = encodeBase64UrlUtf8(
      JSON.stringify({
        n: meta.clientName,
        p: meta.clientPhone || '',
        b: meta.branchName || '',
        v: meta.visitRef || '',
        e: meta.expiresAt || '',
        ...(meta.gameMode ? { gm: meta.gameMode } : {}),
        ...(meta.labProfile
          ? {
              ln: meta.labProfile.labName,
              wa: meta.labProfile.whatsappNumber,
              ht: meta.labProfile.hotlineNumber,
            }
          : {}),
        ...(activePrizes.length > 0 ? { pz: activePrizes } : {}),
      })
    );
    if (encoded) params.set('d', encoded);
  }
  return `${cleanBase}/?${params.toString()}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function buildFormattedPrizeTermsText(params: {
  title?: string | null;
  category?: PrizeCategory | null;
  terms?: string | null;
  validHours?: number | null;
}): string {
  const lines = resolvePrizeTermsLines({
    title: params.title || 'جائزة صندوق السعادة',
    category: params.category || 'DISCOUNT',
    terms: params.terms || undefined,
    validHours: params.validHours || 48,
  });
  return lines.map((line) => `• ${line}`).join('\n');
}

export function buildPatientClaimWhatsAppUrl(box: BoxPublicResponse, lab: LabProfile): string {
  const phone = formatWhatsAppPhone(lab.whatsappNumber || lab.hotlineNumber);
  const prizeTerms = buildFormattedPrizeTermsText({
    title: box.prize?.title,
    category: box.prize?.category,
    terms: box.prize?.terms,
    validHours: box.prize?.validHours,
  });
  let text = applyTemplate(lab.whatsappPatientClaimTemplate, {
    labName: lab.labName,
    clientName: box.clientName,
    boxToken: box.token,
    prizeTitle: box.prize?.title || '',
    discountLabel: box.prize?.discountLabel || '',
    prizeCode: box.prize?.prizeCode || '',
    expiresAt: formatArabicDate(box.expiresAt),
    visitRef: box.visitRef,
    branchName: box.branchName,
    whatsappNumber: phone || lab.whatsappNumber,
    hotlineNumber: lab.hotlineNumber,
    prizeTerms,
  });
  if (!lab.whatsappPatientClaimTemplate.includes('{boxToken}') && box.token) {
    text = `${text}\nرقم الصندوق: ${box.token}`;
  }
  if (!lab.whatsappPatientClaimTemplate.includes('{prizeTerms}') && prizeTerms) {
    text = `${text}\n\n📋 شروط الجائزة وضوابط الاستفادة الكاملة:\n${prizeTerms}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function buildFriendReferralWhatsAppUrl(
  referralCode: string,
  clientName: string,
  lab: LabProfile,
  baseUrl: string
): string {
  const cleanBase = (baseUrl || lab.shareBaseUrl || 'https://ramimokhtar228-maker.github.io/rt-lab-gift-box').replace(
    /\/$/,
    ''
  );
  const inviteUrl = `${cleanBase}/?ref=${encodeURIComponent(referralCode)}`;
  const msg = `أهلاً بك 🌟\nيرشح لك ${clientName} تجربة صندوق الفرحة من ${lab.labName} لتحصل على هدية أو خصم مضمون!\nاستخدم كود الدعوة: ${referralCode}\nافتح صندوقك من هنا:\n${inviteUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

export function buildAdminInviteText(
  link: GiftLink,
  lab: LabProfile,
  baseUrl: string,
  prizes?: Array<{ title: string; discountLabel: string; validHours: number; weight: number; active: boolean }>
): string {
  const boxUrl = buildBoxUrl(baseUrl, link.token, {
    clientName: link.clientName,
    clientPhone: link.clientPhone,
    branchName: link.branchName,
    visitRef: link.visitRef,
    expiresAt: link.expiresAt,
    gameMode: link.gameMode,
    labProfile: lab,
    prizes,
  });
  const labPhone = formatWhatsAppPhone(lab.whatsappNumber || lab.hotlineNumber);
  return applyTemplate(lab.whatsappInviteTemplate, {
    labName: lab.labName,
    clientName: link.clientName,
    boxUrl,
    visitRef: link.visitRef,
    branchName: link.branchName,
    whatsappNumber: labPhone || lab.whatsappNumber,
    hotlineNumber: lab.hotlineNumber,
  });
}

export function buildAdminInviteWhatsAppUrl(
  link: GiftLink,
  lab: LabProfile,
  baseUrl: string,
  prizes?: Array<{ title: string; discountLabel: string; validHours: number; weight: number; active: boolean }>
): string {
  const phone = formatWhatsAppPhone(link.clientPhone);
  const text = buildAdminInviteText(link, lab, baseUrl, prizes);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function buildAdminWinnerReplyWhatsAppUrl(link: GiftLink, lab: LabProfile): string {
  const phone = formatWhatsAppPhone(link.clientPhone);
  const labPhone = formatWhatsAppPhone(lab.whatsappNumber || lab.hotlineNumber);
  const apptText = link.appointmentAt?.trim()
    ? `\n📅 الموعد المحدد: ${link.appointmentAt.trim()}${
        link.appointmentNote?.trim() ? ` (${link.appointmentNote.trim()})` : ''
      }`
    : '';

  const prizeTerms = buildFormattedPrizeTermsText({
    title: link.prizeTitle,
    category: link.prizeCategory,
    terms: link.prizeTerms,
    validHours: link.validHours,
  });

  let text = applyTemplate(lab.whatsappWinnerReplyTemplate, {
    labName: lab.labName,
    clientName: link.clientName,
    prizeTitle: link.prizeTitle || 'هدية خاصة',
    discountLabel: link.prizeDiscountLabel || 'عرض خاص',
    prizeCode: link.prizeCode || link.token,
    expiresAt: formatArabicDate(link.expiresAt),
    visitRef: link.visitRef,
    branchName: link.branchName || '',
    appointmentAt: link.appointmentAt?.trim() || 'لم يحدد بعد',
    whatsappNumber: labPhone || lab.whatsappNumber,
    hotlineNumber: lab.hotlineNumber,
    prizeTerms,
  });

  if (!lab.whatsappWinnerReplyTemplate.includes('{appointmentAt}') && apptText) {
    text = `${text}${apptText}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function csvCell(val: string | number | null | undefined): string {
  const str = String(val ?? '');
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportLinksExcelCsv(links: GiftLink[]): void {
  const statusLabel = (s: GiftLink['status']) => {
    switch (s) {
      case 'pending':
        return 'جديد - بانتظار الفتح';
      case 'opened':
        return 'مكتشف - بانتظار الصرف';
      case 'redeemed':
        return 'مستخدم - تم الصرف';
      case 'expired':
        return 'منتهي الصلاحية';
      case 'cancelled':
        return 'ملغي';
    }
  };

  const headers = [
    'اسم المريض',
    'رقم الواتساب',
    'الفرع',
    'رقم الزيارة',
    'الحملة',
    'نوع اللعبة',
    'مستوى الولاء',
    'الحالة',
    'الجائزة',
    'قيمة الخصم / الهدية',
    'كود الجائزة',
    'قيمة الفاتورة (ج.م)',
    'تكلفة المكافأة (ج.م)',
    'موعد الحضور / السحب',
    'ملاحظات الموعد',
    'تاريخ الفتح',
    'انتهاء الصلاحية',
    'تاريخ الصرف',
  ];

  const rows = links.map((l) =>
    [
      l.clientName,
      l.clientPhone,
      l.branchName,
      l.visitRef,
      l.campaignName || '—',
      l.gameMode || 'box',
      l.loyaltyTier || 'Basic',
      statusLabel(l.status),
      l.prizeTitle || '—',
      l.prizeDiscountLabel || '—',
      l.prizeCode || l.token,
      l.invoiceAmount ?? '',
      l.rewardCost ?? '',
      l.appointmentAt || '—',
      l.appointmentNote || '—',
      formatArabicDate(l.openedAt),
      formatArabicDate(l.expiresAt),
      formatArabicDate(l.redeemedAt),
    ]
      .map(csvCell)
      .join(',')
  );

  const csv = [headers.map(csvCell).join(','), ...rows].join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rt-lab-patients-winners-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
