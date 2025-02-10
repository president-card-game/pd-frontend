import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly socket = io(environment.apiUrl);
  public id: string;

  constructor() {
    this.socket.on('connect', () => {
      this.id = this.socket.id as string;
    });
  }

  public emitMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  public onEvent(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  public removeListener(event: string) {
    this.socket.off(event);
  }
}
