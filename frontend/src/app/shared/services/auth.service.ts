import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import { BehaviorSubject, Subject, throwError as observableThrowError } from "rxjs";
import { User } from "src/app/shared/models/user.model";
import { Hash } from "../models/hashPass";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  static user: User = new User();
  static authenticated: boolean = false;
  static verified: boolean = false;
  static returnURI: string = "/";
  static anonymous_user_cart = [];

  private userListener = new BehaviorSubject<User>(null);
  public user$ = this.userListener.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  private static _handleError(err: HttpErrorResponse | any) {
    return observableThrowError(
      err.message || "Error: Unable to complete request."
    );
  }

  getUser() {
    return AuthService.user;
  }

  isAuthenticated() {
    return AuthService.authenticated;
  }

  register(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => {
            let pass = new Hash();
            res.user.sendEmailVerification();
            this.addUser(
              res.user.uid,
              value.name,
              value.email,
              value.phone,
              value.gender,
              pass.md5(value.password)
            );
            this.resolveUser();
            resolve(firebase.auth().currentUser);
          },
          (err) => reject(err)
        );
    });
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject("No user logged in");
        }
      });
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.signOut().then(() => {
          this.resolveUser().then(() => resolve(AuthService.user));
        });
      } else {
        this.userListener.next(null)
        reject();
      }
    });
  }

  doEmailLogin(value) {
    let hash = new Hash();
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => {
            this.resolveUser();
            resolve(firebase.auth().currentUser);
          },
          (err) => reject(err)
        );
    });
  }

  updateUserCart(uid, value) {
    return this.db
      .collection("users")
      .doc(uid)
      .update({
        cart: value,
      })
      .then((res) => this.resolveUser());
  }

  addUser(uid, name, email, phone, gender, password) {
    return this.db.collection("users").doc(uid).set({
      user_id: uid,
      name: name,
      role: "user",
      email: email,
      phone: phone,
      gender: gender,
      school: "",
      is_student: "",
      password: password,
      birth: "",
      cart: "0",
    });
  }

  getAnonymousCart() {
    this.setAnonymousCart();
    return AuthService.anonymous_user_cart;
  }

  setAnonymousCart() {
    const isServer = !isPlatformBrowser(this.platformId);
    if (!isServer) {
      if (sessionStorage.getItem("cart") != null) {
        AuthService.anonymous_user_cart = JSON.parse(
          sessionStorage.getItem("cart")
        );
      }
    }
  }

  resolveUser() {
    return this.getCurrentUser().then(
      (res) => {
        this.db
          .collection("users")
          .doc(res.uid)
          .get()
          .subscribe((ref) => {
            let user = new User();
            user.id = ref.data()["user_id"];
            user.name = ref.data()["name"];
            user.email = res.email;
            user.role = ref.data()["role"];
            user.phone = ref.data()["phone"];
            user.gender = ref.data()["gender"];
            user.password = ref.data()["password"];
            user.school = ref.data()["school"];
            user.is_student = ref.data()["is_student"];
            user.birth = ref.data()["birth"];
            user.cart = ref.data()["cart"];
            AuthService.authenticated = true;
            AuthService.verified = true;
            if (
              res.providerData[0].providerId == "password" &&
              res.emailVerified != true
            ) {
              AuthService.verified = false;
            }
            AuthService.user = user;
            this.userListener.next(user);
          });
      },
      (err) => {
        AuthService.authenticated = false;
        AuthService.verified = false;
        AuthService.user = new User();
      }
    );
  }
}
