import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { CardsInHandComponent } from './cards-in-hand.component';
import { ICard } from '@models';
import { CARDS_IN_HAND } from '@mocks';
import { getTranslocoTestingModule, getTranslocoTestingProviders } from '@shared';

// Configuração padrão para os testes com Transloco
const defaultRenderOptions = {
  imports: [getTranslocoTestingModule()],
  providers: [getTranslocoTestingProviders('cards-in-hand')],
};

describe('CardsInHandComponent', () => {
  const mockCurrentHand = (): ICard[] => CARDS_IN_HAND.slice(0, 10);
  const mockCurrentPlay = (): ICard[] => [CARDS_IN_HAND[1]];
  const mockMultiPlaySequence = (): ICard[] => [CARDS_IN_HAND[1], CARDS_IN_HAND[2]];
  const mockMultiPlayGroup = (): ICard[] => [CARDS_IN_HAND[5], CARDS_IN_HAND[11]];

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // largura de um iPhone SE
    });
  });

  it('should render cards with the correct states (disabled/empty)', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });

    const deckCardContents = screen.getAllByTestId('deck-card-content');
    expect(deckCardContents.length).toBe(8);

    deckCardContents.forEach((content, index) => {
      const card = CARDS_IN_HAND[index];
      const hostEl = content.closest('pd-deck-card');
      if (!hostEl) {
        throw new Error('Card host element not found');
      }
      if (card && card.rateValue > 2) {
        expect(hostEl.className).not.toContain('disabled');
      } else {
        expect(hostEl.className).toContain('disabled');
      }
    });
  });

  it('should update the cards when clicking the "Draw Card" button', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });

    const drawButton = await screen.findByTestId('draw-button');
    const initialCards = screen.getAllByTestId('deck-card-content').map((el) => el.textContent);
    fireEvent.click(drawButton);

    await waitFor(() => {
      const newCards = screen.getAllByTestId('deck-card-content').map((el) => el.textContent);
      expect(newCards).not.toEqual(initialCards);
    });
  });

  it('should order the cards when clicking the "Order" button', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });

    const orderButton = await screen.findByTestId('order-button');
    fireEvent.click(orderButton);

    await waitFor(() => {
      const deckCards = screen.getAllByTestId('deck-card-content');
      expect(deckCards[0].textContent).toContain(CARDS_IN_HAND[0].visibleValue);
    });
  });

  it('should emit an empty array when clicking the "Skip" button', async () => {
    const { fixture } = await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });
    const componentInstance = fixture.componentInstance;
    jest.spyOn(componentInstance.newPlay, 'emit');

    const skipButton = await screen.findByTestId('skip-button');
    fireEvent.click(skipButton);
    expect(componentInstance.newPlay.emit).toHaveBeenCalledWith([]);
  });

  it('should emit the selected cards when clicking the "Play" button', async () => {
    jest.useFakeTimers();
    const { fixture } = await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });
    const componentInstance = fixture.componentInstance;
    jest.spyOn(componentInstance.newPlay, 'emit');

    const validCardElement = screen.getByText((content, element) => {
      if (!element) return false;
      return element.classList.contains('left') && content.includes('3');
    });
    const validCardHost = validCardElement.closest('pd-deck-card');
    if (!validCardHost) throw new Error('Card host element not found');
    fireEvent.click(validCardHost);

    const playButton = await screen.findByTestId('play-button');
    await waitFor(() => {
      expect(playButton).toBeEnabled();
    });
    fireEvent.click(playButton);

    jest.advanceTimersByTime(980);
    fixture.detectChanges();

    expect(componentInstance.newPlay.emit).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 3 })]));

    jest.useRealTimers();
  });

  it('should update the selected cards container when a card is selected and deselected', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });

    expect(screen.queryAllByTestId('selected-cards').length).toBe(0);

    const deckCard = screen.getByText((content, element) => {
      if (!element) return false;
      return element.classList.contains('left') && content.trim().startsWith('3');
    });
    const deckCardHost = deckCard.closest('pd-deck-card');
    if (!deckCardHost) {
      throw new Error('Deck card host element not found');
    }
    fireEvent.click(deckCardHost);
    await waitFor(() => {
      const selectedCards = screen.getAllByTestId('selected-cards');
      expect(selectedCards.length).toBe(1);
      expect(selectedCards[0].textContent).toContain('3');
    });

    const selectedCard = screen.getAllByTestId('selected-cards')[0];
    fireEvent.click(selectedCard);

    await waitFor(() => {
      expect(screen.queryAllByTestId('selected-cards').length).toBe(0);
    });
  });

  it('should allow selecting multiple cards and then deselect one', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockMultiPlaySequence(),
      },
      ...defaultRenderOptions,
    });

    expect(screen.queryAllByTestId('selected-cards').length).toBe(0);

    const card3Element = screen.getByText((content, element) => {
      if (!element) return false;
      return element.classList.contains('left') && content.trim().startsWith('3');
    });
    const card3Host = card3Element.closest('pd-deck-card');
    if (!card3Host) throw new Error('Card host element for card 3 not found');
    fireEvent.click(card3Host);

    const card4Element = screen.getByText((content, element) => {
      if (!element) return false;
      return element.classList.contains('left') && content.trim().startsWith('4');
    });
    const card4Host = card4Element.closest('pd-deck-card');
    if (!card4Host) throw new Error('Card host element for card 4 not found');
    fireEvent.click(card4Host);

    await waitFor(() => {
      const selectedCards = screen.getAllByTestId('selected-cards');
      expect(selectedCards.length).toBe(2);
    });

    const selectedCards = screen.getAllByTestId('selected-cards');
    const selectedCardFor3 = selectedCards.find((card) => card.textContent?.includes('3'));
    if (!selectedCardFor3) {
      throw new Error('Selected card for id 3 not found');
    }
    fireEvent.click(selectedCardFor3);

    await waitFor(() => {
      const remainingSelectedCards = screen.queryAllByTestId('selected-cards');
      expect(remainingSelectedCards.length).toBe(1);
      expect(remainingSelectedCards[0].textContent).toContain('4');
    });
  });

  it('should allow selecting multiple cards as a group and then deselect one', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockMultiPlayGroup(),
      },
      ...defaultRenderOptions,
    });

    expect(screen.queryAllByTestId('selected-cards').length).toBe(0);

    const card7DiamondsElement = screen.getByText((content, element) => {
      if (!element) return false;
      return element.classList.contains('left') && content.trim().startsWith('7') && content.includes('♦');
    });
    const card7DiamondsHost = card7DiamondsElement.closest('pd-deck-card');
    if (!card7DiamondsHost) throw new Error('Card host element for 7♦ not found');
    fireEvent.click(card7DiamondsHost);

    const card7HeartsElement = screen.getByText((content, element) => {
      if (!element) return false;
      return element.classList.contains('left') && content.trim().startsWith('7') && content.includes('♥');
    });
    const card7HeartsHost = card7HeartsElement.closest('pd-deck-card');
    if (!card7HeartsHost) throw new Error('Card host element for 7♥ not found');
    fireEvent.click(card7HeartsHost);

    await waitFor(() => {
      const selectedCards = screen.getAllByTestId('selected-cards');
      expect(selectedCards.length).toBe(2);
    });

    const selectedCards = screen.getAllByTestId('selected-cards');
    const selectedCardFor7Diamonds = selectedCards.find((card) => card.textContent?.includes('♦'));
    if (!selectedCardFor7Diamonds) {
      throw new Error('Selected card for 7♦ not found');
    }
    fireEvent.click(selectedCardFor7Diamonds);

    await waitFor(() => {
      const remainingSelectedCards = screen.queryAllByTestId('selected-cards');
      expect(remainingSelectedCards.length).toBe(1);
      expect(remainingSelectedCards[0].textContent).toContain('7');
      expect(remainingSelectedCards[0].textContent).toContain('♥');
    });
  });

  it('should reset the hand when drawing cards twice and reaching the deck limit', async () => {
    const { fixture } = await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });

    const componentInstance = fixture.componentInstance;
    const drawButton = await screen.findByTestId('draw-button');

    fireEvent.click(drawButton);
    fireEvent.click(drawButton);

    await waitFor(() => {
      // Verifica o valor interno que controla o índice da mão
      const handIndexValue = componentInstance['handIndex'];
      console.log(handIndexValue());
      expect(handIndexValue()).toBe(8);
    });
  });

  it('should correctly process the setTimeout after calling play()', async () => {
    const { fixture } = await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
      ...defaultRenderOptions,
    });

    const componentInstance = fixture.componentInstance;

    Object.defineProperty(componentInstance, 'isBeforeNewPlay', { value: true });
    Object.defineProperty(componentInstance, 'isAfterNewPlay', { value: false });

    expect(componentInstance['isBeforeNewPlay']).toBe(true);
    expect(componentInstance['isAfterNewPlay']).toBe(false);

    const deckCardContents = screen.getAllByTestId('deck-card-content');
    expect(deckCardContents.length).toBe(8);

    deckCardContents.forEach((content, index) => {
      const card = CARDS_IN_HAND[index];
      const hostEl = content.closest('pd-deck-card');
      if (!hostEl) {
        throw new Error('Card host element not found');
      }
      if (card && card.rateValue > 2) {
        expect(hostEl.className).not.toContain('disabled');
      } else {
        expect(hostEl.className).toContain('disabled');
      }
    });
  });
});
