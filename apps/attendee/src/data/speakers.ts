export interface Speaker {
  id: string;
  name: string;
  role: string;
  institution: string;
  country: string;
  initials: string;
  color: string;
}

export const CHAIRS: Speaker[] = [
  { id: 'c1', name: 'Prof. Xueqing Yu', role: 'Professor & APSN President', institution: 'Southern Medical University', country: 'China', initials: 'XY', color: '#f15a24' },
  { id: 'c2', name: 'Prof. Hung-Chun Chen', role: 'Professor', institution: 'Kaohsiung Medical University', country: 'Taiwan', initials: 'HC', color: '#f7931e' },
  { id: 'c3', name: 'Dr. Sanjay Vikrant', role: 'Associate Professor', institution: 'IGMC Shimla', country: 'India', initials: 'SV', color: '#ff8f4d' },
  { id: 'c4', name: 'Prof. Wai-Kei Lo', role: 'Professor', institution: 'Tung Wah Hospital', country: 'Hong Kong', initials: 'WL', color: '#ffb877' },
  { id: 'c5', name: 'Dr. Muh Geot Wong', role: 'Consultant Nephrologist', institution: 'Royal North Shore Hospital', country: 'Australia', initials: 'GW', color: '#c1440e' },
  { id: 'c6', name: 'Prof. Yusuke Suzuki', role: 'Professor', institution: 'Juntendo University', country: 'Japan', initials: 'YS', color: '#f15a24' },
];

export const SPEAKERS: Speaker[] = [
  { id: 's1', name: 'Dr. Mai-Szu Wu', role: 'Associate Professor', institution: 'Taipei Medical University', country: 'Taiwan', initials: 'MW', color: '#ff8f4d' },
  { id: 's2', name: 'Dr. Akihiko Koshino', role: 'Researcher', institution: 'Osaka University', country: 'Japan', initials: 'AK', color: '#ffb877' },
  { id: 's3', name: 'Dr. Rina Tanaka', role: 'Nephrologist', institution: 'Jichi Medical University', country: 'Japan', initials: 'RT', color: '#f7931e' },
  { id: 's4', name: 'Dr. Jin-Ho Kim', role: 'Associate Professor', institution: 'Seoul National University', country: 'Korea', initials: 'JK', color: '#f15a24' },
  { id: 's5', name: 'Dr. Sara Putri', role: 'Nephrologist', institution: 'RSUPN Cipto Mangunkusumo', country: 'Indonesia', initials: 'SP', color: '#c1440e' },
  { id: 's6', name: 'Prof. Arvind Bagga', role: 'Professor', institution: 'AIIMS New Delhi', country: 'India', initials: 'AB', color: '#ff8f4d' },
];

export function findSpeaker(id: string | undefined): Speaker {
  return [...CHAIRS, ...SPEAKERS].find((s) => s.id === id) ?? CHAIRS[0];
}
