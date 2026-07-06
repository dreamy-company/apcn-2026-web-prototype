import { Link, useParams } from 'react-router-dom';
import { BackButton } from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { SecLabel, GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { findCategory } from '../../data/eposter';
import { StatusBadge } from './EPosterList';

const CRITERIA = [
  { title: 'Scientific Merit', desc: 'Originality, methodology, and validity of research findings' },
  { title: 'Clinical Relevance', desc: 'Impact on patient care and nephrology practice' },
  { title: 'Presentation Quality', desc: 'Clarity, visual design, and logical flow' },
  { title: 'Innovation', desc: 'Novel approaches or breakthrough insights' },
];

const GUIDELINES = [
  { icon: D.image, text: 'E-Poster: PDF or PNG · max 10 MB · A0 portrait (841×1189 mm)' },
  { icon: D.file, text: 'Abstract: 300 words max · structured format' },
  { icon: D.user, text: 'All listed authors must be APCN 2027 participants' },
  { icon: D.globe, text: 'Submissions must be in English' },
];

export default function EPosterDetailScreen() {
  const { id } = useParams();
  const cat = findCategory(id);
  const filled = cat.total - cat.slots;
  const pct = Math.round((filled / cat.total) * 100);

  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-24">
      <div className="relative overflow-hidden bg-brand-deep pb-6">
        <GlowCircle className="-top-10 -right-8 h-44 w-44 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl px-3.5 md:px-8">
          <div className="mb-[18px] flex items-center gap-2 pt-2.5">
            <BackButton light to="/eposter" />
            <div className="flex-1" />
            <StatusBadge status={cat.status} />
          </div>
          <div className="mb-1.5 text-[11px] font-extrabold tracking-[1.2px] uppercase text-white/50">
            Submission Category
          </div>
          <h1 className="mb-2 text-[22px] leading-tight font-extrabold tracking-tight text-white md:text-[28px]">
            {cat.topic}
          </h1>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-[5px] rounded-full bg-white/12 px-[11px] py-[5px] text-[11px] font-bold text-white/80">
              <Icon d={D.cal} s={12} c="rgba(255,255,255,0.8)" sw={2} />
              Deadline {cat.deadline}
            </span>
            <span className="rounded-full bg-white/12 px-[11px] py-[5px] text-[11px] font-bold text-white/80">
              {cat.total} max slots
            </span>
          </div>
          <div className="rounded-xl border border-white/12 bg-white/10 px-3.5 py-2.5 md:max-w-md">
            <div className="mb-1.5 flex justify-between">
              <span className="text-xs font-semibold text-white/65">Slots taken</span>
              <span className="text-xs font-extrabold text-white">
                {filled}/{cat.total}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-[3px] bg-white/15">
              <div
                className="h-full rounded-[3px] bg-[linear-gradient(90deg,rgba(255,255,255,0.6),rgba(255,255,255,0.9))]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-[18px] pt-[18px] md:px-8">
        <SecLabel>About This Category</SecLabel>
        <p className="mb-[18px] text-[13.5px] leading-[1.68] text-ink-soft md:text-sm">{cat.about}</p>

        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div>
            <SecLabel>Assessment Criteria</SecLabel>
            <div className="mb-[18px] rounded-[18px] border border-line bg-white px-4 py-1 shadow-[0_4px_14px_-8px_rgba(20,16,12,0.16)]">
              {CRITERIA.map((c, i) => (
                <div key={c.title} className={`flex gap-3 py-3 ${i < CRITERIA.length - 1 ? 'border-b border-line' : ''}`}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-brand text-xs font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13.5px] font-extrabold text-ink">{c.title}</span>
                    <span className="mt-0.5 block text-xs leading-normal text-ink-soft">{c.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SecLabel>Submission Guidelines</SecLabel>
            <div className="rounded-[18px] border border-line bg-white px-4 py-1 shadow-[0_4px_14px_-8px_rgba(20,16,12,0.16)]">
              {GUIDELINES.map((g, i) => (
                <div
                  key={g.text}
                  className={`flex items-start gap-2.5 py-2.5 ${i < GUIDELINES.length - 1 ? 'border-b border-line' : ''}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand-soft">
                    <Icon d={g.icon} s={16} c="#f15a24" sw={2} />
                  </span>
                  <span className="flex-1 pt-1.5 text-[13px] leading-snug font-semibold text-ink-soft">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[78px] z-30 border-t border-line bg-white shadow-[0_-8px_20px_-12px_rgba(20,16,12,0.18)] md:bottom-0 md:left-60">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2.5 px-[18px] py-3.5 md:px-8">
          <Link
            to={`/eposter/${cat.id}/submit?type=abstract`}
            className="flex h-14 items-center justify-center gap-2.5 rounded-[18px] bg-brand-soft text-base font-extrabold text-brand transition-colors hover:bg-[#fbdfc9]"
          >
            Abstract
            <Icon d={D.file} s={18} sw={2.4} />
          </Link>
          <Link
            to={`/eposter/${cat.id}/submit`}
            className="flex h-14 items-center justify-center gap-2.5 rounded-[18px] bg-brand text-base font-extrabold text-white shadow-[0_12px_26px_-8px_rgba(241,90,36,0.6)] transition-colors hover:bg-[#e0501d]"
          >
            E-Poster
            <Icon d={D.image} s={18} c="#fff" sw={2.4} />
          </Link>
        </div>
      </div>
    </div>
  );
}
