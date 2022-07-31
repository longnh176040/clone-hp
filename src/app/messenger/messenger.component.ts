import { Input, SimpleChanges } from "@angular/core";
import { AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { of } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Message } from "../shared/models/message.model";
import { AuthService } from "../shared/services/auth.service";
import { ChatService } from "../shared/services/chat.service";
import { Converter } from "../shared/utils/util.convert";

@Component({
  selector: "app-messenger",
  templateUrl: "./messenger.component.html",
  styleUrls: ["./messenger.component.css"],
})
export class MessengerComponent implements OnInit {
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  @Input("isOpenChatBox") isOpenChatBox = false;
  public sendButton = true;
  public message: string;
  public messages: Message[] = [];

  private username: string;
  public uid: string;
  newMes: boolean;
  time: any;

  constructor(
    private _chatService: ChatService,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this.scrollToBottom();
    this._authService.user$.subscribe((user) => {
      if (user) {
        this.username = user.name;
        this.uid = user.id;
      } else {
        this.username = "anonymous";
        this.uid = "anonymous" + Date.now();
      }
    });
    this._chatService.getNewMessage().subscribe((message) => {
      this.messages.push(message);
      this.newMes = true;
    });
    // this.time = document.getElementById("time")
    // this.messages.scrollTop = 99999;
    // console.log(this.time);
  }

  ngOnChanges(changes: SimpleChanges) {
    of(this.isOpenChatBox)
      .pipe(
        filter((_) => this.isOpenChatBox == true),
        map((_) => {
          this._chatService.setSocketCredential(this.uid);
        })
      )
      .subscribe();
  }

  send() {
    const convert = new Converter();
    const data: Message = {
      username: this.username,
      content: this.message,
      uid: this.uid,
      created_at: convert.timeConvert(),
      room_id: this._chatService.getRoomId(),
      // socket_id: this._chatService.getSocketId(),
      received_socket_id: null,
    };
    
    if (this.message !== null) {
      this._chatService.sendMessage(data).subscribe((res) => {
        this.messages.push(data);
        this.message = null;
        this.newMes = false;
      });
    }
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
