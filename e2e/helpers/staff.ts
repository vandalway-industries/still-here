// The twelve, as company/staff/staff.yaml records them, and the name each one's leadership card
// shows. The record keeps "Lucas the Intern"; his card reads "Lucas", with "Intern" beneath it
// (Clive's red-pen at C2, 2026-10-05; CHECKPOINTS.md § Record). Every other card shows the
// record's name. (Diane, 2026-10-05)
import { readFileSync } from 'node:fs';

/** Card names that differ from the staff record, by staff id. */
export const CARD_NAMES: Readonly<Record<string, string>> = { lucas: 'Lucas' };

export type StaffMember = { id: string; recordName: string; cardName: string };

/** The staff record, in its order, with each person's card name. */
export function staff(): StaffMember[] {
  const yaml = readFileSync(new URL('../../company/staff/staff.yaml', import.meta.url), 'utf8');
  return [...yaml.matchAll(/^ {2}- id: (\w+)\n {4}name: (.+)$/gm)].map((m) => ({
    id: m[1],
    recordName: m[2].trim(),
    cardName: CARD_NAMES[m[1]] ?? m[2].trim(),
  }));
}

/** The people W4.leadership looks for: each card's name. */
export const leadershipPeople = (): { name: string }[] => staff().map((p) => ({ name: p.cardName }));
