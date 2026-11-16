import { useMemo, useState } from 'react';
import {
  CheckSquare,
  Clock,
  Edit3,
  Gift,
  ListPlus,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { Prize, PrizeCategory } from '../types';
import { DEFAULT_PRIZES, PRIZE_CATEGORY_META } from '../data/defaultPrizes';
import { apiClient } from '../services/apiClient';

interface AdminPrizesTabProps {
  prizes: Prize[];
  onRefresh: () => Promise<void>;
  onNotify: (msg: string, isError?: boolean) => void;
}

const EMPTY_PRIZE: Partial<Prize> = {
  title: '',
  description: '',
  terms: '',
  discountLabel: 'خصم 25%',
  category: 'DISCOUNT',
  validHours: 72,
  weight: 20,
  stock: 50,
  active: true,
};

function normalizePrizeCategory(cat: PrizeCategory): 'DISCOUNT' | 'FREE_SERVICE' | 'PHYSICAL_GIFT' | 'SURPRISE' {
  switch (cat) {
    case 'DISCOUNT':
    case 'discount':
      return 'DISCOUNT';
    case 'FREE_SERVICE':
    case 'free_test':
    case 'package':
    case 'home_visit':
      return 'FREE_SERVICE';
    case 'PHYSICAL_GIFT':
    case 'gift':
      return 'PHYSICAL_GIFT';
    case 'SURPRISE':
    default:
      return 'SURPRISE';
  }
}

export function AdminPrizesTab({
  prizes,
  onRefresh,
  onNotify,
}: AdminPrizesTabProps) {
  const [editing, setEditing] = useState<Partial<Prize> | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'DISCOUNT' | 'FREE_SERVICE' | 'PHYSICAL_GIFT' | 'SURPRISE'>('ALL');
  const [search, setSearch] = useState('');

  // Bulk Paste Import
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState<'DISCOUNT' | 'FREE_SERVICE' | 'PHYSICAL_GIFT' | 'SURPRISE'>('DISCOUNT');
  const [bulkHours, setBulkHours] = useState(72);
  const [bulkWeight, setBulkWeight] = useState(15);
  const [bulkStock, setBulkStock] = useState(50);
  const [importingBulk, setImportingBulk] = useState(false);
  const [seedingCatalog, setSeedingCatalog] = useState(false);

  const countsByCategory = useMemo(() => {
    const counts = {
      ALL: prizes.length,
      DISCOUNT: 0,
      FREE_SERVICE: 0,
      PHYSICAL_GIFT: 0,
      SURPRISE: 0,
    };
    for (const p of prizes) {
      counts[normalizePrizeCategory(p.category)] += 1;
    }
    return counts;
  }, [prizes]);

  const filteredPrizes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prizes.filter((p) => {
      if (categoryFilter !== 'ALL' && normalizePrizeCategory(p.category) !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.discountLabel.toLowerCase().includes(q)
      );
    });
  }, [prizes, categoryFilter, search]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || saving) return;
    setSaving(true);
    try {
      const data = await apiClient.upsertPrize(editing);
      if (!data.ok) {
        onNotify(data.message || 'تعذر حفظ الجائزة.', true);
      } else {
        setEditing(null);
        await onRefresh();
        onNotify('تم حفظ الجائزة وتحديث الصندوق بنجاح.');
      }
    } catch {
      onNotify('تعذر الاتصال بقاعدة البيانات.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (importingBulk) return;
    const lines = bulkText
      .split('\n')
      .map((l) => l.trim().replace(/^[-•*\d.)]+\s*/, ''))
      .filter((l) => l.length > 1);

    if (lines.length === 0) {
      onNotify('يرجى لصق جائزة واحدة على الأقل (كل جائزة في سطر).', true);
      return;
    }

    setImportingBulk(true);
    try {
      const items = lines.map((title) => {
        let discountLabel = 'هدية خاصة';
        const pctMatch = title.match(/\d+\s*%/);
        if (pctMatch) {
          discountLabel = `خصم ${pctMatch[0].replace(/\s+/g, '')}`;
        } else if (title.includes('مجاني') || title.includes('مجاناً')) {
          discountLabel = 'مجاني 100%';
        } else if (title.includes('قسيمة')) {
          const valMatch = title.match(/\d+/);
          discountLabel = valMatch ? `قسيمة ${valMatch[0]} ج.م` : 'قسيمة شراء';
        } else if (bulkCategory === 'SURPRISE') {
          discountLabel = 'مفاجأة RT';
        } else if (bulkCategory === 'PHYSICAL_GIFT') {
          discountLabel = 'هدية عينية';
        }
        return {
          title,
          category: bulkCategory,
          discountLabel,
          description: `${title} — جائزة من صندوق السعادة في معامل RT.`,
          validHours: bulkHours,
          weight: bulkWeight,
          stock: bulkStock,
        };
      });

      const res = await apiClient.bulkImportPrizes(items);
      if (res.ok) {
        setBulkText('');
        setShowBulkModal(false);
        await onRefresh();
        onNotify(`تم استيراد وإضافة ${res.count} جائزة بنجاح إلى قاعدة البيانات.`);
      }
    } catch {
      onNotify('تعذر استيراد الجوائز في قاعدة البيانات.', true);
    } finally {
      setImportingBulk(false);
    }
  };

  const handleSeedFullCatalog = async () => {
    if (seedingCatalog) return;
    setSeedingCatalog(true);
    try {
      const res = await apiClient.seedFullPrizeCatalog();
      if (res.ok) {
        await onRefresh();
        onNotify(`تم تحميل وتفعيل قائمة جوائز RT LAB الكاملة (${res.count} جائزة في 4 فئات).`);
      }
    } catch {
      onNotify('تعذر مزامنة قائمة الجوائز الكاملة.', true);
    } finally {
      setSeedingCatalog(false);
    }
  };

  const handleToggleAllFiltered = async (active: boolean) => {
    try {
      await apiClient.setPrizesActiveBatch(filteredPrizes, active);
      await onRefresh();
      onNotify(
        active
          ? `تم تفعيل ${filteredPrizes.length} جائزة بنجاح.`
          : `تم تعطيل ${filteredPrizes.length} جائزة مؤقتاً.`
      );
    } catch {
      onNotify('تعذر تحديث حالة الجوائز.', true);
    }
  };

  const handleToggleActive = async (prize: Prize) => {
    try {
      const data = await apiClient.upsertPrize({ ...prize, active: !prize.active });
      if (data.ok) {
        await onRefresh();
        onNotify(prize.active ? 'تم تعطيل الجائزة مؤقتاً.' : 'تم تفعيل الجائزة بالصندوق.');
      }
    } catch {
      onNotify('تعذر التحديث.', true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const ok = await apiClient.deletePrize(id);
      if (ok) {
        await onRefresh();
        onNotify('تم حذف الجائزة نهائياً من قاعدة البيانات.');
      }
    } catch {
      onNotify('تعذر الحذف.', true);
    }
  };

  const formatDuration = (hours: number) => {
    if (hours >= 24 && hours % 24 === 0) {
      const days = hours / 24;
      return `${days} ${days === 1 ? 'يوم' : days === 2 ? 'يومان' : 'أيام'} (${hours} ساعة)`;
    }
    return `${hours} ساعة`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            جوائز صندوق السعادة ({prizes.length} جائزة في 4 فئات)
          </h2>
          <p className="text-xs text-slate-500">
            عدّل أو عطّل أو احذف أي جائزة، أو الصق قائمة جوائز جديدة دفعة واحدة داخل التصنيفات الأربعة.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={seedingCatalog}
            onClick={handleSeedFullCatalog}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-extrabold text-amber-900 hover:bg-amber-100 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${seedingCatalog ? 'animate-spin' : ''}`} />
            <span>{seedingCatalog ? 'جاري التحميل...' : `تفعيل قائمة RT LAB الكاملة (${DEFAULT_PRIZES.length} جائزة)`}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowBulkModal((v) => !v)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
          >
            <ListPlus className="h-4 w-4 text-teal-700" />
            <span>لصق قائمة جوائز</span>
          </button>
          <button
            type="button"
            onClick={() => setEditing({ ...EMPTY_PRIZE })}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-teal-800 cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة جائزة</span>
          </button>
        </div>
      </div>

      {/* Bulk Paste Import Panel */}
      {showBulkModal ? (
        <form
          onSubmit={handleBulkImport}
          className="space-y-4 rounded-2xl border border-teal-200 bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-teal-900">
              استيراد / لصق قائمة جوائز دفعة واحدة (كل جائزة في سطر)
            </h3>
            <button
              type="button"
              onClick={() => setShowBulkModal(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
          <textarea
            rows={6}
            required
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={'الصق الجوائز هنا، كل جائزة في سطر مستقل:\nخصم 25% على جميع التحاليل.\nتحليل CBC مجاناً.\nقسيمة شراء بقيمة 100 جنيه.'}
            className="w-full rounded-xl border border-slate-300 p-3.5 text-xs leading-relaxed focus:border-teal-700 focus:outline-none"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">النوع في قاعدة البيانات</label>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value as typeof bulkCategory)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold focus:border-teal-700 focus:outline-none"
              >
                <option value="DISCOUNT">DISCOUNT — خصومات</option>
                <option value="FREE_SERVICE">FREE_SERVICE — تحاليل وفحوصات وزيارات</option>
                <option value="PHYSICAL_GIFT">PHYSICAL_GIFT — هدايا مادية</option>
                <option value="SURPRISE">SURPRISE — مفاجآت والسحب</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">المدة (ساعات)</label>
              <input
                type="number"
                min={1}
                max={2160}
                value={bulkHours}
                onChange={(e) => setBulkHours(Number(e.target.value) || 72)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-center font-mono text-xs focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">الوزن</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={bulkWeight}
                onChange={(e) => setBulkWeight(Number(e.target.value) || 15)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-center font-mono text-xs focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">المخزون لكل جائزة</label>
              <input
                type="number"
                min={1}
                max={100000}
                value={bulkStock}
                onChange={(e) => setBulkStock(Number(e.target.value) || 50)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-center font-mono text-xs focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={importingBulk}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-teal-700 px-5 py-2 text-xs font-extrabold text-white hover:bg-teal-800 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{importingBulk ? 'جاري الاستيراد...' : 'إدخال القائمة لقاعدة البيانات'}</span>
            </button>
          </div>
        </form>
      ) : null}

      {/* Add / Edit Single Prize Form */}
      {editing ? (
        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-2xl border border-teal-200 bg-white p-5 sm:p-6"
        >
          <h3 className="text-sm font-extrabold text-teal-900">
            {editing.id ? 'تعديل الجائزة' : 'إضافة جائزة جديدة للصندوق'}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">اسم الجائزة *</label>
              <input
                type="text"
                required
                value={editing.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="مثال: تحليل Vitamin D مجاناً"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">الشارة المختصرة *</label>
              <input
                type="text"
                required
                value={editing.discountLabel || ''}
                onChange={(e) => setEditing({ ...editing, discountLabel: e.target.value })}
                placeholder="مثال: مجاني 100% أو خصم 30%"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-slate-700">وصف الجائزة المختصر</label>
              <textarea
                rows={2}
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="ملخص واضح للجائزة يظهر للعميل..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-slate-700">
                الشروط والضوابط الكاملة (تظهر للمريض فور الضغط على البوكس)
              </label>
              <textarea
                rows={4}
                value={editing.terms || ''}
                onChange={(e) => setEditing({ ...editing, terms: e.target.value })}
                placeholder="اكتب كل شرط في سطر (مثال: نطاق العرض، الصيام المطلوب، مدة الصلاحية، طريقة الصرف بالمعمل). إذا تركته فارغاً سيتم توليد الشروط المناسبة تلقائياً."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs leading-relaxed focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">نوع الجائزة في قاعدة البيانات *</label>
              <select
                value={normalizePrizeCategory((editing.category || 'DISCOUNT') as PrizeCategory)}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as PrizeCategory })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold focus:border-teal-700 focus:outline-none"
              >
                <option value="DISCOUNT">DISCOUNT — خصومات</option>
                <option value="FREE_SERVICE">FREE_SERVICE — تحاليل وفحوصات وزيارات</option>
                <option value="PHYSICAL_GIFT">PHYSICAL_GIFT — هدايا مادية</option>
                <option value="SURPRISE">SURPRISE — مفاجآت والسحب</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                المدة المحددة بعد الفتح (بالساعات) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={2160}
                  required
                  value={editing.validHours ?? 72}
                  onChange={(e) => setEditing({ ...editing, validHours: Number(e.target.value) || 24 })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-center font-mono text-sm font-bold focus:border-teal-700 focus:outline-none"
                />
                <div className="flex shrink-0 gap-1">
                  {[24, 48, 72, 168].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setEditing({ ...editing, validHours: h })}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      {h === 168 ? '7 أيام' : `${h}س`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">احتمالية الظهور (الوزن)</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={editing.weight ?? 20}
                onChange={(e) => setEditing({ ...editing, weight: Number(e.target.value) || 10 })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-center font-mono text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">العدد المتاح (المخزون)</label>
              <input
                type="number"
                min={1}
                max={100000}
                value={editing.stock ?? 50}
                onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) || 10 })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-center font-mono text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-teal-700 px-5 py-2 text-xs font-extrabold text-white hover:bg-teal-800 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'جاري الحفظ...' : 'حفظ الجائزة'}</span>
            </button>
          </div>
        </form>
      ) : null}

      {/* Category Filter Tabs + Search + Batch Toggle */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'ALL', label: `الكل (${countsByCategory.ALL})` },
              { id: 'DISCOUNT', label: `DISCOUNT · خصومات (${countsByCategory.DISCOUNT})` },
              { id: 'FREE_SERVICE', label: `FREE_SERVICE · تحاليل وزيارات (${countsByCategory.FREE_SERVICE})` },
              { id: 'PHYSICAL_GIFT', label: `PHYSICAL_GIFT · هدايا مادية (${countsByCategory.PHYSICAL_GIFT})` },
              { id: 'SURPRISE', label: `SURPRISE · مفاجآت والسحب (${countsByCategory.SURPRISE})` },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCategoryFilter(f.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === f.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم الجائزة..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleToggleAllFiltered(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>تفعيل المعروض</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleAllFiltered(false)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <span>تعطيل المعروض</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prizes Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredPrizes.map((p) => {
          const normCat = normalizePrizeCategory(p.category);
          const meta = PRIZE_CATEGORY_META[normCat] || PRIZE_CATEGORY_META.DISCOUNT;
          return (
            <div
              key={p.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-opacity ${
                p.active
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-200 bg-slate-50 opacity-65'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}>
                    <Sparkles className="h-3 w-3" />
                    <span>{meta.label}</span>
                  </span>
                  <span className={`text-xs font-bold ${p.active ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {p.active ? 'مفعّلة بالصندوق' : 'معطّلة'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 pt-1">
                  <Gift className="h-3.5 w-3.5 shrink-0" />
                  <span>{p.discountLabel}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{p.title}</h3>
                <p className="text-xs leading-relaxed text-slate-600">{p.description}</p>
                {p.terms ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-[11px] leading-relaxed text-slate-600">
                    <span className="font-extrabold text-slate-700">الشروط المعروضة للعميل: </span>
                    <span className="line-clamp-2 whitespace-pre-line">{p.terms}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2 tabular-nums">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-teal-700" />
                    <span>{formatDuration(p.validHours)}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>المستخدم: {p.usedCount} / {p.stock}</span>
                  <span aria-hidden="true">·</span>
                  <span>الوزن: {p.weight}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(p)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                      p.active
                        ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {p.active ? 'تعطيل' : 'تفعيل'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...p })}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>تعديل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    title="حذف"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:border-rose-200 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
