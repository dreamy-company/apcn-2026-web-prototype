import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import StepHeader from '../../components/layout/StepHeader';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { SecLabel } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { findCategory } from '../../data/eposter';

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
  area,
  trailing,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  area?: boolean;
  trailing?: React.ReactNode;
}) {
  const shared = {
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className:
      'w-full flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint',
  };
  return (
    <label className="block">
      <div className="mb-[7px] ml-0.5 text-[12.5px] font-bold text-ink-soft">
        {label}
        {required && <span className="ml-[3px] text-warm">*</span>}
      </div>
      <div
        className={`flex gap-2.5 rounded-[15px] border-[1.5px] border-line bg-white transition-colors focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgba(241,90,36,0.10)] ${
          area ? 'min-h-[88px] items-start px-4 py-[13px]' : 'h-[54px] items-center px-4'
        }`}
      >
        {area ? <textarea {...shared} rows={3} className={`${shared.className} resize-none leading-relaxed`} /> : <input {...shared} />}
        {trailing}
      </div>
    </label>
  );
}

const TYPES = ['E-Poster', 'Abstract'] as const;

export default function SubmissionFormScreen() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cat = findCategory(id);

  const [type, setType] = useState<(typeof TYPES)[number]>(params.get('type') === 'abstract' ? 'Abstract' : 'E-Poster');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const keywordCount = keywords.split(',').map((k) => k.trim()).filter(Boolean).length;

  function submit() {
    navigate('/eposter/submitted', {
      state: { title: title.trim() || 'Untitled submission', category: cat.topic, type },
    });
  }

  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-36 md:pb-16">
      <StepHeader step={3} total={5} title={`Submit ${type}`} backTo={`/eposter/${cat.id}`} />

      <div className="mx-auto max-w-2xl px-4 pt-[18px] md:px-8">
        <div className="mb-[18px] flex items-center gap-2.5 rounded-[14px] border border-line bg-white px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[3px] bg-gradient-to-br from-brand to-brand-top" />
          <span className="text-[13px] font-extrabold text-ink">{cat.topic}</span>
          <Link to="/eposter" className="ml-auto flex items-center gap-1 text-[11.5px] font-bold text-brand">
            Change
            <Icon d={D.chev} s={14} sw={2} />
          </Link>
        </div>

        <SecLabel>Submission Type</SecLabel>
        <div className="mb-[18px] flex gap-1 rounded-2xl bg-field p-1">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 rounded-xl py-2.5 text-center text-sm transition-all ${
                type === t ? 'bg-white font-extrabold text-brand shadow-[0_2px_8px_-3px_rgba(20,16,12,0.2)]' : 'font-semibold text-ink-soft'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <SecLabel>{type} Details</SecLabel>
        <div className="flex flex-col gap-3">
          <FormField
            label={`${type} Title`}
            required
            value={title}
            onChange={setTitle}
            placeholder="Progression Biomarkers of CKD in Southeast Asian Patients…"
          />
          <FormField
            label="Abstract"
            required
            area
            value={abstract}
            onChange={setAbstract}
            placeholder="Background: Chronic kidney disease affects an estimated 850 million people worldwide…"
          />
          <FormField
            label="Keywords"
            required
            value={keywords}
            onChange={setKeywords}
            placeholder="CKD, biomarkers, Southeast Asia…"
            trailing={<span className="text-[11px] font-bold text-ink-faint">{keywordCount}/10</span>}
          />
        </div>

        <SecLabel className="mt-[18px]">Upload File</SecLabel>
        <button
          type="button"
          onClick={() => setFileName('ckd-progression-poster.pdf')}
          className={`flex w-full flex-col items-center gap-2.5 rounded-[18px] border-2 border-dashed px-4 py-6 text-center transition-colors ${
            fileName ? 'border-good bg-good-soft' : 'border-brand bg-brand-soft hover:bg-[#fbdfc9]'
          }`}
        >
          <span
            className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white shadow-[0_4px_12px_-6px_rgba(241,90,36,0.3)]`}
          >
            <Icon d={fileName ? D.check : D.upload} s={24} c={fileName ? '#3f9a78' : '#f15a24'} sw={2} />
          </span>
          <span className={`text-sm font-extrabold ${fileName ? 'text-good' : 'text-brand'}`}>
            {fileName ?? `Tap to upload ${type}`}
          </span>
          <span className="text-[11.5px] text-ink-faint">
            {fileName ? '2.4 MB · uploaded just now' : 'PDF or PNG · max 10 MB'}
          </span>
        </button>

        <div className="mt-3.5 flex gap-2.5 rounded-[14px] border border-[rgba(31,31,31,0.2)] bg-warm-soft px-3.5 py-[11px]">
          <Icon d={D.info} s={17} c="#2b2b2b" sw={2} />
          <span className="flex-1 text-xs leading-normal font-semibold text-[#0d0d0d]">
            Your submission will be reviewed by the scientific committee. Results announced 15 March 2027.
          </span>
        </div>

        <div className="mt-6 hidden md:block">
          <Button onClick={submit} icon={<Icon d={D.upload} s={18} c="#fff" sw={2.4} />}>
            Submit {type}
          </Button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white shadow-[0_-8px_20px_-12px_rgba(20,16,12,0.18)] md:hidden">
        <div className="px-[18px] pt-3.5 pb-4">
          <Button onClick={submit} icon={<Icon d={D.upload} s={18} c="#fff" sw={2.4} />}>
            Submit {type}
          </Button>
        </div>
      </div>
    </div>
  );
}
