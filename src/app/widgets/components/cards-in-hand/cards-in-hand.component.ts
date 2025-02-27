import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, OnInit, output, signal } from '@angular/core';
import { ICard, isJoker, isValidGroup, isValidSequence } from '@shared';
import { DeckCardComponent } from '../deck-card/deck-card.component';

@Component({
  selector: 'pd-cards-in-hand',
  imports: [CommonModule, DeckCardComponent],
  templateUrl: './cards-in-hand.component.html',
  styleUrl: './cards-in-hand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsInHandComponent implements OnInit {
  public readonly currentHand = input.required<ICard[]>();
  public readonly currentPlay = input.required<ICard[]>();
  public readonly newPlay = output<ICard[]>();

  public validCardIds: Set<number>;
  public selectedCards: ICard[] = [];
  protected cardsInHand: ICard[] = [];
  private readonly handIndex = signal(0);
  private readonly maxCardsInHand = Math.floor(window.innerWidth / 42);

  protected isBeforeNewPlay = false;
  protected isAfterNewPlay = false;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.newTurn();
  }

  private newTurn() {
    this.drawCard();
    this.selectedCards = [];
    this.validCardIds = this.getValidCardIds(this.currentHand(), this.currentPlay());
    this.changeDetector.detectChanges();
  }

  public drawCard() {
    const validHand = this.currentHand().slice(this.handIndex(), this.handIndex() + this.maxCardsInHand);
    this.cardsInHand = validHand.length ? validHand : this.resetHand();
    this.handIndex.update((handIndex) => (handIndex += this.maxCardsInHand));
  }

  private resetHand() {
    this.handIndex.set(0);
    return this.currentHand().slice(this.handIndex(), this.handIndex() + this.maxCardsInHand);
  }

  public orderCards() {
    this.handIndex.set(0);
    this.currentHand().sort((a, b) => a.rateValue - b.rateValue);
    this.drawCard();
  }

  public skip() {
    this.newPlay.emit([]);
  }

  public play() {
    this.handIndex.set(0);
    this.isBeforeNewPlay = true;
    this.newPlay.emit(this.selectedCards);

    //simulando requisição
    setTimeout(() => {
      this.isAfterNewPlay = true;
      this.isBeforeNewPlay = false;
      this.newTurn();
    }, 800);
  }

  public selectCart(card: ICard) {
    const lengthCardsInCurrentPlay = this.currentPlay().length;
    const isSelectedCard = this.selectedCards.find((selectedCard) => selectedCard.id == card.id);

    if (lengthCardsInCurrentPlay == 1) {
      this.selectedCards = isSelectedCard ? [] : [card];
    } else {
      this.selectedCards = isSelectedCard
        ? this.selectedCards.filter((selectedCard) => selectedCard.id != card.id)
        : [...this.selectedCards, card];
    }

    this.validCardIds = this.getValidCardIds(this.currentHand(), this.currentPlay());
  }

  public getCardStyle(index: number) {
    const cardsInHandLength = this.cardsInHand.length;
    const yOffsetMiddle = 0;
    const yOffsetBottom = 25;
    const rotationStart = -15;
    const rotationEnd = 15;

    const normalizedIndex = cardsInHandLength == 1 ? 1 : index / (cardsInHandLength - 1);
    const distanceFromCenter = Math.abs(normalizedIndex - 0.5);
    const norm = distanceFromCenter / 0.5;

    const diffY = yOffsetBottom - yOffsetMiddle;
    const yOffset = yOffsetMiddle + diffY * norm;
    const rotation = cardsInHandLength == 1 ? 0 : rotationStart + (rotationEnd - rotationStart) * normalizedIndex;

    return {
      transform: `translateY(${yOffset}%) rotate(${rotation}deg)`,
    };
  }

  private getCombinations(cards: ICard[], combinationSize: number): ICard[][] {
    const results: ICard[][] = [];
    function combine(start: number, combo: ICard[]) {
      if (combo.length === combinationSize) {
        results.push([...combo]);
        return;
      }
      for (let index = start; index < cards.length; index++) {
        combo.push(cards[index]);
        combine(index + 1, combo);
        combo.pop();
      }
    }
    combine(0, []);
    return results;
  }

  private validateCombo(combo: ICard[], currentPlay: ICard[]): boolean {
    const isGroupCurrentPlay = currentPlay.every((card) => card.rateValue === currentPlay[0].rateValue);
    const isSequenceCurrentPlay =
      !isGroupCurrentPlay &&
      ((): boolean => {
        if (currentPlay.length < 2) return false;
        const suit = currentPlay[0].suitIcon;
        if (!currentPlay.every((card) => card.suitIcon === suit)) return false;
        const sorted = [...currentPlay].sort((a, b) => a.rateValue - b.rateValue);
        for (let index = 1; index < sorted.length; index++) {
          if (sorted[index].rateValue !== sorted[index - 1].rateValue + 1) {
            return false;
          }
        }
        return true;
      })();

    let referenceValue: number;
    if (isGroupCurrentPlay) {
      referenceValue = currentPlay[0].rateValue;
    } else if (isSequenceCurrentPlay) {
      const sortedCurrent = [...currentPlay].sort((a, b) => a.rateValue - b.rateValue);
      referenceValue = sortedCurrent[sortedCurrent.length - 1].rateValue;
    } else {
      referenceValue = currentPlay[0].rateValue;
    }

    const candidateNonJokers = combo.filter((card) => !isJoker(card));
    const isCandidateGroup =
      candidateNonJokers.length === 0 || candidateNonJokers.every((card) => card.rateValue === candidateNonJokers[0].rateValue);
    const isCandidateSequence = isValidSequence(combo, referenceValue);

    if ((isGroupCurrentPlay && !isCandidateGroup) || (isSequenceCurrentPlay && !isCandidateSequence)) return false;

    if (isCandidateGroup) return isValidGroup(combo, referenceValue);
    else if (isCandidateSequence) return isValidSequence(combo, referenceValue);

    return false;
  }

  private getValidCombinations(cardsInHand: ICard[], currentPlay: ICard[]): ICard[][] {
    const validCombos: ICard[][] = [];
    const combinationSize = currentPlay.length;

    if (combinationSize === 1) {
      for (const card of cardsInHand) {
        if (card.rateValue > currentPlay[0].rateValue) {
          validCombos.push([card]);
        }
      }
    } else {
      const combos = this.getCombinations(cardsInHand, combinationSize);
      for (const combo of combos) {
        if (this.validateCombo(combo, currentPlay)) validCombos.push(combo);
      }
    }
    return validCombos;
  }

  public getValidCardIds(cardsInHand: ICard[], currentPlay: ICard[]): Set<number> {
    let validCombos = this.getValidCombinations(cardsInHand, currentPlay);

    if (this.selectedCards && this.selectedCards.length > 0) {
      validCombos = validCombos.filter((combo) =>
        this.selectedCards.every((selected) => combo.some((card) => card.id === selected.id)),
      );
    }

    const validIds = new Set<number>();
    validCombos.forEach((combo) => {
      combo.forEach((card) => {
        validIds.add(card.id);
      });
    });

    return validIds;
  }

  public isCardSelected(card: ICard): boolean {
    return this.selectedCards.some((selected) => selected.id === card.id);
  }
}
