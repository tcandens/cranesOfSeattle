export const MOVE_MAP = 'MOVE_MAP';
export function moveMap(position) {
  return {
    type: MOVE_MAP,
    position: position
  };
}
