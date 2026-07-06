import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';

interface Ticket {
  ticketId: string;
  category: string;
  status: string;
  dates: string;
  active: boolean;
}

const TICKETS: Ticket[] = [
  { ticketId: 'APCN-2027-04821', category: 'Participant – Full', status: 'Active', dates: '12–15 May 2027', active: true },
  { ticketId: 'APCN-2027-04822', category: 'Workshop – Day 1', status: 'Active', dates: '12 May 2027', active: true },
];

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_6px_20px_-10px_rgba(20,16,12,0.22)]">
      <div className="relative flex items-center gap-3 overflow-hidden bg-gradient-to-r from-brand-deep to-brand-top px-[18px] py-4">
        <GlowCircle className="-top-8 -right-6 h-32 w-32 bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_70%)]" />
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/20 bg-white/14">
          <Icon d={D.ticket} s={22} c="#fff" sw={1.8} />
        </span>
        <div className="flex-1">
          <div className="text-[10.5px] font-bold tracking-[1.2px] uppercase text-white/65">
            APCN 2027 · Official Ticket
          </div>
          <div className="mt-0.5 text-[15px] font-extrabold text-white">Asia Pacific Congress of Nephrology</div>
        </div>
        <span
          className={`flex shrink-0 items-center gap-[5px] rounded-full px-[11px] py-[5px] text-[10.5px] font-extrabold tracking-[0.4px] uppercase ${
            ticket.active ? 'bg-good text-white' : 'bg-white/15 text-white/80'
          }`}
        >
          {ticket.active && <span className="h-1.5 w-1.5 rounded-full bg-[#7fffd4]" />}
          {ticket.status}
        </span>
      </div>
      <div className="relative flex h-[18px] items-center bg-white">
        <span className="absolute -left-2.5 h-5 w-5 rounded-full bg-paper" />
        <span className="mx-3.5 flex-1 border-t-2 border-dashed border-line" />
        <span className="absolute -right-2.5 h-5 w-5 rounded-full bg-paper" />
      </div>
      <div className="px-[18px] pt-3 pb-[18px]">
        <div className="mb-3.5 grid grid-cols-2 gap-y-2.5">
          {[
            { l: 'Ticket ID', v: ticket.ticketId },
            { l: 'Category', v: ticket.category },
            { l: 'Date', v: ticket.dates },
            { l: 'Holder', v: 'Dr. Ahmad Santoso' },
          ].map(({ l, v }) => (
            <div key={l}>
              <div className="text-[10px] font-bold tracking-[0.6px] uppercase text-ink-faint">{l}</div>
              <div className="mt-[3px] text-[13px] font-bold text-ink">{v}</div>
            </div>
          ))}
        </div>
        <Link
          to={`/profile/tickets/${ticket.ticketId}`}
          className="flex h-[46px] items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-brand bg-brand-soft text-sm font-extrabold text-brand transition-colors hover:bg-[#fbdfc9]"
        >
          <Icon d={D.qrScan} s={18} sw={1.6} />
          View QR Code
        </Link>
      </div>
    </div>
  );
}

const TABS = ['All', 'Active', 'Past'] as const;

export default function MyTicketsScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const list = TICKETS.filter((t) => (tab === 'All' ? true : tab === 'Active' ? t.active : !t.active));

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader title="My Tickets" backTo="/profile" right={<div className="w-10" />}>
        <div className="bg-brand-deep pb-4">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <div className="flex gap-1.5 rounded-[14px] bg-white/8 p-1 md:max-w-sm">
              {TABS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 rounded-[10px] py-[9px] text-center text-[13.5px] font-bold transition-all ${
                    tab === t ? 'bg-white text-brand shadow-[0_2px_8px_-4px_rgba(0,0,0,0.3)]' : 'text-white/65'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto grid max-w-5xl gap-4 px-4 pt-4 pb-8 md:grid-cols-2 md:px-8">
        {list.map((t) => (
          <TicketCard key={t.ticketId} ticket={t} />
        ))}
        {list.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm font-semibold text-ink-faint">
            No {tab.toLowerCase()} tickets.
          </div>
        )}
      </div>
    </div>
  );
}
