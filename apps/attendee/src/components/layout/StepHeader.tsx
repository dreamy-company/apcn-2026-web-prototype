import { BackButton } from './PageHeader';

interface StepHeaderProps {
  step: number;
  total: number;
  title: string;
  backTo?: string;
}

/** Dark step-progress header for the purchase / submission flows. */
export default function StepHeader({ step, total, title, backTo }: StepHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-brand-deep">
      <div className="mx-auto max-w-3xl px-3.5 pt-2.5 pb-[18px] md:px-8">
        <div className="mb-3.5 flex items-center gap-2">
          <BackButton light to={backTo} />
          <h1 className="flex-1 text-center text-[17px] font-extrabold text-white md:text-lg">{title}</h1>
          <span className="w-10 text-center text-xs font-extrabold text-white/50">
            {step}/{total}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-white/15">
            <div
              className="h-full rounded-[3px] bg-white transition-all duration-500"
              style={{ width: `${(step / total) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-bold whitespace-nowrap text-white/50">
            Step {step} of {total}
          </span>
        </div>
      </div>
    </header>
  );
}
