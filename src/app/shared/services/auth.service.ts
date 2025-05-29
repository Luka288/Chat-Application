import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';
import { privateUser, publicUser } from '../interfaces/user.interface';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { PublicUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly FireAuth = inject(Auth);
  private readonly Fire = inject(Firestore);
  private readonly router = inject(Router);

  async googleAuth() {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(this.FireAuth, provider);

      this.router.navigate(['/chats']);

      this.storeUsers();
    } catch (error) {}
  }

  // აბრუნებს null მნისვნელობას თითქმის ყველა
  // მომხმარებლის დატაზე საჭიროა anonymous სახელის
  // გამოტანა თემფლეითში
  async loginAsAnonym() {
    const user = getAuth();

    try {
      const userData = await signInAnonymously(user);

      return userData;
    } catch (error) {
      return error;
    }
  }

  async logOut() {
    this.FireAuth.signOut();
  }

  async storeUsers() {
    const user = this.FireAuth.currentUser;
    if (!user) {
      return;
    }

    const privateData = User.privateUserModel(user);
    const publicUserData = PublicUser.publicUserModel(user);

    const usersRef = doc(this.Fire, `users/${user.uid}`);
    const publicRef = doc(this.Fire, `publicUser/${user.uid}`);

    try {
      // ინახავს იუზერის პრივატულ ინფორმაციას რაც მხოლოდ
      // რაც მხოლოდ იუზერისთვისაა ხელმისაწვდომი
      await setDoc(usersRef, privateData, { merge: true });

      // ინახავს ისეთ დატას რომელიც საჭიროა ჩათებში გამოსატანად
      // მაგალითან არის თუ არა იუზერი ონლინე
      await setDoc(publicRef, publicUserData, { merge: true });
    } catch (error) {
      console.error(error);
    }
  }

  currentUser(): Observable<privateUser | null> {
    const user = this.FireAuth.currentUser;

    if (!user) return of(null);

    const userRef = doc(this.Fire, `users/${user.uid}`);

    return from(getDoc(userRef)).pipe(
      switchMap((user) => {
        if (user.exists()) {
          const data = user.data() as privateUser;
          return of(data);
        } else {
          return of(null);
        }
      })
    );
  }
}
