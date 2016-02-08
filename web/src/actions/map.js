export const RECORD_MAP_LOCATION = 'RECORD_MAP_LOCATION';
export function recordMapLocation(location) {
  return {
    type: RECORD_MAP_LOCATION,
    location,
    recordedAt: Date.now()
  };
}
