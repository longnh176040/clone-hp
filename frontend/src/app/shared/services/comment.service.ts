import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Comment {
  _id?: string;
  content: string;
  username: string;
  created_at: string;
  replies?: Reply[];
}

export interface Reply {
  _id?: string;
  content: string;
  username: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})


export class CommentService {

  private readonly CMT_URL = environment.apiURL + "/comment";

  constructor(private http: HttpClient) { }

  getComments(productId: string) {
    return this.http.get<Comment[]>(this.CMT_URL + "?product=" + productId);
  }

  addComment(comment: Comment) {
    return this.http.post<{_id: string}>(this.CMT_URL, comment);
  }

  addReply(reply: Reply, commentId: string) {
    return this.http.post(this.CMT_URL + "/reply?id=" + commentId, reply);
  }
}
