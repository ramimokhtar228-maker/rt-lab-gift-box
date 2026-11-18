import type { AppLang, GameMode, LinkStatus } from '../types';

export const GAME_MODE_META: Record<
  GameMode,
  {
    id: GameMode;
    nameAr: string;
    nameEn: string;
    descAr: string;
    descEn: string;
    ctaAr: string;
    ctaEn: string;
  }
> = {
  box: {
    id: 'box',
    nameAr: 'الصندوق الأساسي',
    nameEn: 'Classic Box',
    descAr: 'ضغطة واحدة تفتح صندوق الفرحة وتكشف جائزتك المضمونة فوراً.',
    descEn: 'One tap opens the Happiness Box and reveals your guaranteed reward.',
    ctaAr: 'افتح صندوقك الآن',
    ctaEn: 'Open Your Box Now',
  },
  three_boxes: {
    id: 'three_boxes',
    nameAr: 'ثلاثة صناديق',
    nameEn: 'Three Boxes',
    descAr: 'اختر صندوقاً واحداً من الصناديق الثلاثة لتكشف جائزتك المخصصة مسبقاً.',
    descEn: 'Pick one of the three luxury boxes to unveil your pre-assigned reward.',
    ctaAr: 'اختر أحد الصناديق الثلاثة',
    ctaEn: 'Pick One of the 3 Boxes',
  },
  wheel: {
    id: 'wheel',
    nameAr: 'عجلة الحظ',
    nameEn: 'Lucky Wheel',
    descAr: 'أدر عجلة الحظ التفاعلية لترى هديتك من معامل RT.',
    descEn: 'Spin the RT LAB Lucky Wheel to reveal your reward.',
    ctaAr: 'أدر عجلة الحظ الآن',
    ctaEn: 'Spin the Wheel Now',
  },
  scratch: {
    id: 'scratch',
    nameAr: 'اكشف جائزتك (بطاقة خدش)',
    nameEn: 'Scratch & Win Card',
    descAr: 'امسح الطبقة الذهبية بأصبعك أو المؤشر لتكشف الخصم أو العرض.',
    descEn: 'Scratch the golden foil layer to reveal your discount or offer.',
    ctaAr: 'امسح البطاقة الذهبية',
    ctaEn: 'Scratch the Golden Card',
  },
  secret: {
    id: 'secret',
    nameAr: 'رسالة سرية من RT',
    nameEn: 'Secret RT Message',
    descAr: 'مكافأة ورسالة تقدير خاصة مختومة من إدارة RT LAB ود. رامي مختار.',
    descEn: 'A sealed appreciation note and reward from RT LAB & Dr. Rami Mokhtar.',
    ctaAr: 'افتح الرسالة السرية',
    ctaEn: 'Open Secret Message',
  },
  seasonal: {
    id: 'seasonal',
    nameAr: 'مفاجأة موسمية',
    nameEn: 'Seasonal Surprise',
    descAr: 'تجربة احتفالية خاصة بالأعياد والمناسبات السعيدة من معامل RT.',
    descEn: 'Special festive campaign experience from RT LAB.',
    ctaAr: 'افتح المفاجأة الموسمية',
    ctaEn: 'Open Seasonal Surprise',
  },
};

export function getStatusLabel(status: LinkStatus, lang: AppLang): string {
  if (lang === 'en') {
    switch (status) {
      case 'pending':
        return 'New · Pending';
      case 'opened':
        return 'Discovered · Ready';
      case 'redeemed':
        return 'Redeemed';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
    }
  }
  switch (status) {
    case 'pending':
      return 'جديد · بانتظار الفتح';
    case 'opened':
      return 'مكتشف · بانتظار الصرف';
    case 'redeemed':
      return 'مستخدم · تم الصرف';
    case 'expired':
      return 'منتهي الصلاحية';
    case 'cancelled':
      return 'ملغي من الإدارة';
  }
}

