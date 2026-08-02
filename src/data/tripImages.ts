/** Reliable Unsplash CDN images for packages / trips */

const u = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=80`;

export const TRIP_IMAGES = {
  maldives: u('photo-1514282401047-d79a71a590e8'),
  europe: u('photo-1467269204594-9661b134dd2b'),
  himalayas: u('photo-1506905925346-21bda4d32df4'),
  kenya: u('photo-1516426122078-c23e76319801'),
  paris: u('photo-1502602898657-3e91760cbb34'),
  india: u('photo-1548013146-72479768bada'),
  makkah: u('photo-1591604129939-f1efa4d9f7fa'),
  madinah: u('photo-1591604466107-ec97de577aff'),
  umrahLuxury: u('photo-1564760055775-d63b17a55c44'),
  umrahFamily: u('photo-1578662996442-48f60103fc96'),
  kerala: u('photo-1507525428034-b723cf961d3e'),
  venice: u('photo-1523906834658-6e24ef2386f9'),
  mountains: u('photo-1500530855697-b586d89ba3ee'),
  travel: u('photo-1488646953014-85cb44e25828'),
  bangkok: u('photo-1555881400-74d7acaacd8b'),
  australia: u('photo-1507525428034-b723cf961d3e'),
} as const;

/** Reliable hotel photography for Hotels page */
export const HOTEL_IMAGES = {
  makkah1: TRIP_IMAGES.makkah,
  makkah2: TRIP_IMAGES.umrahLuxury,
  makkah3: u('photo-1566073771259-6a8506099945'),
  makkah4: u('photo-1551882547-ff40c63fe5fa'),
  madinah1: TRIP_IMAGES.madinah,
  madinah2: TRIP_IMAGES.umrahFamily,
  madinah3: u('photo-1542314831-068cd1dbfeeb'),
  madinah4: u('photo-1520250497591-112f2f40a3f4'),
  luxury1: u('photo-1571896349842-33c89424de2d'),
  luxury2: u('photo-1564501049412-61c2a3083791'),
  luxury3: u('photo-1618773928121-c32242e63f39'),
  luxury4: u('photo-1582719478250-c89cae4dc85b'),
  luxury5: u('photo-1445019980597-93fa8acb246c'),
  luxury6: u('photo-1455587734955-081b22074882'),
  luxury7: u('photo-1631049307264-da0ec9d70304'),
  luxury8: u('photo-1590490360182-c33d57733427'),
  dubai: u('photo-1518684079-3c830dcef090'),
  fallback: TRIP_IMAGES.travel,
} as const;
