import { useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import QRCode from '../../components/ui/QRCode';
import { GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';

export default function TicketDetailQRScreen() {
  const { id } = useParams();
  const ticketId = id ?? 'APCN-2027-04821';

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader
        title="Ticket"
        backTo="/profile/tickets"
        right={
          <button type="button" aria-label="Share" className="flex h-10 w-10 items-center justify-center">
            <Icon d={D.share} s={22} c="#fff" sw={2} />
          </button>
        }
      />

      <div className="relative overflow-hidden bg-gradient-to-br from-brand-deep to-brand-top px-5 py-5">
        <GlowCircle className="-top-7 -right-7 h-44 w-44 bg-[radial-gradient(circle,rgba(255,255,255,0.11),transparent_70%)]" />
        <div className="relative mx-auto flex max-w-lg items-center gap-3">
          <span className="flex shrink-0 rounded-xl bg-white p-2">
            <span className="text-base font-extrabold text-brand">APSN</span>
          </span>
          <div className="flex-1">
            <div className="text-[10.5px] font-bold tracking-[1px] uppercase text-white/65">Official Ticket</div>
            <div className="mt-px text-[17px] font-extrabold text-white">APCN 2027</div>
          </div>
          <span className="flex shrink-0 items-center gap-[5px] rounded-full bg-good-soft px-3 py-[5px]">
            <span className="h-[7px] w-[7px] rounded-full bg-good" />
            <span className="text-[11px] font-extrabold tracking-[0.4px] text-good">VALID</span>
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-lg flex-col gap-3.5 px-4 pt-[18px] pb-10">
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_8px_28px_-12px_rgba(20,16,12,0.22)]">
          <div className="flex flex-col items-center px-5 pt-6 pb-5">
            <div className="mb-[18px] text-[11px] font-extrabold tracking-[1.3px] uppercase text-ink-faint">
              Scan to Verify Attendance
            </div>
            <div className="rounded-[18px] border border-line bg-white p-3.5 shadow-[0_4px_20px_-8px_rgba(20,16,12,0.22)]">
              <QRCode size={186} />
            </div>
            <div className="mt-[18px] text-center">
              <div className="text-xs font-semibold text-ink-faint">Ticket ID</div>
              <div className="mt-1 text-xl font-extrabold tracking-[3px] text-brand-deep">{ticketId}</div>
            </div>
          </div>
          <div className="relative flex h-[18px] items-center">
            <span className="absolute -left-[9px] h-[18px] w-[18px] rounded-full bg-paper" />
            <span className="mx-3.5 flex-1 border-t-2 border-dashed border-line" />
            <span className="absolute -right-[9px] h-[18px] w-[18px] rounded-full bg-paper" />
          </div>
          <div className="grid grid-cols-2 gap-y-3 px-5 pt-3.5 pb-5">
            {[
              { l: 'Holder', v: 'Dr. Ahmad Santoso' },
              { l: 'Category', v: 'Participant – Full' },
              { l: 'Date', v: '12–15 May 2027' },
              { l: 'Venue', v: 'Bali, Indonesia' },
            ].map(({ l, v }) => (
              <div key={l}>
                <div className="text-[10px] font-bold tracking-[0.6px] uppercase text-ink-faint">{l}</div>
                <div className="mt-[3px] text-[13.5px] font-bold text-ink">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border-[1.5px] border-brand bg-brand-soft text-sm font-extrabold text-brand transition-colors hover:bg-[#fbdfc9]"
          >
            <Icon d={D.dl} s={18} sw={2.2} />
            Download
          </button>
          <button
            type="button"
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(241,90,36,0.55)] transition-colors hover:bg-[#e0501d]"
          >
            <Icon d={D.share} s={18} c="#fff" sw={2} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
