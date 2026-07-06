export type PosterStatus = 'open' | 'soon' | 'full';

export interface PosterCategory {
  id: string;
  topic: string;
  slots: number;
  total: number;
  deadline: string;
  status: PosterStatus;
  palette: [string, string];
  about: string;
}

export const CATS: PosterCategory[] = [
  {
    id: 'ckd', topic: 'CKD & Progression', slots: 12, total: 20, deadline: '28 Feb 2027', status: 'open', palette: ['#f15a24', '#ff8f4d'],
    about: 'Submit original research on CKD progression, risk factors, biomarkers, and clinical outcomes in the Asia-Pacific population. Both completed studies and preliminary data are welcomed.',
  },
  {
    id: 'glom', topic: 'Glomerular Disease', slots: 8, total: 20, deadline: '28 Feb 2027', status: 'open', palette: ['#f7931e', '#ffb877'],
    about: 'Original research on glomerular disease pathogenesis, diagnostics, and precision therapy across the Asia-Pacific region.',
  },
  {
    id: 'dial', topic: 'Dialysis & KRT', slots: 15, total: 20, deadline: '28 Feb 2027', status: 'open', palette: ['#c1440e', '#e8720d'],
    about: 'Studies on hemodialysis, peritoneal dialysis, and kidney replacement therapy access, outcomes, and innovation.',
  },
  {
    id: 'trans', topic: 'Kidney Transplantation', slots: 6, total: 20, deadline: '28 Feb 2027', status: 'open', palette: ['#2e2e2e', '#5c5c5c'],
    about: 'Research on transplant outcomes, immunosuppression strategies, and donor programs in the Asia-Pacific.',
  },
  {
    id: 'ped', topic: 'Pediatric Nephrology', slots: 2, total: 15, deadline: '28 Feb 2027', status: 'soon', palette: ['#f15a24', '#8a8580'],
    about: 'Pediatric kidney disease research: congenital anomalies, nephrotic syndrome, and transition-of-care pathways.',
  },
  {
    id: 'aki', topic: 'AKI Management', slots: 0, total: 15, deadline: '28 Feb 2027', status: 'full', palette: ['#8a8580', '#b8b3ab'],
    about: 'Acute kidney injury epidemiology, biomarkers, and management strategies from bench to bedside.',
  },
];

export function findCategory(id: string | undefined): PosterCategory {
  return CATS.find((c) => c.id === id) ?? CATS[0];
}
