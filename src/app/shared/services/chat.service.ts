import { Injectable } from "@angular/core";
import io from "socket.io-client";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { filter, map } from "rxjs/operators";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Message } from "../models/message.model";
import * as _array from "lodash/array";
import * as _collection from "lodash/collection";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private readonly CHAT_URL = environment.apiURL + "/chat";

  private socket;
  private socketId: string;
  private room_id: string;
  private newUser$ = new BehaviorSubject<any>(null);
  private newMessage$ = new Subject<Message>();

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  public initSocket() {
    this.socket = io(environment.socketServer, {
      path: "/socket",
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    this.socket.on("connect", () => {
      this.socketId = this.socket.id;
      
    });
  }

  public setSocketCredential(anonymous_uid?: string) {
    this.authService.user$
      .pipe(
        filter((_) => this.socketId != null),
        map((user) => {
          this.room_id = Math.random().toString(36).substring(7);
          if (user) {
            return {
              name: user.name,
              uid: user.id,
              socketId: this.socketId,
              role: user.role,
              room_id: this.room_id,
              status: "active",
            };
          }
          return {
            name: "anonymous",
            uid: anonymous_uid,
            role: "user",
            socketId: this.socketId,
            room_id: this.room_id,
            status: "active",
          };
        })
      )
      .subscribe((socketCredential) => {
        this.emit("setSocketCredential", socketCredential);
      });
  }

  public getRoomId() {
    return this.room_id;
  }

  public getSocketId() {
    return this.socketId;
  }

  public sendMessage(message: Message) {
    return this.httpClient.post(this.CHAT_URL, message);
  }

  public getUserMessages(userId) {
    return this.httpClient.get<Message[]>(this.CHAT_URL + "?room=" + userId);
  }

  public emit(action: string, data: any) {
    this.socket.emit(action, data);
  }

  public listenNewMessage() {
    this.socket.on("message", (data) => {
      this.newMessage$.next(data);
    });
  }

  public getActiveUser() {
    this.socket.on("user", (user) => {
        this.newUser$.next(user);
    });
    return this.newUser$.asObservable();
  }

  public getNewMessage() {
    this.socket.on("message", (data) => {
      this.newMessage$.next(data);
    });
    return this.newMessage$.asObservable();
  }
}
