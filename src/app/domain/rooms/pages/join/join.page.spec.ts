import { getTranslocoTestingModule, getTranslocoTestingProviders } from '@shared';
import { fireEvent, render, screen } from '@testing-library/angular';
import { RoomsService } from '../../services/rooms.service';
import { JoinPage } from './join.page';

describe('JoinPage', () => {
  let roomsService: RoomsService;

  beforeEach(async () => {
    const { fixture: componentFixture } = await render(JoinPage, {
      imports: [getTranslocoTestingModule()],
      providers: [getTranslocoTestingProviders('join-page')],
    });

    roomsService = componentFixture.debugElement.injector.get(RoomsService);
  });

  it('should create', () => {
    expect(screen.getByText('Created rooms')).toBeInTheDocument();
  });

  it('create button should init disabled', () => {
    const createRoomButton = screen.getByRole('button');
    expect(createRoomButton).toBeDisabled();
  });

  it('create button should be enabled when input is not empty', () => {
    const input = screen.getByPlaceholderText('Room name');

    fireEvent.input(input, { target: { value: 'Test Room' } });

    const createRoomButton = screen.getByRole('button');
    expect(createRoomButton).toBeEnabled();
  });

  it('create button should call createRoom method', () => {
    const createRoomButton = screen.getByRole('button');
    const input = screen.getByPlaceholderText('Room name');

    roomsService.createRoom = jest.fn();

    fireEvent.input(input, { target: { value: 'Test Room' } });
    fireEvent.click(createRoomButton);

    expect(roomsService.createRoom).toHaveBeenCalledWith('Test Room');
  });
});
