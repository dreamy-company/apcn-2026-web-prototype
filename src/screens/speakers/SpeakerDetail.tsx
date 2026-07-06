import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BackButton } from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { SecLabel, StatBar, GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { findSpeaker } from '../../data/speakers';
import doctorPhoto from '../../assets/doctorPhoto.avif';

function InfoRow({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-start gap-3.5 py-3 ${last ? '' : 'border-b border-line'}`}>
      <span className="mt-px flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
        <Icon d={icon} s={17} c="#f15a24" sw={2} />
      </span>
      <span className="flex-1">
        <span className="block text-[10.5px] font-bold tracking-[0.6px] uppercase text-ink-faint">{label}</span>
        <span className="mt-[3px] block text-[13.5px] leading-snug font-bold text-ink">{value}</span>
      </span>
    </div>
  );
}

function MiniSession({
  type,
  role,
  title,
  time,
  room,
  palette,
}: {
  type: string;
  role: string;
  title: string;
  time: string;
  room: string;
  palette: [string, string];
}) {
  return (
    <div className="mb-2.5 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_12px_-8px_rgba(20,16,12,0.20)]">
      <div className="h-[5px]" style={{ background: `linear-gradient(90deg,${palette[0]},${palette[1]})` }} />
      <div className="px-3.5 py-3">
        <div className="mb-2 flex gap-2">
          <span className="rounded-full bg-brand-soft px-2 py-[3px] text-[10.5px] font-extrabold text-brand">{type}</span>
          <span className="rounded-full bg-warm-soft px-2 py-[3px] text-[10.5px] font-extrabold text-warm">{role}</span>
        </div>
        <div className="text-[13.5px] leading-snug font-extrabold text-ink">{title}</div>
        <div className="mt-2.5 flex gap-3.5">
          <span className="flex items-center gap-[5px] text-xs font-semibold text-ink-soft">
            <Icon d={D.clock} s={13} c="#b8b3ab" sw={2} />
            {time}
          </span>
          <span className="flex items-center gap-[5px] text-xs font-semibold text-ink-soft">
            <Icon d={D.pin} s={13} c="#b8b3ab" sw={2} />
            {room}
          </span>
        </div>
      </div>
    </div>
  );
}

const TABS = ['Biography', 'Sessions', 'Contact'] as const;

export default function SpeakerDetailScreen() {
  const { id } = useParams();
  const sp = findSpeaker(id);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Biography');

  const bio = (
    <>
      <SecLabel>Biography</SecLabel>
      <p className="mb-[18px] text-[13.5px] leading-[1.68] text-ink-soft md:text-sm">
        {sp.name} is a leading nephrologist{sp.id === 'c1' ? ' and the President of APSN' : ''}. {sp.role} at{' '}
        {sp.institution}, with decades dedicated to advancing CKD care and glomerular disease research across
        Asia-Pacific.
      </p>
    </>
  );

  const contact = (
    <>
      <SecLabel>Personal Information</SecLabel>
      <div className="mb-[18px] rounded-[18px] border border-line bg-white px-4 py-0.5 shadow-[0_4px_14px_-8px_rgba(20,16,12,0.18)]">
        <InfoRow icon={D.specialty} label="Specialty" value="Nephrology · CKD · Glomerular Disease" />
        <InfoRow icon={D.building} label="Institution" value={`${sp.institution}, ${sp.country}`} />
        <InfoRow icon={D.globe} label="Country" value={sp.country} />
        <InfoRow icon={D.mail} label="Email" value={`${sp.name.split(' ').pop()?.toLowerCase()}@apcn2027.org`} />
        <InfoRow icon={D.link} label="Profile" value="apcn2027.org/speakers" last />
      </div>
    </>
  );

  const sessions = (
    <>
      <SecLabel>Speaking Sessions</SecLabel>
      <MiniSession
        type="Keynote"
        role="Speaker"
        title="Opening Ceremony & APSN Presidential Address"
        time="Wed 09:00–09:45"
        room="Plenary Hall"
        palette={['#f15a24', '#ff8f4d']}
      />
      <MiniSession
        type="Plenary"
        role="Lecturer"
        title="CKD Burden in the Asia-Pacific: Registry Data & Policy"
        time="Thu 10:00–10:40"
        room="Room 1 · 701A"
        palette={['#171717', '#f7931e']}
      />
    </>
  );

  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-24">
      <div className="bg-brand-deep">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3.5 py-2.5 md:px-8">
          <BackButton light to="/speakers" />
          <div className="flex-1" />
          <button
            type="button"
            aria-label="Share"
            className="flex h-10 w-10 items-center justify-center rounded-[13px] border-[1.5px] border-white/22 hover:bg-white/10"
          >
            <Icon d={D.share} s={20} c="#fff" sw={2} />
          </button>
        </div>

        <div className="relative overflow-hidden">
          <GlowCircle className="-top-12 -right-8 h-52 w-52 bg-[radial-gradient(circle,rgba(255,255,255,0.11),transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl px-[22px] pt-2 md:px-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <img
                  src={doctorPhoto}
                  alt={sp.name}
                  className="block h-[88px] w-[88px] rounded-[28px] border-[3px] border-white/22 object-cover object-top shadow-[0_18px_44px_-12px_rgba(0,0,0,0.45)] md:h-28 md:w-28"
                />
                <span className="absolute -right-1.5 -bottom-1.5 flex h-[26px] w-[26px] items-center justify-center rounded-full border-[2.5px] border-brand-deep bg-good">
                  <Icon d={D.check} s={13} c="#fff" sw={2.8} />
                </span>
              </div>
              <div>
                <h1 className="text-[21px] font-extrabold tracking-tight text-white md:text-2xl">{sp.name}</h1>
                <div className="mt-1 text-[12.5px] font-medium text-white/62">
                  {sp.institution} · {sp.country}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-[7px]">
                {sp.id === 'c1' && (
                  <span className="rounded-full border border-black/28 bg-black/16 px-3 py-[5px] text-[11px] font-extrabold text-brand-top">
                    APSN President
                  </span>
                )}
                <span className="rounded-full border border-white/16 bg-white/11 px-3 py-[5px] text-[11px] font-extrabold text-white">
                  Nephrology
                </span>
              </div>
            </div>

            <StatBar
              className="mt-5"
              items={[
                { v: '3', l: 'Sessions' },
                { v: '140+', l: 'Papers' },
                { v: '52', l: 'H-Index' },
              ]}
            />

            <div className="mt-4 flex">
              {TABS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 border-b-[2.5px] pb-3 text-center text-[13px] transition-colors ${
                    tab === t ? 'border-brand-top font-extrabold text-white' : 'border-transparent font-semibold text-white/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-[18px] pt-[18px] md:px-8">
        <div className="md:hidden">{tab === 'Biography' ? bio : tab === 'Sessions' ? sessions : contact}</div>
        {/* Desktop shows everything — tabs collapse into a two-column layout */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8">
          <div>
            {bio}
            {contact}
          </div>
          <div>{sessions}</div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[78px] z-30 border-t border-line bg-white shadow-[0_-8px_20px_-12px_rgba(20,16,12,0.18)] md:bottom-0 md:left-60">
        <div className="mx-auto grid max-w-3xl grid-cols-[52px_1fr] gap-2.5 px-4 py-3 md:px-8">
          <button
            type="button"
            aria-label="Bookmark speaker"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-[1.5px] border-line bg-white hover:bg-field"
          >
            <Icon d={D.bookmark} s={20} c="#f15a24" sw={2.2} />
          </button>
          <Link
            to="/program"
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand text-[15px] font-extrabold text-white shadow-[0_8px_20px_-8px_rgba(241,90,36,0.6)] transition-colors hover:bg-[#e0501d]"
          >
            View All Sessions
            <Icon d={D.chev} s={18} c="#fff" sw={2.4} />
          </Link>
        </div>
      </div>
    </div>
  );
}
