import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DECK, ICard } from '@shared';
import { CardsInHandComponent } from '@widgets';

@Component({
  imports: [RouterModule, CommonModule, CardsInHandComponent],
  selector: 'pd-root',
  template: `
    <router-outlet />
    <div>
      <pd-cards-in-hand [currentHand]="currentHand" [currentPlay]="currentPlay" (newPlay)="processNewPlay($event)">
      </pd-cards-in-hand>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100vh;
        padding: 10px;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  public cards = DECK;
  public currentHand: ICard[] = [];
  public currentPlay: ICard[] = [];
  private readonly initialHandSize = 25;
  public canRemoveCard = false;

  public cardStyles: { [key: number]: any } = {};

  ngOnInit() {
    this.shuffleDeck();
    this.dealHand();
  }

  private shuffleDeck() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  private dealHand() {
    this.currentPlay = [
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
    ];

    this.currentHand = this.cards.slice(0, this.initialHandSize);
  }

  protected processNewPlay(cardsPlay: ICard[]) {
    this.currentPlay = cardsPlay;
    this.currentHand = this.currentHand.filter((card) => !cardsPlay.find((cardPlay) => cardPlay.id === card.id));
  }
}
