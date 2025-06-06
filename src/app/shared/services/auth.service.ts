import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { doc, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';
import { privateUser } from '../interfaces/user.interface';
import { from, Observable, of, switchMap } from 'rxjs';
import { PublicUser, User } from '../models/user.model';
import { loginData, registartionData } from '../interfaces/reg.interface';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly FireAuth = inject(Auth);
  private readonly Fire = inject(Firestore);
  private readonly router = inject(Router);
  private readonly alerts = inject(AlertsService);

  async googleAuth() {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(this.FireAuth, provider);

      this.router.navigate(['/chats']);

      this.storeUsers();
    } catch (error) {}
  }

  async registerUser(data: registartionData) {
    try {
      const createUser = await createUserWithEmailAndPassword(
        this.FireAuth,
        data.email,
        data.password
      );

      await updateProfile(createUser.user, { displayName: data.username });
      this.storeUsers();

      this.alerts.toast('Account registered', 'success', 'green');
    } catch (error) {
      this.alerts.toast('Something went wrong try again', 'error', 'red');
      console.error(error);
    } finally {
      this.router.navigateByUrl('/chats');
    }
  }

  async loginUser(data: loginData) {
    return signInWithEmailAndPassword(this.FireAuth, data.email, data.password)
      .then(() => {
        this.router.navigateByUrl('/chats');
      })
      .catch((e) => {
        this.alerts.toast('Something went wrong', 'error', 'red');
        throw e;
      });
  }

  async loginAsAnonym() {
    const user = getAuth();

    try {
      const userData = await signInAnonymously(user).then((u) => {
        this.storeUsers();
      });

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
