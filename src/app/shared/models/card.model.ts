export interface ICard {
  id: number;
  color: Color;
  suitIcon: SuitIcon;
  suitName: SuitName;
  rateValue: number;
  visibleValue: VisibleValue;
}

export type VisibleValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'joker';

export type SuitIcon = '♠' | '♣' | '♦' | '♥' | 'joker';

export type SuitName = 'spades' | 'clubs' | 'diamonds' | 'hearts' | 'joker';

export type Color = 'black' | 'red';
