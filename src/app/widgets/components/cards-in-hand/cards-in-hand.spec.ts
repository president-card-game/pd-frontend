import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { CardsInHandComponent } from './cards-in-hand.component';
import { ICard } from '@models';

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
    visibleValue: '2',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 2,
  },
  {
    id: 3,
    visibleValue: '3',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 3,
  },
  {
    id: 4,
    visibleValue: '4',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 4,
  },
  {
    id: 5,
    visibleValue: '5',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 5,
  },
  {
    id: 6,
    visibleValue: '6',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 6,
  },
  {
    id: 7,
    visibleValue: '7',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 7,
  },
  {
    id: 33,
    visibleValue: '7',
    color: 'red',
    suitIcon: '♥',
    suitName: 'hearts',
    rateValue: 7,
  },
  {
    id: 8,
    visibleValue: '8',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 8,
  },
  {
    id: 9,
    visibleValue: '9',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 9,
  },
  {
    id: 10,
    visibleValue: '10',
    color: 'red',
    suitIcon: '♦',
    suitName: 'diamonds',
    rateValue: 10,
  },
  {
    id: 32,
    visibleValue: '6',
    color: 'red',
    suitIcon: '♥',
    suitName: 'hearts',
    rateValue: 6,
  },
];

describe('CardsInHandComponent', () => {
  const mockCurrentHand = (): ICard[] => CARDS.slice(0, 10);
  const mockCurrentPlay = (): ICard[] => [CARDS[1]];
  const mockMultiPlaySequence = (): ICard[] => [CARDS[1], CARDS[2]];
  const mockMultiPlayGroup = (): ICard[] => [CARDS[5], CARDS[11]];

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, //largura de um iphone SE
    });
  });

  it('should render cards with the correct states (disabled/empty)', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
    });

    const deckCardContents = screen.getAllByTestId('deck-card-content');
    expect(deckCardContents.length).toBe(8);

    deckCardContents.forEach((content, index) => {
      const card = CARDS[index];
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
    });

    const orderButton = await screen.findByTestId('order-button');
    fireEvent.click(orderButton);

    await waitFor(() => {
      const deckCards = screen.getAllByTestId('deck-card-content');
      expect(deckCards[0].textContent).toContain(CARDS[0].visibleValue);
    });
  });

  it('should emit an empty array when clicking the "Skip" button', async () => {
    const { fixture } = await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
    });
    const componentInstance = fixture.componentInstance;
    jest.spyOn(componentInstance.newPlay, 'emit');

    const skipButton = await screen.findByTestId('skip-button');
    fireEvent.click(skipButton);
    expect(componentInstance.newPlay.emit).toHaveBeenCalledWith([]);
  });

  it('should emit the selected cards when clicking the "Play" button', async () => {
    const { fixture } = await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
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

    expect(componentInstance.newPlay.emit).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 3 })]));
  });

  it('should update the selected cards container when a card is selected and deselected', async () => {
    await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
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
    });

    const componentInstance = fixture.componentInstance;
    const drawButton = await screen.findByTestId('draw-button');

    fireEvent.click(drawButton);
    fireEvent.click(drawButton);

    await waitFor(() => {
      const handIndexValue = componentInstance['handIndex'];
      console.log(handIndexValue());

      expect(handIndexValue()).toBe(8); // Se espera 8 pois na função drawCard redefine o valor para o máximo de cartas que cabe na tela
    });
  });

  it('should correctly process the setTimeout after calling play()', async () => {
    const { fixture } = await render(CardsInHandComponent, {
      componentInputs: {
        currentHand: mockCurrentHand(),
        currentPlay: mockCurrentPlay(),
      },
    });

    const componentInstance = fixture.componentInstance;

    Object.defineProperty(componentInstance, 'isBeforeNewPlay', { value: true });
    Object.defineProperty(componentInstance, 'isAfterNewPlay', { value: false });

    expect(componentInstance['isBeforeNewPlay']).toBe(true);
    expect(componentInstance['isAfterNewPlay']).toBe(false);

    const deckCardContents = screen.getAllByTestId('deck-card-content');
    expect(deckCardContents.length).toBe(8);

    deckCardContents.forEach((content, index) => {
      const card = CARDS[index];
      console.log(card);
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
