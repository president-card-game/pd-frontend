import { Component, inject, Pipe, PipeTransform } from '@angular/core';
import { DeckCardComponent } from 'src/app/widgets/components/deck-card/deck-card.component';
import { GameService } from '../../services';
import { DECK, ICard } from '@shared';

@Pipe({
  name: 'transformCardId',
})
export class TransformCardId implements PipeTransform {
  transform(cardId: number): ICard {
    return DECK.find(({ id }) => cardId === id) as ICard;
  }
}

@Component({
  imports: [DeckCardComponent, TransformCardId],
  templateUrl: './game.page.html',
  styles: '',
})
export class GamePage {
  protected readonly gameService = inject(GameService);
  protected selectedCards: { id: number; hasValueOf?: number }[] = [];
  protected selectJokerValue: number | null = null;
  protected cards = DECK;

  protected get reversedLastPlays() {
    return this.gameService.game()?.lastPlays.reverse() ?? [];
  }

  protected get lastPlayIsSequence() {
    return (this.gameService.game()?.lastPlays[0].cards?.length || 0) > 1 || !!this.selectedCards.length;
  }

  protected playCard(skipped?: boolean) {
    if (!skipped) {
      this.gameService.playCard(this.selectedCards);
      this.selectedCards = [];
      return;
    }

    this.gameService.playCard();
  }

  protected removeCard(id: number) {
    this.selectedCards = this.selectedCards.filter((card) => card.id !== id);
  }

  protected selectCard(id: number) {
    if (id !== 53 && id !== 54) {
      this.selectedCards.push({ id });
      return;
    }

    this.selectJokerValue = id;
  }

  protected onJokerClick(id: number) {
    this.selectedCards.push({ id: this.selectJokerValue as number, hasValueOf: id });
    this.selectJokerValue = null;
  }
}
