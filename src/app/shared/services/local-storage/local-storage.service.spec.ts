import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe(`${LocalStorageService.name}`, () => {
  let service: LocalStorageService;
  let localStorageMock: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as unknown as Storage;

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    const key = 'testKey';
    const value = { name: 'Test' };

    service.setItem(key, value);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('should get an item from localStorage', () => {
    const key = 'testKey';
    const value = { name: 'Test' };

    (localStorageMock.getItem as jest.Mock).mockReturnValue(JSON.stringify(value));

    const result = service.getItem<{ name: string }>(key);
    expect(result).toEqual(value);
  });

  it('should return null if the item does not exist in localStorage', () => {
    (localStorageMock.getItem as jest.Mock).mockReturnValue(null);

    const result = service.getItem<{ name: string }>('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    const key = 'testKey';

    service.removeItem(key);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
  });

  it('should clear all items from localStorage', () => {
    service.clear();
    expect(localStorageMock.clear).toHaveBeenCalled();
  });
});
