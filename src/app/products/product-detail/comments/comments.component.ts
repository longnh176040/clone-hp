import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/shared/services/auth.service";
import {
  Comment,
  CommentService,
} from "src/app/shared/services/comment.service";
import { Converter } from "src/app/shared/utils/util.convert";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"],
})
export class CommentsComponent implements OnInit {
  public form: FormGroup;
  public comments: Comment[] = [];
  private converter: Converter = new Converter();

  @Input() laptopId: string;
  @Input() storedComment: Comment[] = [];
  @Output() commentEmitter = new EventEmitter<Comment[]>();

  constructor(
    private commentService: CommentService,
    public authService: AuthService
  ) {
    this.form = new FormGroup({
      content: new FormControl(null, [Validators.required]),
      created_at: new FormControl(null),
      username: new FormControl(null),
      product: new FormControl(null),
      commentId: new FormControl(null),
    });
  }

  ngOnInit(): void {
    
    if (!this.storedComment) {
      this.commentService.getComments(this.laptopId).subscribe((res) => {
        this.comments = res;
        this.emitComments(this.comments);
      });
    } else {
      this.comments = this.storedComment
    }

  }

  emitComments(comments: Comment[]) {
    this.commentEmitter.emit(comments);
  }

  addComment() {
    this.form.patchValue({
      username: this.authService.getUser().getDisplayName(),
      created_at: this.converter.timeConvert(),
      product: this.laptopId,
    });
    this.commentService
      .addComment(this.form.value)
      .pipe(
        map((res) => {
          this.comments.unshift({
            content: this.form.value.content,
            created_at: this.form.value.created_at,
            username: this.form.value.username,
            replies: [],
            _id: res._id,
          });
          this.emitComments(this.comments)
        })
      )
      .subscribe((res) => {
        this.form.reset();
      });
  }

  addReply(commentId: string) {
    this.form.patchValue({
      username: this.authService.getUser().getDisplayName(),
      created_at: this.converter.timeConvert(),
      commentId: commentId,
    });
    this.commentService
      .addReply(this.form.value, commentId)
      .pipe(
        map(res => {
          this.comments.map(cmt => {
            if (cmt._id === commentId) {
              cmt.replies.push({
                username: this.form.value.username,
                content: this.form.value.content,
                created_at: this.form.value.created_at,
              })
            }
          })
        })
      )
      .subscribe((res) => {
        this.form.reset()
      });
  }
}
