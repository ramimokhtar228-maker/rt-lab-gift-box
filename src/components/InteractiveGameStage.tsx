import { useEffect, useRef, useState } from 'react';
import { Gift, LockKeyhole, Mail, Sparkles, Stars } from 'lucide-react';
import type { AppLang, GameMode } from '../types';
import { GAME_MODE_META } from '../i18n/translations';
import sealedBoxImg from '../assets/images/sealed_happiness_box_1794768643734.jpg';

interface InteractiveGameStageProps {
  mode: GameMode;
  lang: AppLang;
  opening: boolean;
  campaignName?: string | null;
  wheelLabels?: string[];
  onPlay: (selectedBoxIndex?: number) => void;
}

const DEFAULT_WHEEL = [
  'خصم 30%',
  'خصم 50%',
  'تحليل مجاني',
  'عرض 299 ج.م',
  'زيارة مجانية',
  'مفاجأة VIP',
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
}

export function InteractiveGameStage({
  mode,
  lang,
  opening,
  campaignName,
  wheelLabels,
  onPlay,
}: InteractiveGameStageProps) {
  const meta = GAME_MODE_META[mode] || GAME_MODE_META.box;
  const [sealedImgError, setSealedImgError] = useState(false);
  const [pickedBoxIdx, setPickedBoxIdx] = useState<number | null>(null);
  const [wheelSpinDeg, setWheelSpinDeg] = useState(0);

  // Scratch canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const scratchTriggeredRef = useRef(false);
  const strokeCountRef = useRef(0);
  const [scratchPct, setScratchPct] = useState(0);

  useEffect(() => {
    if (mode !== 'scratch') return;
    scratchTriggeredRef.current = false;
    strokeCountRef.current = 0;
    setScratchPct(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#B8860B');
    grad.addColorStop(0.5, '#E7C15A');
    grad.addColorStop(1, '#9A6E08');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle diagonal shimmer lines
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    for (let x = -canvas.height; x < canvas.width + canvas.height; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + canvas.height, canvas.height);
      ctx.stroke();
    }

    // Center prompt label
    ctx.fillStyle = '#4A0E1B';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      lang === 'en' ? 'SCRATCH HERE TO REVEAL GIFT' : 'امسح هنا لكشف هديتك المضمونة',
      canvas.width / 2,
      canvas.height / 2
    );
  }, [mode, lang]);

  const scratchAtPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || scratchTriggeredRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    strokeCountRef.current += 1;
    if (strokeCountRef.current % 8 === 0) {
      try {
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let cleared = 0;
        const step = 16;
        let sampled = 0;
        for (let i = 3; i < img.length; i += 4 * step) {
          sampled++;
          if (img[i] < 128) cleared++;
        }
        const pct = Math.round((cleared / Math.max(1, sampled)) * 100);
        setScratchPct(pct);
        if (pct >= 32 && !scratchTriggeredRef.current) {
          scratchTriggeredRef.current = true;
          onPlay();
        }
      } catch {
        // ignore readback issues
      }
    }
  };

  if (mode === 'three_boxes') {
    return (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((boxNum) => {
            const isPicked = pickedBoxIdx === boxNum;
            return (
              <button
                key={boxNum}
                type="button"
                disabled={opening}
                onClick={() => {
                  setPickedBoxIdx(boxNum);
                  onPlay(boxNum);
                }}
                className={`group flex min-h-[138px] flex-col items-center justify-center gap-2.5 rounded-3xl border-2 p-4 transition-all cursor-pointer ${
                  isPicked && opening
                    ? 'animate-box-shake border-[#C9962D] bg-[#5C1422] text-white shadow-lg scale-[1.03]'
                    : 'border-[#C9962D]/50 bg-gradient-to-b from-[#FAF7F4] to-[#F3EAE0] text-[#5C1422] hover:border-[#5C1422] hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                    isPicked && opening
                      ? 'bg-[#C9962D] text-[#3A0A14]'
                      : 'bg-[#5C1422] text-[#E7C15A] group-hover:bg-[#7A1C2E]'
                  }`}
                >
                  <Gift className="h-6 w-6" />
                </div>
                <span className="text-xs font-extrabold sm:text-sm">
                  {lang === 'en' ? `Box ${boxNum}` : `صندوق ${boxNum}`}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs font-semibold text-slate-500">
          {opening
            ? lang === 'en'
              ? 'Opening your chosen box...'
              : 'جاري فتح الصندوق الذي اخترته...'
            : lang === 'en'
              ? meta.descEn
              : meta.descAr}
        </p>
      </div>
    );
  }

  if (mode === 'wheel') {
    const labels = (wheelLabels && wheelLabels.length >= 6 ? wheelLabels : DEFAULT_WHEEL).slice(0, 6);
    const sliceColors = ['#5C1422', '#FAF7F4', '#7A1C2E', '#C9962D', '#5C1422', '#EFE4D6'];
    const textColors = ['#FFFFFF', '#5C1422', '#FFFFFF', '#3A0A14', '#FFFFFF', '#5C1422'];

    const triggerWheel = () => {
      if (opening) return;
      setWheelSpinDeg((prev) => prev + 1800); // 5 full rotations landing squarely at 0 deg (Slice 0)
      onPlay();
    };

    return (
      <div className="flex flex-col items-center space-y-5">
        <div className="relative flex items-center justify-center">
          {/* Top Pointer */}
          <div
            aria-hidden="true"
            className="absolute -top-3 z-20 h-0 w-0 border-x-[11px] border-t-[20px] border-x-transparent border-t-[#C9962D] drop-shadow-md"
          />
          <div
            className="relative h-64 w-64 rounded-full border-4 border-[#C9962D] bg-white p-1 shadow-lg sm:h-72 sm:w-72"
            style={{
              transform: `rotate(${wheelSpinDeg}deg)`,
              transition: 'transform 1150ms cubic-bezier(0.18, 0.89, 0.25, 1)',
            }}
          >
            <svg viewBox="0 0 240 240" className="h-full w-full">
              {labels.map((lbl, idx) => {
                // Center slice 0 right at 0 deg (top 12 o'clock): -30 to +30
                const startAngle = idx * 60 - 30;
                const endAngle = startAngle + 60;
                const midAngle = startAngle + 30;
                const textPos = polarToCartesian(120, 120, 74, midAngle);
                return (
                  <g key={`${lbl}-${idx}`}>
                    <path
                      d={describeSlice(120, 120, 118, startAngle, endAngle)}
                      fill={sliceColors[idx]}
                      stroke="#C9962D"
                      strokeWidth="1.5"
                    />
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      fill={textColors[idx]}
                      fontSize="10.5"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                    >
                      {lbl.length > 13 ? `${lbl.slice(0, 12)}…` : lbl}
                    </text>
                  </g>
                );
              })}
              <circle cx="120" cy="120" r="24" fill="#5C1422" stroke="#C9962D" strokeWidth="3" />
              <text
                x="120"
                y="121"
                fill="#E7C15A"
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                RT LAB
              </text>
            </svg>
          </div>
        </div>

        <button
          type="button"
          disabled={opening}
          onClick={triggerWheel}
          className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-[#5C1422] px-6 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
        >
          <Sparkles className="h-5 w-5 text-[#E7C15A]" />
          <span>
            {opening
              ? lang === 'en'
                ? 'Spinning wheel...'
                : 'جاري تدوير العجلة...'
              : lang === 'en'
                ? meta.ctaEn
                : meta.ctaAr}
          </span>
        </button>
      </div>
    );
  }

  if (mode === 'scratch') {
    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#C9962D] bg-gradient-to-br from-[#5C1422] to-[#3E0B15] p-5 text-center text-white shadow-md">
          <div className="flex min-h-[140px] flex-col items-center justify-center space-y-2">
            <Gift className="h-10 w-10 text-[#E7C15A]" />
            <p className="text-sm font-extrabold text-[#FCE8B2]">
              {lang === 'en' ? 'Your RT LAB Reward Is Waiting!' : 'جائزتك من معامل RT جاهزة خلف البطاقة!'}
            </p>
            <p className="text-[11px] text-white/80">
              {scratchPct > 0
                ? lang === 'en'
                  ? `Scratched ${scratchPct}%`
                  : `تم كشف ${scratchPct}% من البطاقة`
                : lang === 'en'
                  ? meta.descEn
                  : meta.descAr}
            </p>
          </div>
          <canvas
            ref={canvasRef}
            width={340}
            height={176}
            onPointerDown={(e) => {
              isDrawingRef.current = true;
              scratchAtPoint(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!isDrawingRef.current) return;
              scratchAtPoint(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              isDrawingRef.current = false;
            }}
            onPointerLeave={() => {
              isDrawingRef.current = false;
            }}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          />
        </div>

        <button
          type="button"
          disabled={opening}
          onClick={() => onPlay()}
          className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl border border-[#C9962D]/50 bg-[#FFF8EB] px-5 py-2.5 text-xs font-extrabold text-[#5C1422] hover:bg-[#FDEFD1] disabled:opacity-60 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-[#B8860B]" />
          <span>
            {opening
              ? lang === 'en'
                ? 'Revealing reward...'
                : 'جاري إظهار الجائزة...'
              : lang === 'en'
                ? 'Quick Reveal Gift'
                : 'كشف الجائزة السريع'}
          </span>
        </button>
      </div>
    );
  }

  if (mode === 'secret') {
    return (
      <div className="w-full max-w-sm space-y-5">
        <button
          type="button"
          disabled={opening}
          onClick={() => onPlay()}
          className={`group relative flex min-h-[210px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-[#C9962D] bg-gradient-to-br from-[#5C1422] via-[#6E1729] to-[#3B0A13] p-6 text-center text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
            opening ? 'animate-box-shake' : ''
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E7C15A] bg-[#460E19] text-[#E7C15A] shadow-md">
            {opening ? <Mail className="h-7 w-7" /> : <LockKeyhole className="h-7 w-7" />}
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-wider text-[#E7C15A] uppercase">
              {lang === 'en' ? 'Confidential RT LAB Envelope' : 'مظروف شكر مختوم من معامل RT'}
            </p>
            <h3 className="text-lg font-extrabold text-white">
              {lang === 'en'
                ? 'Personal Gift from Dr. Rami Mokhtar'
                : 'رسالة وجائزة خاصة من د. رامي مختار'}
            </h3>
            <p className="text-xs text-white/80">
              {lang === 'en' ? meta.descEn : meta.descAr}
            </p>
          </div>
        </button>

        <button
          type="button"
          disabled={opening}
          onClick={() => onPlay()}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#5C1422] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
        >
          <Mail className="h-4 w-4 text-[#E7C15A]" />
          <span>{opening ? (lang === 'en' ? 'Unsealing...' : 'جاري فتح الرسالة...') : lang === 'en' ? meta.ctaEn : meta.ctaAr}</span>
        </button>
      </div>
    );
  }

  if (mode === 'seasonal') {
    return (
      <div className="w-full max-w-sm space-y-5">
        <button
          type="button"
          disabled={opening}
          onClick={() => onPlay()}
          className={`relative flex min-h-[215px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-[#C9962D] bg-gradient-to-b from-[#FFF8EB] via-white to-[#F7E8C8] p-6 text-center shadow-md transition-transform hover:scale-[1.01] cursor-pointer ${
            opening ? 'animate-box-shake' : 'animate-gentle-float'
          }`}
        >
          <span className="inline-flex items-center gap-1 rounded-full border border-[#C9962D]/50 bg-[#5C1422] px-3 py-1 text-[11px] font-extrabold text-[#FCE8B2]">
            <Stars className="h-3.5 w-3.5" />
            <span>{campaignName || (lang === 'en' ? 'Seasonal Campaign' : 'حملة موسمية خاصة')}</span>
          </span>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5C1422] text-[#E7C15A] shadow-sm">
            <Gift className="h-9 w-9" />
          </div>
          <p className="text-sm font-extrabold text-[#5C1422]">
            {lang === 'en' ? 'Tap to Open Your Seasonal Gift' : 'اضغط لفتح المفاجأة الموسمية'}
          </p>
        </button>

        <button
          type="button"
          disabled={opening}
          onClick={() => onPlay()}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#5C1422] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-[#E7C15A]" />
          <span>{opening ? (lang === 'en' ? 'Opening...' : 'جاري فتح المفاجأة...') : lang === 'en' ? meta.ctaEn : meta.ctaAr}</span>
        </button>
      </div>
    );
  }

  // Default 'box': Classic RT Happiness Box
  return (
    <div className="flex flex-col items-center space-y-5">
      <button
        type="button"
        disabled={opening}
        onClick={() => onPlay()}
        aria-label={lang === 'en' ? meta.ctaEn : meta.ctaAr}
        className={`group relative h-56 w-56 overflow-hidden rounded-3xl border-2 border-[#C9962D]/60 bg-[#FAF7F4] shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer sm:h-64 sm:w-64 ${
          opening ? 'animate-box-shake' : 'animate-gentle-float'
        }`}
      >
        {!sealedImgError ? (
          <img
            src={sealedBoxImg}
            alt={lang === 'en' ? 'Sealed RT Happiness Box' : 'صندوق السعادة المغلق'}
            referrerPolicy="no-referrer"
            onError={() => setSealedImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#5C1422] to-[#3B0A13] text-white">
            <Gift className="h-16 w-16 text-[#E7C15A]" />
            <span className="text-sm font-bold">{lang === 'en' ? 'RT Happiness Box' : 'صندوق السعادة'}</span>
          </div>
        )}
      </button>

      <button
        type="button"
        disabled={opening}
        onClick={() => onPlay()}
        className="flex min-h-[50px] w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-[#5C1422] px-6 py-3.5 text-base font-extrabold text-white shadow-sm transition-colors hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
      >
        <Gift className="h-5 w-5 text-[#E7C15A]" />
        <span>
          {opening
            ? lang === 'en'
              ? 'Opening your box...'
              : 'جاري فتح صندوق السعادة...'
            : lang === 'en'
              ? meta.ctaEn
              : meta.ctaAr}
        </span>
      </button>
    </div>
  );
}
