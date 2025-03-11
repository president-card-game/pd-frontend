import { render, screen } from '@testing-library/angular';
import { DeckCardComponent } from './deck-card.component';
import { ICard } from '@models';
import { CommonModule } from '@angular/common';
import { DECK_CARDS } from '@mocks';

describe('DeckCardComponent', () => {
  let currentCard: ICard;

  beforeEach(async () => {
    currentCard = DECK_CARDS.shift()!;
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
