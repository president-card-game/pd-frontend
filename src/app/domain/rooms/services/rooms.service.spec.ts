import { TestBed } from '@angular/core/testing';
import { SocketService } from '@shared';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  let service: RoomsService;
  const socketServiceMock = {
    onEvent: jest.fn(),
    emitMessage: jest.fn(),
    id: 'test-socket-id',
    removeListener: jest.fn(),
  };

  const getEventListener = (eventName: string) => {
    const calls = socketServiceMock.onEvent.mock.calls;
    const [, callback] = calls.find(([event]) => event === eventName);

    return callback;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      providers: [RoomsService, { provide: SocketService, useValue: socketServiceMock }],
    }).compileComponents();

    service = TestBed.inject(RoomsService);
  });

  it('should register event listeners', () => {
    expect(socketServiceMock.onEvent).toHaveBeenCalledWith('roomsUpdate', expect.any(Function));
    expect(socketServiceMock.onEvent).toHaveBeenCalledWith('roomCreated', expect.any(Function));
    expect(socketServiceMock.onEvent).toHaveBeenCalledWith('errorMessage', console.log);
  });

  describe('room handling', () => {
    it('should update rooms list when receiving roomsUpdate', async () => {
      const mockRooms = [{ id: '1', name: 'Room 1', users: [] }];
      const updateCallback = getEventListener('roomsUpdate');

      updateCallback(mockRooms);

      expect(service.rooms()).toEqual(mockRooms);
    });

    it('should add new room and update current room when receiving roomCreated', () => {
      const mockRoom = { id: '1', name: 'New room' };
      const createCallback = getEventListener('roomCreated');

      createCallback(mockRoom);

      expect(service.currentRoomId()).toBe('1');
      expect(service.rooms()).toEqual([{ ...mockRoom, users: [] }]);
    });

    it('should update current room users when receiving roomUsers', () => {
      service.rooms.set([{ id: 'room1', name: 'Room 1', users: [] }]);
      service.joinRoom('room1');
      const currentRoom = service.currentRoom();
      console.log({ currentRoom });

      expect(socketServiceMock.onEvent).toHaveBeenCalledWith('roomUsers', expect.any(Function));

      const usersCallback = getEventListener('roomUsers');

      const mockUsers = [{ id: 'user1', name: 'User 1', isReady: false }];
      usersCallback(mockUsers);

      expect(service.currentRoom()?.users).toEqual(mockUsers);
    });
  });

  describe('user actions', () => {
    it('should emit joinRoom and update current room when no room is set', async () => {
      service.joinRoom('123');

      expect(socketServiceMock.emitMessage).toHaveBeenCalledWith('joinRoom', { roomId: '123' });
      expect(socketServiceMock.onEvent).toHaveBeenCalledWith('roomUsers', expect.any(Function));
      expect(service.currentRoomId()).toBe('123');
    });

    it('should emit createRoom with room name', () => {
      service.createRoom('New Room');
      expect(socketServiceMock.emitMessage).toHaveBeenCalledWith('createRoom', 'New Room');
    });

    it('should emit toggleUserReady with current status', () => {
      service.currentRoomId.set('123');
      service.rooms.set([
        {
          id: '123',
          name: 'Room',
          users: [{ id: 'test-socket-id', name: 'User', isReady: false, isHost: false }],
        },
      ]);

      service.toggleIsReady();

      expect(socketServiceMock.emitMessage).toHaveBeenCalledWith('toggleUserReady', { roomId: '123', isReady: false });
    });

    it('should not emit toggleUserReady if there is no current room', () => {
      service.toggleIsReady();
      expect(socketServiceMock.emitMessage).not.toHaveBeenCalled();
    });

    it('should emit leaveRoom and clear current room', () => {
      service.currentRoomId.set('123');
      service.leaveRoom();

      expect(socketServiceMock.emitMessage).toHaveBeenCalledWith('leaveRoom', '123');
      expect(socketServiceMock.removeListener).toHaveBeenCalledWith('roomUsers');
      expect(service.currentRoomId()).toBeNull();
    });
  });

  describe('computed properties', () => {
    it('should return current room correctly', async () => {
      const mockRoom = { id: '123', name: 'Room', users: [] };
      service.currentRoomId.set('123');
      service.rooms.set([mockRoom]);

      expect(service.currentRoom()).toEqual(mockRoom);
    });

    it('should return null when there is no current room', () => {
      expect(service.currentRoom()).toBeNull();
    });

    it('should identify current user in the room', () => {
      const mockUser = { id: 'test-socket-id', name: 'User', isReady: false, isHost: false };
      service.currentRoomId.set('123');
      service.rooms.set([
        {
          id: '123',
          name: 'Room',
          users: [mockUser],
        },
      ]);

      expect(service.me()).toEqual(mockUser);
    });
  });
});
