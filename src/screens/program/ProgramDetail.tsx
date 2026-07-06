import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { D } from '../../data/icons';
import doctorPhoto from '../../assets/doctorPhoto.avif';

function LivePlayer() {
  return (
    <div className="overflow-hidden rounded-[18px] bg-[#090909]">
      <div className="relative flex h-[190px] items-center justify-center bg-gradient-to-br from-[#0c0c0c] to-[#161616] md:h-[300px]">
        <img
          src={doctorPhoto}
          alt="Live stream"
          className="absolute right-0 bottom-0 h-full w-[55%] object-cover object-top"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,12,12,0.92)_28%,rgba(12,12,12,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,12,12,0.75)_0%,transparent_55%)]" />
        <span className="absolute top-3 left-3 flex items-center gap-[5px] rounded-full bg-[#e94f4f] px-[11px] py-[5px]">
          <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-white" />
          <span className="text-[10.5px] font-extrabold tracking-[1.3px] text-white">LIVE</span>
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-[5px] rounded-full bg-black/50 px-2.5 py-[5px]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] font-bold text-white">1,243</span>
        </span>
        <button
          type="button"
          aria-label="Play"
          className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1.5px] border-white/35 bg-white/15 transition-transform hover:scale-105"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </button>
        <div className="absolute right-3.5 bottom-2.5 left-3.5">
          <div className="mb-0.5 text-[10.5px] font-bold tracking-[1.2px] uppercase text-white/50">
            Now Streaming
          </div>
          <div className="text-[13px] leading-snug font-extrabold text-white">Plenary Lecture · Room 1</div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 bg-[#100f0f] px-3.5 py-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
        <div className="relative h-[3px] flex-1 rounded-sm bg-white/15">
          <div className="h-full w-[35%] rounded-sm bg-[#e94f4f]" />
          <span className="absolute top-1/2 left-[35%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </div>
        <span className="text-[11px] font-semibold whitespace-nowrap text-white/60">24:18</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
      </div>
    </div>
  );
}

export default function ProgramDetailScreen() {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-24">
      <PageHeader
        title="Session"
        right={
          <button type="button" aria-label="Download" className="flex h-10 w-10 items-center justify-center">
            <Icon d={D.dl} s={22} c="#fff" sw={2.2} />
          </button>
        }
      >
        <div className="bg-brand-deep pb-3.5">
          <div className="mx-auto max-w-3xl px-4 md:px-8">
            <LivePlayer />
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 pt-[18px] md:px-8">
        <h2 className="text-[21px] leading-tight font-extrabold tracking-tight text-ink md:text-[26px]">
          Integrated Kidney Care Programs in the Asia-Pacific: From Policy to Practice
        </h2>
        <div className="mt-3 flex flex-wrap gap-[7px]">
          {['Glomerular', 'CKD', 'Policy'].map((t) => (
            <span key={t} className="rounded-full bg-brand-soft px-2.5 py-1 text-[11.5px] font-bold text-brand">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-3.5 rounded-[18px] bg-gradient-to-r from-brand to-brand-top px-4 py-3.5 shadow-[0_8px_22px_-10px_rgba(241,90,36,0.55)]">
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] bg-white/16">
              <Icon d={D.pin} s={21} c="#fff" sw={2} />
            </span>
            <div>
              <div className="mb-[3px] text-[10.5px] font-extrabold tracking-[1.2px] uppercase text-white/60">
                Location
              </div>
              <div className="text-[17px] font-extrabold tracking-tight text-white">Room 1 · 701A</div>
              <div className="mt-0.5 text-xs font-semibold text-white/70">
                2nd Floor · Bali International Convention Centre
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-white px-4 py-1">
            {[
              { icon: D.cal, label: 'Date & Time', value: 'Thu, 13 May 2027 · 10:00–10:40' },
              { icon: D.globe, label: 'AI Translation', value: 'EN · ZH · JA · KO available' },
            ].map((m, i) => (
              <div key={m.label} className={i > 0 ? 'border-t border-line' : ''}>
                <div className="flex items-start gap-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                    <Icon d={m.icon} s={17} c="#f15a24" sw={2} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[11.5px] font-bold tracking-[0.6px] uppercase text-ink-faint">
                      {m.label}
                    </span>
                    <span className="mt-0.5 block text-[14.5px] font-bold text-ink">{m.value}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3.5">
          <div className="mb-2 text-[11.5px] font-extrabold tracking-[1.2px] uppercase text-ink-faint">Speaker</div>
          <Link
            to="/speakers/s1"
            className="flex items-center gap-3.5 rounded-[18px] border-[1.5px] border-brand bg-white px-4 py-3.5 shadow-[0_6px_22px_-10px_rgba(241,90,36,0.22)] transition-transform hover:-translate-y-0.5"
          >
            <span className="relative shrink-0">
              <img
                src={doctorPhoto}
                alt="Dr. Mai-Szu Wu"
                className="block h-16 w-16 rounded-[18px] border-[2.5px] border-brand-soft object-cover object-top"
              />
              <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-[2.5px] border-white bg-good">
                <Icon d={D.check} s={10} c="#fff" sw={3} />
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-[3px] block text-[10.5px] font-extrabold tracking-[0.8px] uppercase text-warm">
                Lecturer
              </span>
              <span className="block text-[15.5px] font-extrabold text-ink">Dr. Mai-Szu Wu, MD, PhD</span>
              <span className="mt-[3px] flex items-center gap-[5px] text-[12.5px] text-ink-soft">
                <Icon d={D.building} s={13} c="#b8b3ab" sw={2} />
                Taipei Medical University
              </span>
            </span>
            <Icon d={D.chev} s={20} c="#f15a24" sw={2.4} />
          </Link>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[78px] z-30 border-t border-line bg-white shadow-[0_-8px_20px_-12px_rgba(20,16,12,0.18)] md:bottom-0 md:left-60">
        <div className="mx-auto grid max-w-3xl grid-cols-[auto_1fr_auto] items-center gap-2.5 px-4 py-3 md:px-8">
          <button
            type="button"
            aria-label="Bookmark"
            onClick={() => setSaved(!saved)}
            className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-[1.5px] transition-colors ${
              saved ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:bg-field'
            }`}
          >
            <Icon d={D.bookmark} s={20} c="#f15a24" sw={2.2} fill={saved ? '#f15a24' : 'none'} />
          </button>
          <button
            type="button"
            onClick={() => setAdded(!added)}
            className={`flex h-[52px] items-center justify-center gap-2 rounded-2xl text-[15px] font-extrabold text-white transition-colors ${
              added ? 'bg-good shadow-[0_8px_18px_-8px_rgba(63,154,120,0.6)]' : 'bg-brand shadow-[0_8px_18px_-8px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]'
            }`}
          >
            <Icon d={D.check} s={18} c="#fff" sw={2.6} />
            {added ? 'Added to Schedule' : 'Add to Schedule'}
          </button>
          <Link
            to={`/program/${id}/qa`}
            aria-label="Q&A"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-brand-top to-brand shadow-[0_8px_16px_-8px_rgba(241,90,36,0.5)] transition-transform hover:scale-105"
          >
            <Icon d={D.chat} s={20} c="#fff" sw={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
