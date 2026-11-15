import { useState } from 'react';
import { Clock, Edit3, Gift, Plus, Save, Trash2, X } from 'lucide-react';
import type { Prize, PrizeCategory } from '../types';
import { apiClient } from '../services/apiClient';

interface AdminPrizesTabProps {
  prizes: Prize[];
  adminToken: string;
  onRefresh: () => Promise<void>;
  onNotify: (msg: string, isError?: boolean) => void;
}

const EMPTY_FORM: Partial<Prize> = {
  title: '',
  description: '',
  discountLabel: 'خصم 25%',
  category: 'discount',
  validHours: 48,
  weight: 20,
  stock: 50,
  active: true,
};

export function AdminPrizesTab({
  prizes,
  adminToken,
  onRefresh,
  onNotify,
}: AdminPrizesTabProps) {
  const [editing, setEditing] = useState<Partial<Prize> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title?.trim() || saving) return;
    setSaving(true);
    try {
      const data = await apiClient.upsertPrize(adminToken, editing);
      if (!data.ok) {
        onNotify(data.message || 'تعذر حفظ الجائزة.', true);
      } else {
        setEditing(null);
        await onRefresh();
        onNotify('تم حفظ الجائزة داخل صندوق السعادة بنجاح.');
      }
    } catch {
      onNotify('تعذر الاتصال بالخادم.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (prize: Prize) => {
    try {
      const data = await apiClient.upsertPrize(adminToken, { ...prize, active: !prize.active });
      if (data.ok) {
        await onRefresh();
        onNotify(prize.active ? 'تم إيقاف الجائزة مؤقتاً.' : 'تم تفعيل الجائزة.');
      }
    } catch {
      onNotify('تعذر تحديث حالة الجائزة.', true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const ok = await apiClient.deletePrize(adminToken, id);
      if (ok) {
        await onRefresh();
        onNotify('تم حذف الجائزة من الصندوق.');
      }
    } catch {
      onNotify('تعذر حذف الجائزة.', true);
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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            إدارة الجوائز داخل صندوق السعادة ({prizes.length})
          </h2>
          <p className="text-xs text-slate-500">
            أضف أو عدّل الجوائز وحدد المدة الزمنية (بالساعات) المتاحة للمريض بعد فتح الصندوق.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY_FORM })}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-teal-800 cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة جائزة جديدة</span>
        </button>
      </div>

      {/* Add / Edit Prize Form */}
      {editing ? (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              {editing.id ? 'تعديل الجائزة' : 'إضافة جائزة جديدة للصندوق'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-slate-700">عنوان الجائزة *</label>
              <input
                type="text"
                required
                value={editing.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="مثال: خصم 30% على باقة الفحص الشامل"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">ملخص الخصم / الهدية</label>
              <input
                type="text"
                value={editing.discountLabel || ''}
                onChange={(e) => setEditing({ ...editing, discountLabel: e.target.value })}
                placeholder="مثال: خصم 30% أو مجاني 100%"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-slate-700">وصف الجائزة للمريض</label>
              <input
                type="text"
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="تفاصيل الاستفادة من الجائزة..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">التصنيف</label>
              <select
                value={editing.category || 'discount'}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as PrizeCategory })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              >
                <option value="discount">خصم على التحاليل</option>
                <option value="free_test">تحليل مجاني</option>
                <option value="package">باقة فحص</option>
                <option value="home_visit">سحب منزلي</option>
                <option value="gift">هدية خاصة</option>
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
                  value={editing.validHours ?? 48}
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
                max={100}
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
                max={10000}
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

      {/* Prizes List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {prizes.map((p) => (
          <div
            key={p.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 transition-opacity ${
              p.active
                ? 'border-slate-200 bg-white'
                : 'border-slate-200 bg-slate-50 opacity-70'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                    <Gift className="h-3.5 w-3.5" />
                    <span>{p.discountLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className={p.active ? 'text-emerald-700' : 'text-slate-500'}>
                      {p.active ? 'مفعّلة بالصندوق' : 'متوقفة'}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{p.title}</h3>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">{p.description}</p>
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
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {p.active ? 'إيقاف' : 'تفعيل'}
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
        ))}
      </div>
    </div>
  );
}
