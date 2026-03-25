const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const getFullPianoKeys = () => {
  const keys = [];
  keys.push({ note: 'A0', isBlack: false }, { note: 'A#0', isBlack: true }, { note: 'B0', isBlack: false });
  for (let oct = 1; oct <= 7; oct++) {
    NOTES.forEach(n => keys.push({ note: `${n}${oct}`, isBlack: n.includes('#') }));
  }
  keys.push({ note: 'C8', isBlack: false });
  return keys;
};

export const KEYBOARD_MAP = {
  'z': 0, 'x': 2, 'c': 4, 'v': 5, 'b': 7, 'n': 9, 'm': 11,
  'q': 12, 'w': 14, 'e': 16, 'r': 17, 't': 19, 'y': 21, 'u': 23,
  's': 1, 'd': 3, 'g': 6, 'h': 8, 'j': 10,
  '2': 13, '3': 15, '5': 18, '6': 20, '7': 22,
};

export const getNoteFromStep = (baseOctave, step) => {
  const idx = baseOctave * 12 + step;
  if (idx < 0) return null;
  return `${NOTES[idx % 12]}${Math.floor(idx / 12)}`;
};
