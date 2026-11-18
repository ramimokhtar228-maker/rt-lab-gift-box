import { BarChart3, CheckCircle2, Coins, Layers, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import type { AdminDashboardData, DistributionTier, GiftLink } from '../types';
import { resolvePrizeDistributionTier } from '../data/defaultPrizes';
import { DEFAULT_DISTRIBUTION_TARGETS } from '../services/apiClient';

interface AdminAnalyticsTabProps {
  dashboardData: AdminDashboardData;
}

const TIER_META: Array<{
  tier: DistributionTier;
  targetKey: keyof NonNullable<AdminDashboardData['labProfile']['distributionTargets']>;
  title: string;
  example: string;
  barColor: string;
}> = [
  {
    tier: 'disc_mid',
    targetKey: 'discMid',
    title: 'خصومات متوسطة (30% - 50%)',
    example: 'خصم 30%–50% على التحاليل والزيارات',
    barColor: 'bg-[#5C1422]',
  },
  {
    tier: 'disc_high',
    targetKey: 'discHigh',
    title: 'خصومات قوية (60% - 80%)',
    example: 'خصم 60%–80% على تحاليل وباقات محددة',
    barColor: 'bg-[#7A1C2E]',
  },
  {
    tier: 'paid_offer',
    targetKey: 'paidOffer',
    title: 'عروض مدفوعة خاصة (باقات معلنة)',
    example: '5 تحاليل بـ 299 ج.م / باقة 399 / 555',
    barColor: 'bg-[#C9962D]',
  },
  {
    tier: 'free_gift',
    targetKey: 'freeGift',
    title: 'هدايا مجانية (تحليل / زيارة مجانية)',
    example: 'CBC أو FBS أو زيارة منزلية مجاناً',
    barColor: 'bg-emerald-700',
  },
  {
    tier: 'grand_prize',
    targetKey: 'grandPrize',
    title: 'جوائز كبرى (VIP / قسائم شراء)',
    example: 'قسائم 100–500 ج.م أو فحص VIP 999 ج.م',
    barColor: 'bg-amber-600',
  },
  {
    tier: 'vip_surprise',
    targetKey: 'vipSurprise',
    title: 'مفاجآت VIP والسحب والولاء',
    example: 'تذكرة سحب، رسالة د. رامي، معاملة VIP',
    barColor: 'bg-slate-800',
  },
];

function classifyLinkTier(lnk: GiftLink): DistributionTier {
  if (!lnk.prizeCategory && !lnk.prizeTitle) return 'disc_mid';
  return resolvePrizeDistributionTier({
    category: lnk.prizeCategory || 'DISCOUNT',
    title: lnk.prizeTitle || '',
    discountLabel: lnk.prizeDiscountLabel || '',
  });
}

export function AdminAnalyticsTab({ dashboardData }: AdminAnalyticsTabProps) {
  const { stats, prizes, giftLinks, labProfile } = dashboardData;
  const targets = labProfile.distributionTargets || DEFAULT_DISTRIBUTION_TARGETS;

  const activePrizes = prizes.filter((p) => p.active);
  const totalWeight = Math.max(
    1,
    activePrizes.reduce((sum, p) => sum + Math.max(1, p.weight), 0)
  );
  const issuedLinks = giftLinks.filter((l) => Boolean(l.prizeTitle));
  const totalIssued = Math.max(1, issuedLinks.length);

  // Loyalty distribution
  const loyaltyCounts = {
    Basic: giftLinks.filter((l) => (l.loyaltyTier || 'Basic') === 'Basic').length,
    Plus: giftLinks.filter((l) => l.loyaltyTier === 'Plus').length,
    VIP: giftLinks.filter((l) => l.loyaltyTier === 'VIP').length,
    Birthdays: giftLinks.filter((l) => l.isBirthdayGift).length,
    Referrals: giftLinks.filter((l) => Boolean(l.referredBy)).length,
  };

  const marginRatio =
    stats.totalRevenueEgp > 0
      ? Math.round((stats.contributionMarginEgp / stats.totalRevenueEgp) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Slide 9: Core Program KPIs & ROI Control */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
              <BarChart3 className="h-5 w-5 text-[#5C1422]" />
              <span>مؤشرات الأداء والتحكم في التكلفة والعائد (ROI)</span>
            </h2>
            <p className="text-xs text-slate-500">
              متابعة نسب الفتح والصرف والعملاء العائدين وصافي هامش المساهمة بعد خصم تكلفة المكافآت.
            </p>
          </div>
          <span className="rounded-xl border border-[#C9962D]/40 bg-[#FFF8EB] px-3 py-1.5 text-xs font-extrabold text-[#5C1422]">
            صافي هامش المساهمة: {marginRatio}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'معدل الفتح (Open Rate)', val: `${stats.openRatePct}%`, sub: `${stats.openedLinks + stats.redeemedLinks} من ${stats.totalLinks}`, color: 'text-[#5C1422]' },
            { label: 'معدل الصرف (Redemption)', val: `${stats.redemptionRatePct}%`, sub: `${stats.redeemedLinks} كود مصروف`, color: 'text-emerald-700' },
            { label: 'نسبة العملاء العائدين', val: `${stats.returningClientsPct}%`, sub: 'تكرار الزيارات أو ولاء Plus/VIP', color: 'text-[#B8860B]' },
            { label: 'متوسط الفاتورة', val: `${stats.avgInvoiceEgp.toLocaleString('en-US')} ج.م`, sub: 'لكل كود مصروف', color: 'text-slate-900' },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl border border-slate-200 bg-[#FAF7F4] p-4">
              <div className="text-[11px] font-bold text-slate-500">{k.label}</div>
              <div className={`mt-1 font-mono text-2xl font-extrabold tabular-nums ${k.color}`}>{k.val}</div>
              <div className="mt-0.5 text-[11px] text-slate-500">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div>
              <div className="text-xs font-bold text-emerald-900">إجمالي إيرادات الأكواد المصروفة</div>
              <div className="mt-1 font-mono text-xl font-extrabold text-emerald-800 tabular-nums">
                {stats.totalRevenueEgp.toLocaleString('en-US')} ج.م
              </div>
            </div>
            <TrendingUp className="h-7 w-7 text-emerald-700" />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div>
              <div className="text-xs font-bold text-amber-900">تكلفة الهدايا والخصومات الفعلية</div>
              <div className="mt-1 font-mono text-xl font-extrabold text-amber-800 tabular-nums">
                {stats.totalRewardCostEgp.toLocaleString('en-US')} ج.م
              </div>
            </div>
            <Coins className="h-7 w-7 text-amber-700" />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#5C1422]/20 bg-[#5C1422]/5 p-4">
            <div>
              <div className="text-xs font-bold text-[#5C1422]">صافي الربح الإضافي (Contribution Margin)</div>
              <div className="mt-1 font-mono text-xl font-extrabold text-[#5C1422] tabular-nums">
                {stats.contributionMarginEgp.toLocaleString('en-US')} ج.م
              </div>
            </div>
            <CheckCircle2 className="h-7 w-7 text-[#5C1422]" />
          </div>
        </div>
      </section>

      {/* Slide 4: 1,000-Prize Distribution Model Matrix */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
            <Layers className="h-5 w-5 text-[#5C1422]" />
            <span>نموذج توزيع الجوائز الاستراتيجي (عينة 1,000 صندوق)</span>
          </h2>
          <p className="text-xs text-slate-500">
            مقارنة الوزن الحالي داخل كتالوج الجوائز ومعدل المنصرف الفعلي أمام النسب المستهدفة للربحية.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 pl-3 font-bold">الفئة</th>
                <th className="py-2.5 px-3 font-bold">المستهدف (من 1000)</th>
                <th className="py-2.5 px-3 font-bold">وزن الكتالوج الحالي</th>
                <th className="py-2.5 px-3 font-bold">المنصرف الفعلي</th>
                <th className="py-2.5 pr-3 font-bold">مؤشر التوازن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TIER_META.map((row) => {
                const tierPrizes = activePrizes.filter(
                  (p) => resolvePrizeDistributionTier(p) === row.tier
                );
                const tierWeight = tierPrizes.reduce((s, p) => s + Math.max(1, p.weight), 0);
                const catalogPct = Math.round((tierWeight / totalWeight) * 100);
                const targetPct = targets[row.targetKey];
                const issuedCount = issuedLinks.filter((l) => classifyLinkTier(l) === row.tier).length;
                const issuedPct =
                  issuedLinks.length > 0 ? Math.round((issuedCount / totalIssued) * 100) : 0;
                return (
                  <tr key={row.tier} className="hover:bg-[#FAF7F4]/80">
                    <td className="py-3 pl-3">
                      <div className="font-extrabold text-slate-900">{row.title}</div>
                      <div className="text-[11px] text-slate-500">{row.example}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-extrabold text-[#5C1422] tabular-nums">
                      {targetPct}% ({targetPct * 10} صندوق)
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 tabular-nums">
                      {catalogPct}% ({tierPrizes.length} جائزة)
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700 tabular-nums">
                      {issuedLinks.length > 0 ? `${issuedPct}% (${issuedCount})` : '—'}
                    </td>
                    <td className="py-3 pr-3 min-w-[140px]">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${row.barColor}`}
                          style={{ width: `${Math.min(100, Math.max(4, catalogPct))}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slide 7 & 10: Code Status + Loyalty Tiers + Ethics Statement + Roadmap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <Users className="h-4 w-4 text-[#5C1422]" />
            <span>تصنيف مستويات الولاء ودورة حياة الأكواد</span>
          </h3>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-bold text-slate-500">Basic</div>
              <div className="mt-1 font-mono text-lg font-extrabold text-slate-900 tabular-nums">
                {loyaltyCounts.Basic}
              </div>
            </div>
            <div className="rounded-xl border border-[#C9962D]/40 bg-[#FFF8EB] p-3">
              <div className="text-[11px] font-bold text-[#7A5600]">Plus</div>
              <div className="mt-1 font-mono text-lg font-extrabold text-[#7A5600] tabular-nums">
                {loyaltyCounts.Plus}
              </div>
            </div>
            <div className="rounded-xl border border-[#5C1422]/25 bg-[#5C1422] p-3 text-white">
              <div className="text-[11px] font-bold text-[#E7C15A]">VIP</div>
              <div className="mt-1 font-mono text-lg font-extrabold tabular-nums">
                {loyaltyCounts.VIP}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              أكواد ملغاة (Cancelled): {stats.cancelledLinks}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              منتهية الصلاحية: {stats.expiredLinks}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              هدايا أعياد الميلاد: {loyaltyCounts.Birthdays}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              إحالات الأصدقاء: {loyaltyCounts.Referrals}
            </span>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-[#C9962D]/35 bg-[#FFF8EB]/60 p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#5C1422]">
            <ShieldCheck className="h-4 w-4 text-[#B8860B]" />
            <span>ميثاق الشفافية الأخلاقية وخارطة المراحل (Slides 9 &amp; 10)</span>
          </h3>
          <p className="text-xs leading-relaxed text-slate-700">
            تلتزم معامل RT بعرض جميع شروط الجوائز والأسعار ومدة الصلاحية بوضوح كامل، مع منع تغيير الجائزة بعد الحسم ومنع الصرف المزدوج، ولا يُشترط أبداً إجراء تحاليل غير لازمة طبياً للعب.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-[11px]">
            {[
              { phase: 'المرحلة 1 · MVP', desc: 'صندوق تفاعلي + أكواد + تحقق QR/WhatsApp + قاعدة بيانات سحابية', done: true },
              { phase: 'المرحلة 2 · متقدم', desc: '6 ألعاب تفاعلية + لوحة ROI وتوزيع الجوائز + تقارير CSV', done: true },
              { phase: 'المرحلة 3 · الولاء', desc: 'مستويات Basic/Plus/VIP + إحالات الأصدقاء + وضع أوفلاين PWA', done: true },
            ].map((p) => (
              <div key={p.phase} className="rounded-xl border border-[#C9962D]/30 bg-white p-3">
                <div className="font-extrabold text-[#5C1422]">{p.phase}</div>
                <div className="mt-1 leading-relaxed text-slate-600">{p.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