export const UI_COPY = {
  ar: {
    brandSubtitle: 'بوكس الفرحة · منظومة الولاء والسعادة',
    whatsappLab: 'واتساب المعمل',
    installApp: 'تنزيل التطبيق',
    installedBadge: 'التطبيق مثبت',
    offlineBanner: 'تعمل الآن بدون إنترنت (وضع أوفلاين) — تُحفظ التغييرات وتتم مزامنتها تلقائياً عند عودة الشبكة.',
    syncingBanner: 'جاري مزامنة العمليات المحفوظة أثناء انقطاع الإنترنت...',
    pendingSyncSuffix: 'عملية بانتظار المزامنة',
    adminAccess: 'الإدارة',
    journeyTitle: 'رحلتك نحو المكافأة',
    journeySteps: [
      { num: '01', title: 'استلام الرابط', sub: 'عبر WhatsApp أو الاستقبال' },
      { num: '02', title: 'فتح الصندوق', sub: 'تجربة تفاعلية ممتعة' },
      { num: '03', title: 'اكتشاف الجائزة', sub: 'محسومة مسبقاً بشفافية' },
      { num: '04', title: 'استلام الكود', sub: 'فريد مع الشروط والمدة' },
      { num: '05', title: 'استخدام المكافأة', sub: 'بالفرع أو الزيارة المنزلية' },
    ],
    precommitNote: 'مبدأ أساسي: الجائزة تُحسم وتُحفظ قبل عرض اللعبة، ولا تتغير بإعادة التحميل.',
    ethicsNote:
      'تُعرض شروط الجوائز والأسعار والصلاحية بوضوح، ولا يُشترط إجراء تحاليل غير لازمة طبياً للحصول على فرصة اللعب.',
    loyaltyTitle: 'بطاقة الولاء والمكافآت',
    loyaltyPointsLabel: 'نقاط الولاء',
    referralTitle: 'ادعُ صديقاً واحصل على نقاط إضافية',
    copyCode: 'نسخ الكود',
    copied: 'تم النسخ',
    sendWhatsApp: 'أرسل جائزتك إلى واتساب المعمل الآن',
    prizeCodeLabel: 'كود الجائزة الفريد الخاص بك',
    termsTitle: 'شروط الجائزة وضوابط الاستفادة الكاملة',
    validFor: 'صلاحية العرض',
    hours: 'ساعة من الفتح',
    remainingTimeTitle: 'الوقت المتبقي لاستخدام الجائزة',
    expiresAtPrefix: 'ينتهي في',
    statusRedeemedTitle: 'تم صرف الجائزة وتفعيلها بالمعمل بنجاح',
    statusCancelledTitle: 'تم إلغاء هذا الكود من قِبل إدارة المعمل',
    statusExpiredTitle: 'انتهت المدة المحددة لصلاحية هذه الجائزة',
    patientModeTitle: 'افتح مفاجأتك واكتشف جائزتك',
    patientModeLead:
      'أهلاً بك في تجربة RT LAB Happiness Box. اختر تجربتك أو سجّل بياناتك لتكشف جائزتك المضمونة بكود فريد وشروط واضحة.',
    fullNamePlaceholder: 'الاسم بالكامل',
    phonePlaceholder: '010xxxxxxxx',
    startPlayBtn: 'اكشف هديتك الآن',
    switchGameLabel: 'اختر أسلوب اللعب التفاعلي',
  },
  en: {
    brandSubtitle: 'Happiness Box · Loyalty & Rewards',
    whatsappLab: 'Lab WhatsApp',
    installApp: 'Install App',
    installedBadge: 'App Installed',
    offlineBanner: 'Offline mode active — actions are safely saved locally and sync automatically when online.',
    syncingBanner: 'Syncing queued offline operations with cloud...',
    pendingSyncSuffix: 'pending sync',
    adminAccess: 'Admin',
    journeyTitle: 'Your 5-Step Reward Journey',
    journeySteps: [
      { num: '01', title: 'Receive Link', sub: 'Via WhatsApp or Reception' },
      { num: '02', title: 'Open Box', sub: 'Interactive Surprise' },
      { num: '03', title: 'Discover Prize', sub: 'Pre-committed & Fair' },
      { num: '04', title: 'Receive Code', sub: 'Unique code & terms' },
      { num: '05', title: 'Redeem Reward', sub: 'At Branch or Home Visit' },
    ],
    precommitNote: 'Core Rule: Your prize is determined and locked before display and never changes on reload.',
    ethicsNote:
      'All prize terms, pricing, and validity are displayed transparently; no medically unnecessary tests are ever required to play.',
    loyaltyTitle: 'Loyalty Tier & Rewards',
    loyaltyPointsLabel: 'Loyalty Points',
    referralTitle: 'Invite a friend & earn bonus points',
    copyCode: 'Copy Code',
    copied: 'Copied',
    sendWhatsApp: 'Send Your Prize to RT LAB WhatsApp',
    prizeCodeLabel: 'Your Unique Reward Code',
    termsTitle: 'Full Prize Terms & Conditions',
    validFor: 'Offer Validity',
    hours: 'hours from opening',
    remainingTimeTitle: 'Time Remaining to Redeem',
    expiresAtPrefix: 'Expires on',
    statusRedeemedTitle: 'Reward Successfully Redeemed at RT LAB',
    statusCancelledTitle: 'This reward code has been cancelled by RT LAB admin',
    statusExpiredTitle: 'Reward Validity Period Has Expired',
    patientModeTitle: 'Open Your Surprise & Discover Your Prize',
    patientModeLead:
      'Welcome to RT LAB Happiness Box. Register or tap play to unlock your guaranteed reward with full terms and a unique code.',
    fullNamePlaceholder: 'Full Name',
    phonePlaceholder: '010xxxxxxxx',
    startPlayBtn: 'Reveal Your Gift Now',
    switchGameLabel: 'Interactive Mode',
  },
} as const;
