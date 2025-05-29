import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { PublicUser } from '../models/user.model';
import { publicUser } from '../interfaces/user.interface';
import { mapToCanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly auth = inject(Auth);
  private readonly fire = inject(Firestore);

  searchUser(username: string): Observable<publicUser[]> | null {
    const user = this.auth.currentUser;

    if (!user) return null;

    const pubUsersRef = collection(this.fire, `publicUser`);

    return collectionData(pubUsersRef).pipe(
      map((users) => {
        return (users as publicUser[]).filter((user) =>
          user.username.toLowerCase().includes(username.toLowerCase())
        );
      })
    );
  }
}
