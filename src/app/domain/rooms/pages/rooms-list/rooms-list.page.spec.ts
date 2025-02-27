import { signal } from '@angular/core';
import { getTranslocoTestingModule, getTranslocoTestingProviders } from '@shared';
import { render, screen } from '@testing-library/angular';
import { Room } from '../../interfaces';
import { generateRoomsServiceMock } from '../../mocks';
import { RoomsService } from '../../services/rooms/rooms.service';
import { RoomsListPage } from './rooms-list.page';
import { ComponentFixture } from '@angular/core/testing';

describe('RoomsListPage', () => {
  const currentRoom = signal<Room | null>(null);
  let fixture: ComponentFixture<RoomsListPage>;

  const rooms = signal(
    Array.from({ length: 3 }, (_, index) => ({
      id: index.toString(),
      name: `Room ${index + 1}`,
      users: [],
    })),
  );

  beforeEach(async () => {
    const { fixture: componentFixture } = await render(RoomsListPage, {
      imports: [getTranslocoTestingModule()],
      providers: [
        getTranslocoTestingProviders('rooms-list-page'),
        { provide: RoomsService, useValue: generateRoomsServiceMock(currentRoom, rooms) },
      ],
    });

    fixture = componentFixture;
  });

  it('should display rooms', () => {
    rooms().forEach((room) => {
      expect(screen.getByText(room.name)).toBeVisible();
    });
  });

  it('should display no rooms created', () => {
    rooms.set([]);
    fixture.detectChanges();

    expect(screen.getByText('No rooms created!')).toBeVisible();
  });
});
