import { ICard } from '@models';

export const isJoker = (card: ICard) => card.suitName?.toLowerCase() === 'joker';

export function isValidGroup(candidate: ICard[], referenceValue: number): boolean {
  const nonJokers = candidate.filter((card) => !isJoker(card));

  if (nonJokers.length > 0) {
    const value = nonJokers[0].rateValue;
    if (!nonJokers.every((card) => card.rateValue === value)) return false;
    return value > referenceValue;
  } else return true;
}

export function isValidSequence(candidate: ICard[], referenceValue: number): boolean {
  const jokers = candidate.filter((card) => isJoker(card));
  const nonJokers = candidate.filter((card) => !isJoker(card));
  let sequenceSuit: string | null = null;

  if (nonJokers.length > 0) {
    sequenceSuit = nonJokers[0].suitIcon;
    if (!nonJokers.every((card) => card.suitIcon === sequenceSuit)) return false;
  }

  const sortedNonJokers = [...nonJokers].sort((a, b) => a.rateValue - b.rateValue);

  // Calcular quantos "buracos" existem entre os não coringas.
  let needed = 0;
  for (let i = 1; i < sortedNonJokers.length; i++) {
    const gap = sortedNonJokers[i].rateValue - sortedNonJokers[i - 1].rateValue - 1;
    needed += gap;
  }
  // Se os coringas não conseguem preencher todos os gaps, a sequência não pode ser formada.
  if (needed > jokers.length) return false;
  // Os coringas restantes (além de preencher os gaps) podem ser usados para "extender" a sequência.
  const leftover = jokers.length - needed;

  const effectiveHighest =
    sortedNonJokers.length > 0 ? sortedNonJokers[sortedNonJokers.length - 1].rateValue + leftover : referenceValue + 1;
  return effectiveHighest > referenceValue;
}
