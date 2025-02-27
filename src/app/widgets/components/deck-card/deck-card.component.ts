import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICard } from '@models';

@Component({
  selector: 'pd-deck-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @let card = this.card();
    @let isJoker = card.visibleValue == 'joker';
    
    <div [ngClass]="['card', card.color]" data-testid="card">
      <div class="left"><ng-container class="left" [ngTemplateOutlet]="isJoker ? joker : commonExtremities"/></div>
      <div class="center"><ng-container class="center" [ngTemplateOutlet]="isJoker ? joker : commonCenter"/></div>
      <div class="right"><ng-container class="right" [ngTemplateOutlet]="isJoker ? joker : commonExtremities"/></div>
    </div>

    <ng-template #joker><img [src]="jokerImgSrc()" alt="card-joker-icon"/></ng-template>
    <ng-template #commonCenter>{{ card.suitIcon }}</ng-template>
    <ng-template #commonExtremities>{{ card.visibleValue }} {{ card.suitIcon }}</ng-template>
  `,
  styleUrls: ['./deck-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckCardComponent {
  public readonly card = input.required<ICard>();

  protected readonly jokerImgSrc = computed(() => {
    const card = this.card();
    return `./assets/icons/${card.color}-joker.png`;
  });
}
