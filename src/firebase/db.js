import { db } from './firebase';

export const updateLines = (id, lines) =>
  db.ref(`users/${id}`).set({
    lines
  });

export const getLines = uid =>
  db.ref(`users/${uid}`).once('value');
