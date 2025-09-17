export const EXTERNAL_URLS = {
  // Lab System URLs
  LAB_LOGIN: 'http://93.114.111.53:8086/Login',
  ONLINE_TICKETING: 'http://93.114.111.53:8086/general/online-ticketing',
  
  // Contact Information
  EMAIL: 'info@salamat.com',
  PHONE_1: '02146833010',
  PHONE_2: '02146833011',
  
  // Location
  MAP_LOCATION: 'https://nshn.ir/87_bvX81VxB9-K',
  ADDRESS: 'شهرقدس، میدان مصلی'
} as const;

export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;
