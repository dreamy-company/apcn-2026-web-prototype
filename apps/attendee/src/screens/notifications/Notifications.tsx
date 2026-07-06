import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { NOTIFS, NTYPE, type Notification } from '../../data/notifications';

const TABS = ['All', 'Unread', 'Events'] as const;

export default function NotificationsScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const [notifs, setNotifs] = useState<Notification[]>(NOTIFS);

  const unread = notifs.filter((n) => n.unread).length;
  const list =
    tab === 'Unread' ? notifs.filter((n) => n.unread) : tab === 'Events' ? notifs.filter((n) => n.type === 'event') : notifs;

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader
        title="Notifications"
        backTo="/dashboard"
        right={
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 transition-colors hover:bg-white/20"
          >
            <span className="text-xs font-bold whitespace-nowrap text-white/80">Mark all read</span>
          </button>
        }
      >
        <div className="flex bg-white">
          <div className="mx-auto flex w-full max-w-3xl md:px-8">
            {TABS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={`flex flex-1 items-center justify-center gap-[5px] border-b-[2.5px] pt-3 pb-2.5 text-[13.5px] transition-colors md:flex-none md:px-10 ${
                  tab === t ? 'border-brand font-extrabold text-brand' : 'border-transparent font-semibold text-ink-soft'
                }`}
              >
                {t}
                {t === 'Unread' && unread > 0 && (
                  <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-[5px] text-[10px] font-extrabold text-white">
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-3xl md:px-8 md:pt-4">
        <div className="flex items-center gap-2 border-b border-line bg-white px-4 py-2.5 md:rounded-t-2xl md:border md:border-b-0">
          <span className={`h-2 w-2 rounded-full ${unread > 0 ? 'bg-brand' : 'bg-good'}`} />
          <span className="text-[12.5px] font-bold text-ink-soft">
            {unread > 0 ? `${unread} unread notifications` : 'All caught up'}
          </span>
        </div>

        <div className="md:overflow-hidden md:rounded-b-2xl md:border md:border-t-0 md:border-line">
          {list.map((n) => {
            const cfg = NTYPE[n.type];
            return (
              <button
                type="button"
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`relative flex w-full gap-3.5 border-b border-line px-4 py-3.5 text-left transition-colors ${
                  n.unread ? 'bg-white hover:bg-brand-soft/40' : 'bg-paper hover:bg-field'
                }`}
              >
                {n.unread && <span className="absolute top-0 bottom-0 left-0 w-[3px] rounded-r-sm bg-brand" />}
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
                  style={{ background: cfg.bg }}
                >
                  <Icon d={cfg.icon} s={20} c={cfg.color} sw={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className={`text-sm leading-tight text-ink ${n.unread ? 'font-extrabold' : 'font-bold'}`}>
                      {n.title}
                    </span>
                    <span className="mt-px shrink-0 text-[11px] font-semibold text-ink-faint">{n.time}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[12.5px] leading-normal text-ink-soft">{n.body}</span>
                </span>
                {n.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />}
              </button>
            );
          })}
          <div className="px-4 py-5 text-center text-xs font-semibold text-ink-faint">You're all caught up ✓</div>
        </div>
      </div>
    </div>
  );
}
