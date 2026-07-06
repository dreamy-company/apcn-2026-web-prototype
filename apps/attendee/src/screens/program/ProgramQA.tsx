import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { D } from '../../data/icons';

interface Question {
  id: string;
  initials: string;
  name: string;
  time: string;
  body: string;
  votes: number;
  voted?: boolean;
  answered?: boolean;
  color: string;
}

const INITIAL_QUESTIONS: Question[] = [
  { id: 'q1', initials: 'RT', name: 'Dr. Rina Tanaka', time: '2 min ago', color: '#ffb877', votes: 24, voted: true, body: 'Which countries have national CKD screening at primary care level?' },
  { id: 'q2', initials: 'JK', name: 'Dr. Jin-Ho Kim', time: '4 min ago', color: '#ff8f4d', votes: 18, answered: true, body: 'How are you addressing CKD transition pathways for adolescents?' },
  { id: 'q3', initials: 'SP', name: 'Dr. Sara Putri', time: '6 min ago', color: '#f7931e', votes: 11, body: 'What economic indicators justify early intervention to ministries of health in LMIC?' },
];

const TABS = ['Top', 'Recent', 'Mine'] as const;

export default function ProgramQAScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Top');
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [draft, setDraft] = useState('');

  function toggleVote(id: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, voted: !q.voted, votes: q.votes + (q.voted ? -1 : 1) } : q)),
    );
  }

  function submit() {
    const body = draft.trim();
    if (!body) return;
    setQuestions((prev) => [
      { id: `q${Date.now()}`, initials: 'AS', name: 'Dr. Ahmad Santoso', time: 'Just now', color: '#f15a24', votes: 0, body },
      ...prev,
    ]);
    setDraft('');
  }

  const list = tab === 'Mine' ? questions.filter((q) => q.initials === 'AS') : questions;

  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-28">
      <PageHeader
        title="Q&A"
        right={
          <div className="flex h-10 w-10 items-center justify-center">
            <Icon d={D.info} s={22} c="#fff" sw={2.2} />
          </div>
        }
      >
        <div className="bg-brand-deep pb-3.5">
          <div className="mx-auto max-w-3xl px-3.5 md:px-8">
            <div className="flex items-center gap-3 rounded-[14px] bg-white/10 px-3.5 py-2.5">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#e94f4f] shadow-[0_0_0_4px_rgba(233,79,79,0.25)]" />
              <div className="min-w-0 flex-1">
                <div className="text-[10.5px] font-extrabold tracking-[1px] uppercase text-[#ff9c9c]">
                  Live now · 10:00–10:40
                </div>
                <div className="mt-0.5 truncate text-[13px] font-bold text-white">
                  Integrated Kidney Care Programs in the Asia-Pacific
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHeader>

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex gap-1.5 rounded-full bg-field p-1">
            {TABS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${
                  tab === t ? 'bg-white text-brand shadow-[0_2px_6px_-2px_rgba(20,16,12,0.2)]' : 'text-ink-soft'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-xs font-bold text-ink-soft">{list.length} questions</div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-3.5 pt-3.5 md:px-8">
        {list.map((q) => (
          <div
            key={q.id}
            className="relative mb-3 rounded-[18px] border border-line bg-white p-4 shadow-[0_4px_12px_-8px_rgba(20,16,12,0.15)]"
          >
            {q.answered && (
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-good-soft px-2 py-[3px] text-[10px] font-extrabold text-good">
                <Icon d={D.check} s={11} c="#3f9a78" sw={3} />
                Answered
              </span>
            )}
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                style={{ background: `linear-gradient(135deg,${q.color},#171717)` }}
              >
                {q.initials}
              </span>
              <div className="flex-1">
                <div className="text-[13.5px] font-extrabold text-ink">{q.name}</div>
                <div className="mt-px text-[11.5px] text-ink-faint">{q.time}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-normal text-ink">{q.body}</p>
            <div className="mt-3 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => toggleVote(q.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                  q.voted ? 'bg-brand text-white' : 'bg-brand-soft text-brand hover:bg-[#fbdfc9]'
                }`}
              >
                <Icon d={D.upvote} s={13} c={q.voted ? '#fff' : '#f15a24'} sw={2.6} />
                {q.votes}
              </button>
              <span className="text-xs font-semibold text-ink-soft">upvotes</span>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-[78px] z-30 border-t border-line bg-white shadow-[0_-8px_20px_-12px_rgba(20,16,12,0.18)] md:bottom-0 md:left-60">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-3.5 py-2.5 md:px-8">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Ask a question…"
            className="h-12 flex-1 rounded-full border-[1.5px] border-line bg-field px-[18px] text-sm font-medium text-ink outline-none placeholder:text-ink-faint focus:border-brand"
          />
          <button
            type="button"
            aria-label="Send question"
            onClick={submit}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-top to-brand shadow-[0_8px_18px_-8px_rgba(241,90,36,0.6)] transition-transform hover:scale-105"
          >
            <Icon d={D.send} s={20} c="#fff" sw={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
