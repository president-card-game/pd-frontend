import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DECK } from '@shared';
import { DeckCardComponent } from './widgets/components/deck-card/deck-card.component';

@Component({
  imports: [RouterModule, DeckCardComponent, CommonModule],
  selector: 'pd-root',
  template: `<router-outlet />
    <!-- <div class="container"><pd-deck-card *ngFor="let card of cards" [card]="card"></pd-deck-card></div> -->
    <section>
      <pd-deck-card *ngFor="let card of cardsInHand" [card]="card" [class.exit]="canRemoveCard"></pd-deck-card>
    </section> `,
  styles: [
    `
      .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
        padding: 10px;
        background-color: var(--primary);
        height: 100%;
      }

      section {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        background-color: var(--primary);
        height: 100vh;
        overflow-x: auto;
        transform-origin: center 120%;
        padding-top: 10px;

        pd-deck-card {
          
          $max-index: var(--card-in-hand); 
          $y-offset-bottom: 25%; 
          $y-offset-middle: 0; 
          $rotation-start: -15deg; 
          $rotation-end: 15deg; 

          @for $index from 1 through unquote($max-index)  {
            $normalized-index: ($index - 1) / ($max-index - 1);
            $distance-from-center: abs($normalized-index - 0.5);
            $norm: $distance-from-center / 0.5;


            $diff-y: $y-offset-bottom - $y-offset-middle; 
            $y-offset: $y-offset_middle + ($diff-y * $norm);
            $rotation: $rotation-start + (($rotation-end - $rotation-start) * $normalized-index);

            &:nth-child(#{$index}) {
              transform: translate(-50%, #{$y-offset}) rotate(#{$rotation});
            }
          }

          width: 100px;
          margin-left: -70px;
          transition: transform 0.3s ease-in-out;
          position: relative;
          left: 35px;
          animation: slide 1s;

          @keyframes slide {
            from {
              margin-left: -100px;
            }
            to {
              margin-left: -70px;
            }
          }

          @keyframes slideOut {
            from {
              margin-left: -70px;
            }
            to {
              margin-left: -100px;
            }
          }
          &.exit {
            animation: slideOut 1s forwards;
          }

          &:hover ~ pd-deck-card {
            transform: rotate(1deg);
          }
        }
      }`
    ,
  ],
})
export class AppComponent implements OnInit {
  public cards = DECK;
  private currentHand: any[] = [];
  protected cardsInHand: any[] = [];
  private handIndex = 0;
  private readonly maxCardsInHand = 10;
  private readonly initialHandSize = 25;
  public canRemoveCard = false;

  public cardStyles: { [key: number]: any } = {};

  ngOnInit() {
    this.shuffleDeck();
    this.dealHand();

    // setInterval(() => {
    //   this.triggerExitAnimation();
    // }, 4000);

    let index = 1;
    setInterval(() => {
      this.cardsInHand = this.currentHand.slice(this.handIndex, this.handIndex + index);
      if (index < 25) index += 1;
    }, 1000);
  }

  private shuffleDeck() {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
  }

  private dealHand() {
    this.currentHand = this.cards.slice(0, this.initialHandSize);
    this.cardsInHand = this.currentHand.slice(this.handIndex, this.handIndex + this.maxCardsInHand);
  }

  private drawCard() {
    this.handIndex += this.maxCardsInHand;
    const validHand = this.currentHand.slice(this.handIndex, this.handIndex + this.maxCardsInHand);
    this.cardsInHand = validHand.length ? validHand : this.resetHand();
    document.documentElement.style.setProperty('--card-in-hand', `${this.cardsInHand.length}`);
  }

  private resetHand() {
    this.handIndex = 0;
    return this.currentHand.slice(this.handIndex, this.handIndex + this.maxCardsInHand);
  }

  private triggerExitAnimation() {
    this.canRemoveCard = true;
    setTimeout(() => {
      this.fn();
    }, 1000);
  }

  private fn() {
    this.canRemoveCard = false;
    this.drawCard();
  }

  public readonly yOffsetMiddle = 0;
  public readonly yOffsetBottom = 25;
  public readonly rotationStart = -15;
  public readonly rotationEnd = 15;

  public getCardStyle(index: number) {
    // ajustando a base de dados para realizar o cálculo
    const cardsInHandLength = this.cardsInHand.length;
    const normalizedIndex = cardsInHandLength == 1 ? 1 : index / (this.cardsInHand.length - 1);
    const distanceFromCenter = Math.abs(normalizedIndex - 0.5);
    const norm = distanceFromCenter / 0.5;

    // aplicando a animação baseado n
    const diffY = this.yOffsetBottom - this.yOffsetMiddle;
    const yOffset = this.yOffsetMiddle + diffY * norm;
    const rotation = cardsInHandLength == 1 ? 0 : this.rotationStart + (this.rotationEnd - this.rotationStart) * normalizedIndex;

    return {
      transform: `translate(-50%, ${yOffset}%) rotate(${rotation}deg)`,
    };
  }
}
