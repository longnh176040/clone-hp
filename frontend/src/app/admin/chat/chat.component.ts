import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { filter, tap } from "rxjs/operators";
import { Message } from "src/app/shared/models/message.model";
import { AuthService } from "src/app/shared/services/auth.service";
import { ChatService } from "src/app/shared/services/chat.service";
import { Converter } from "src/app/shared/utils/util.convert";

import * as _collection from "lodash/collection";
import { AfterViewChecked } from "@angular/core";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  public users: any = [];
  public messages: Message[];
  public message: string;
  public room_id: string;
  public adminId: string;
  public selectedUserId: string;

  private userSocketId: string;

  newMes: boolean;

  constructor(
    private _chatService: ChatService,
    private _authService: AuthService
  ) {}
  // ngAfterViewChecked(): void {
  //   throw new Error("Method not implemented.");
  // }

  ngOnInit(): void {
    this.scrollToBottom();
    this._chatService.setSocketCredential();
    this._chatService
      .getActiveUser()
      .pipe(
        filter((_user) => _user !== null),
        tap((user) => {
          var isUserActive = true;
          this.users = _collection.filter(this.users, (_u) => {
            return _u.uid !== user.uid;
          });
          this.users.unshift(user);
          this.users.forEach((_u) => {
            if (_u.uid === this.selectedUserId && _u.room_id !== this.room_id) {
              isUserActive = false;
            }
          });
          if (!isUserActive) {
            this.room_id = undefined;
            this.messages = [];
          }
        })
      )
      .subscribe();
    this._chatService.getNewMessage().subscribe((message) => {
      this.inCommingMessage(message);
      if (message.room_id === this.room_id) {
        this.messages.push(message);
      }
    });
    this._authService.user$.subscribe((user) => {
      if (user) {
        this.adminId = user.id;
      }
    });
  }

  getUserMessage(room_id: string, userSocketId: string, user_uid: string) {
    this.selectedUserId = user_uid;
    if (this.room_id) {
      document.getElementById(this.room_id).classList.remove("bg-primary");
    }
    this.room_id = room_id;
    this.userSocketId = userSocketId;
    document.getElementById(this.room_id).classList.add("bg-primary");
    this._chatService.getUserMessages(room_id).subscribe((messages) => {
      this.messages = messages;
    });
  }

  send() {
    const convert = new Converter();
    const data: Message = {
      username: "Quản trị viên",
      content: this.message,
      uid: this.adminId,
      created_at: convert.timeConvert(),
      room_id: this.room_id,
      received_socket_id: this.userSocketId,
    };
    if (this.message !== null) {
      this._chatService.sendMessage(data).subscribe((res) => {
        this.messages.push(data);
        this.message = null;
        this.newMes = false;
      });
    }
  }

  private inCommingMessage(message: Message) {
    var user = _collection.find(this.users, { uid: message.uid });
    user = {
      uid: message.uid,
      name: user.name,
      room_id: message.room_id,
      socketId: user.socketId,
      new_message_date: message.created_at,
      new_message: message.content,
    };
    this.users = _collection.filter(this.users, (_u) => {
      return _u.uid !== message.uid;
    });
    this.users.unshift(user);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
