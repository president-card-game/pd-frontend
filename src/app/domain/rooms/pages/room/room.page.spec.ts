import { signal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { getTranslocoTestingModule, getTranslocoTestingProviders } from '@shared';
import { fireEvent, render, screen } from '@testing-library/angular';
import { Room, User } from '../../interfaces';
import { RoomsService } from '../../services/rooms.service';
import { RoomPage } from './room.page';
import { generateRoomsServiceMock } from '../../mocks';

describe('RoomPage', () => {
  let fixture: ComponentFixture<RoomPage>;
  let roomsService: RoomsService;
  const currentRoom = signal<Room | null>({
    id: '123',
    name: 'Test Room',
    users: [
      { id: '1', name: 'User 1', isReady: true, isHost: true },
      { id: '2', name: 'User 2', isReady: false, isHost: false },
    ],
  });

  const mockActivatedRoute = {
    snapshot: {
      params: { roomId: '123' },
    },
  };
  const mockRouter = {
    navigate: jest.fn(),
  };

  const baseUser: User = { id: '1', name: 'User 1', isReady: true, isHost: true };
  const updateUsersAndDetectChanges = (users: User[]) => {
    currentRoom.update((room) => ({
      ...(room as Room),
      users,
    }));

    fixture.detectChanges();
  };
  beforeEach(async () => {
    const { fixture: componentFixture } = await render(RoomPage, {
      imports: [getTranslocoTestingModule()],
      providers: [
        getTranslocoTestingProviders('room-page'),
        { provide: RoomsService, useValue: generateRoomsServiceMock(currentRoom) },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = componentFixture;
    roomsService = componentFixture.debugElement.injector.get(RoomsService);

    fixture.detectChanges();
  });

  it('should call joinRoom on initialization with the correct roomId', () => {
    expect(roomsService.joinRoom).toHaveBeenCalledWith('123');
  });

  it('should display the room name', () => {
    const roomName = screen.getByText('Test Room');

    expect(roomName).toBeVisible();
  });

  it('should call leaveRoom when leave button is clicked', () => {
    const leaveButton = screen.getByTestId('leave-button');

    fireEvent.click(leaveButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(expect.any(Array));
    expect(roomsService.leaveRoom).toHaveBeenCalled();
  });

  it('should display the ready icon when the user is ready and is not the host', () => {
    updateUsersAndDetectChanges([
      { ...baseUser, isHost: false },
      { ...baseUser, id: '2', isReady: false },
    ]);

    expect(screen.getByTestId('ready-icon')).toBeVisible();
  });

  it('start game button should display correct text', () => {
    updateUsersAndDetectChanges([
      { ...baseUser, isHost: true },
      { ...baseUser, id: '2', isReady: false, isHost: false },
    ]);

    expect(screen.getByText('Waiting for players...')).toBeVisible();

    updateUsersAndDetectChanges([baseUser, { ...baseUser, id: '2', isHost: false }]);

    expect(screen.getByText('Start game')).toBeVisible();
  });

  it('should enable start game button only when all players are ready', () => {
    updateUsersAndDetectChanges([baseUser, { ...baseUser, id: '2', isReady: false }]);

    const startGameButton = screen.getByTestId('start-game-button');
    expect(startGameButton).toBeDisabled();

    updateUsersAndDetectChanges([baseUser, { ...baseUser, id: '2', isHost: false }]);

    expect(screen.getByTestId('start-game-button')).toBeEnabled();
  });

  it('should display correct text when ready button is clicked', () => {
    updateUsersAndDetectChanges([
      { ...baseUser, isReady: false, isHost: false },
      { ...baseUser, id: '2', isReady: false },
    ]);

    expect(screen.getByText('Mark as ready')).toBeVisible();

    updateUsersAndDetectChanges([
      { ...baseUser, isHost: false },
      { ...baseUser, id: '2' },
    ]);

    expect(screen.getByText('Unmark as ready')).toBeVisible();
  });

  it('should call toggleIsReady when ready button is clicked', () => {
    updateUsersAndDetectChanges([
      { ...baseUser, isHost: false },
      { ...baseUser, id: '2', isReady: false },
    ]);

    const toggleReadyButton = screen.getByTestId('toggle-ready-button');

    fireEvent.click(toggleReadyButton);

    expect(roomsService.toggleIsReady).toHaveBeenCalled();
  });

  it('should display not found room message when room is not found', () => {
    currentRoom.set(null);
    fixture.detectChanges();

    expect(screen.getByText('This room does not exist')).toBeVisible();
    expect(screen.getByText('Back to the initial page')).toBeVisible();
  });

  it('should navigate back to initial page when back button is clicked', () => {
    const backButton = screen.getByText('Back to the initial page');

    fireEvent.click(backButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(expect.any(Array));
  });
});
