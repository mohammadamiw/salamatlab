export const formatPersianDate = (date: Date): string => {
  const jalali = new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).format(date);
  return jalali;
};

export const convertToShamsi = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const shamsiDate = new Intl.DateTimeFormat('fa-IR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
    
    return shamsiDate;
  } catch {
    return dateString;
  }
};
