// Utility to calculate real doctor counts and define specialties
// This ensures CityDoctors component shows accurate data from AllDoctors

import { mapDoctorSpecialty } from '@/lib/utils';

export interface Specialty {
  name: string;
  count: number;
  icon: string;
}

// This function should be called with the actual doctors array from AllDoctors
export const calculateSpecialtyData = (doctors: any[]): Specialty[] => {
  // Count doctors by mapped specialty
  const counts: { [key: string]: number } = {};
  
  doctors.forEach(doctor => {
    const canonical = (doctor as any).category || mapDoctorSpecialty(doctor.specialty);
    counts[canonical] = (counts[canonical] || 0) + 1;
  });

  // Short, curated list for display
  const specialtyMapping: { [key: string]: { displayName: string; icon: string } } = {
    'عمومی': { displayName: 'عمومی', icon: '👨‍⚕️' },
    'زنان و زایمان': { displayName: 'زنان و زایمان', icon: '👶' },
    'قلب و عروق': { displayName: 'قلب و عروق', icon: '❤️' },
    'ارتوپدی': { displayName: 'ارتوپدی', icon: '🦴' },
    'اطفال': { displayName: 'اطفال', icon: '🧸' },
    'اورولوژی': { displayName: 'اورولوژی', icon: '🔬' },
    'ماما': { displayName: 'ماما', icon: '🤱' },
    'داخلی': { displayName: 'داخلی', icon: '🏥' }
  };

  // Create specialty data array with real counts (only show ones present)
  return Object.entries(specialtyMapping)
    .map(([key, value]) => ({ name: value.displayName, count: counts[key] || 0, icon: value.icon }))
    .filter(specialty => specialty.count > 0);
};