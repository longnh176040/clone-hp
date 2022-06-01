import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Resolve, Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { User } from "../models/user.model";

@Injectable()
export class UserResolver implements Resolve<Boolean> {
  user: User;
  constructor(
    private authService: AuthService,
    private router: Router,
    private db: AngularFirestore
  ) {}

  resolve(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().then(
        (res) => {
          AuthService.user.email = res.email;
          AuthService.user.id = res.uid;
          if (
            res.providerData[0].providerId == "password" &&
            res.emailVerified != true
          ) {
            AuthService.verified = false;
          }
          AuthService.authenticated = true;

          this.db
            .collection("users")
            .doc(res.uid)
            .ref.get()
            .then(
              (doc) => {
                let data = doc.data();
                AuthService.user.name = data["name"];
                AuthService.user.role = data["role"];
                AuthService.user.phone = data["phone"];
                AuthService.user.gender = data["gender"];
                AuthService.user.password = data["password"];
                AuthService.user.school = data["school"];
                AuthService.user.is_student = data["is_student"];
                AuthService.user.birth = data["birth"];
                AuthService.user.cart = data["cart"];
                return resolve(true);
              },
              (err) => {
                return resolve(false);
              }
            );
          resolve(true);
        },
        (err) => {
          AuthService.authenticated = false;
          AuthService.verified = false;
          AuthService.user = new User();
          return resolve(false);
        }
      );
    });
  }
}
