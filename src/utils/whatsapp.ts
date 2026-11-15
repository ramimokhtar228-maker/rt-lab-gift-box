import type { BoxPublicResponse, GiftLink, LabProfile } from '../types';

export function formatWhatsAppPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
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

export function buildPatientClaimWhatsAppUrl(box: BoxPublicResponse, lab: LabProfile): string {
  const phone = formatWhatsAppPhone(lab.whatsappNumber || lab.hotlineNumber);
  const text = applyTemplate(lab.whatsappPatientClaimTemplate, {
    labName: lab.labName,
    clientName: box.clientName,
    prizeTitle: box.prize?.title || '',
    discountLabel: box.prize?.discountLabel || '',
    prizeCode: box.prize?.prizeCode || '',
    expiresAt: formatArabicDate(box.expiresAt),
    visitRef: box.visitRef,
    branchName: box.branchName,
  });
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
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
    labProfile: lab,
    prizes,
  });
  return applyTemplate(lab.whatsappInviteTemplate, {
    labName: lab.labName,
    clientName: link.clientName,
    boxUrl,
    visitRef: link.visitRef,
    branchName: link.branchName,
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
  const apptText = link.appointmentAt?.trim()
    ? `\n📅 الموعد المحدد: ${link.appointmentAt.trim()}${
        link.appointmentNote?.trim() ? ` (${link.appointmentNote.trim()})` : ''
      }`
    : '';

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
        return 'بانتظار الفتح';
      case 'opened':
        return 'كسب - بانتظار الصرف';
      case 'redeemed':
        return 'تم الصرف';
      case 'expired':
        return 'منتهي الصلاحية';
    }
  };

  const headers = [
    'اسم المريض',
    'رقم الواتساب',
    'الفرع',
    'رقم الزيارة',
    'الحالة',
    'الجائزة',
    'قيمة الخصم / الهدية',
    'كود الجائزة',
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
      statusLabel(l.status),
      l.prizeTitle || '—',
      l.prizeDiscountLabel || '—',
      l.prizeCode || l.token,
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
