import { render, screen } from '@testing-library/angular';
import { DeckCardComponent } from './deck-card.component';
import { ICard } from '@models';
import { CommonModule } from '@angular/common';

const CARDS: ICard[] = [
  {
    id: 1,
    visibleValue: 'A',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 1,
  },
  {
    id: 2,
    visibleValue: 'joker',
    color: 'black',
    suitIcon: 'joker',
    suitName: 'joker',
    rateValue: 0,
  },
  {
    id: 3,
    visibleValue: 'K',
    color: 'red',
    suitIcon: '♥',
    suitName: 'hearts',
    rateValue: 13,
  },
];

describe('DeckCardComponent', () => {
  let currentCard: ICard;

  beforeEach(async () => {
    currentCard = CARDS.shift()!;
    await render(DeckCardComponent, {
      componentInputs: { card: currentCard },
      imports: [CommonModule],
    });
  });

  it('should render the card correctly', async () => {
    const leftAndRight = screen.getAllByText('A ♦');
    expect(leftAndRight.length).toBe(2);
    expect(screen.getByText('♦')).toBeTruthy();
  });

  it('should render the joker correctly', async () => {
    const jokerImage = screen.getAllByAltText('card-joker-icon') as HTMLImageElement[];
    expect(jokerImage.length).toBe(3);
    expect(jokerImage[0].src).toContain('black-joker.png');
  });

  it('should apply the correct class for the card color', async () => {
    const cardElement = screen.getByTestId('card');
    expect(cardElement).toHaveClass('red');
  });
});
