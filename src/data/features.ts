import iconProgram from '../assets/iconProgram.png';
import iconSpeaker from '../assets/iconSpeaker.png';
import iconInfo from '../assets/iconInfo.png';
import iconPosters from '../assets/iconPosters.png';
import iconNews from '../assets/iconNews.png';
import iconTourist from '../assets/iconTourist.png';
import iconSchedule from '../assets/iconSchedule.png';
import iconGallery from '../assets/iconGallery.png';
import iconSponsors from '../assets/iconSponsors.png';
import iconPoints from '../assets/iconPoints.png';
import iconEmergency from '../assets/iconEmergency.png';
import iconDownload from '../assets/iconDownload.png';

export interface Feature {
  key: string;
  label: string;
  img: string;
  to?: string;
}

export const FEATURE_DATA: Feature[] = [
  { key: 'program', label: 'Program', img: iconProgram, to: '/program' },
  { key: 'speaker', label: 'Speaker', img: iconSpeaker, to: '/speakers' },
  { key: 'information', label: 'Information', img: iconInfo },
  { key: 'poster', label: 'Poster', img: iconPosters, to: '/eposter' },
  { key: 'news', label: 'News', img: iconNews, to: '/notifications' },
  { key: 'tourist', label: 'Tourist', img: iconTourist },
  { key: 'schedule', label: 'My Schedule', img: iconSchedule, to: '/program' },
  { key: 'gallery', label: 'Gallery', img: iconGallery },
  { key: 'sponsors', label: 'Sponsors & Map', img: iconSponsors },
  { key: 'points', label: 'Points', img: iconPoints, to: '/profile' },
  { key: 'emergency', label: 'Emergency Call', img: iconEmergency },
  { key: 'download', label: 'Download', img: iconDownload },
];
