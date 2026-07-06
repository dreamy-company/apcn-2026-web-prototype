import { useState, type ReactNode } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { Toggle } from '../../components/ui/bits';
import { D } from '../../data/icons';

function SettingRow({
  icon,
  label,
  sub,
  right,
  last,
}: {
  icon: string;
  label: string;
  sub?: string;
  right?: ReactNode;
  last?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-brand-soft">
          <Icon d={icon} s={18} c="#f15a24" sw={1.9} />
        </span>
        <span className="flex-1">
          <span className="block text-[14.5px] font-bold text-ink">{label}</span>
          {sub && <span className="mt-0.5 block text-xs text-ink-soft">{sub}</span>}
        </span>
        {right ?? <Icon d={D.chev} s={16} c="#b8b3ab" sw={2.2} />}
      </div>
      {!last && <div className="mx-4 h-px bg-line" />}
    </div>
  );
}

function ValueRight({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-[13px] font-bold text-ink-soft">{value}</span>
      <Icon d={D.chev} s={16} c="#b8b3ab" sw={2.2} />
    </span>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_4px_14px_-8px_rgba(20,16,12,0.18)]">
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="px-1 pt-2 text-[10.5px] font-extrabold tracking-[1.3px] uppercase text-ink-faint">{children}</div>
  );
}

export default function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader title="Settings" backTo="/profile" right={<div className="w-10" />} />

      <div className="mx-auto flex max-w-2xl flex-col gap-2.5 px-4 pt-[18px] pb-10 md:px-8">
        <Label>Notifications</Label>
        <Card>
          <SettingRow
            icon={D.bell}
            label="Push Notifications"
            sub="Session reminders & alerts"
            right={<Toggle on={push} onChange={setPush} />}
          />
          <SettingRow
            icon={D.mail}
            label="Email Digest"
            sub="Daily schedule & news"
            right={<Toggle on={emailDigest} onChange={setEmailDigest} />}
          />
          <SettingRow icon={D.clock} label="Reminder Timing" sub="Before session starts" right={<ValueRight value="15 min" />} last />
        </Card>

        <Label>App</Label>
        <Card>
          <SettingRow icon={D.globe} label="Language" right={<ValueRight value="English" />} />
          <SettingRow icon={D.search} label="Default Translation" sub="For AI live captions" right={<ValueRight value="Indonesian" />} last />
        </Card>

        <Label>Privacy &amp; Security</Label>
        <Card>
          <SettingRow icon={D.lock} label="Change Password" />
          <SettingRow icon={D.info} label="Privacy Policy" />
          <SettingRow icon={D.file} label="Terms of Use" last />
        </Card>

        <div className="pt-2.5 text-center text-[11.5px] font-medium text-ink-faint">
          APCN 2027 App · v1.0.0 · Build 2027.01
        </div>
      </div>
    </div>
  );
}
