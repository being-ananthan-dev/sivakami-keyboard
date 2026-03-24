export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const getKeysForOctave = (octave) => {
  return NOTES.map((note) => ({
    note: `${note}${octave}`,
    isBlack: note.includes('#'),
  }));
};

// Maps PC keyboard chars to steps relative to current octave
export const KEYBOARD_MAP = {
  // White keys
  'z': 0, 'x': 2, 'c': 4, 'v': 5, 'b': 7, 'n': 9, 'm': 11,
  ',': 12, '.': 14, '/': 16,
  'q': 12, 'w': 14, 'e': 16, 'r': 17, 't': 19, 'y': 21, 'u': 23, 'i': 24, 'o': 26, 'p': 28,

  // Black keys
  's': 1, 'd': 3, 'g': 6, 'h': 8, 'j': 10,
  'l': 13, ';': 15,
  '2': 13, '3': 15, '5': 18, '6': 20, '7': 22, '9': 25, '0': 27
};

export const getNoteFromStep = (baseOctave, step) => {
  const totalNotesFromC0 = baseOctave * 12 + step;
  // Handle negatives if user transposes way down
  if (totalNotesFromC0 < 0) return null;
  const octave = Math.floor(totalNotesFromC0 / 12);
  const noteIndex = totalNotesFromC0 % 12;
  return `${NOTES[noteIndex]}${octave}`;
};

// Simple scale generator for highlighting (major scale)
export const getScaleNotes = (rootNote) => {
  if (!rootNote) return [];
  const rootNoteOnly = rootNote.replace(/\d/, '');
  const rootIdx = NOTES.indexOf(rootNoteOnly);
  if (rootIdx === -1) return [];
  
  // Major scale intervals: W W H W W W H
  const intervals = [0, 2, 4, 5, 7, 9, 11];
  return intervals.map(inter => NOTES[(rootIdx + inter) % 12]);
};
