import { privateUser, publicUser } from '../interfaces/user.interface';
import type { User as FirebaseUser } from '@firebase/auth';

// იუზერის დაცული ინფორმაციის შესაქმნელად
export class User {
  constructor(
    public uid: string,
    public email: string,
    public username: string,
    public photoURL: string,
    public isAnonymous: string,
    public chats: { chatName: string; chatId: string }[]
  ) {}

  static privateUserModel(user: FirebaseUser): privateUser {
    return {
      uid: user.uid,
      email: user.email!,
      username: user.isAnonymous
        ? `Guest#${user.uid.substring(0, 4)}`
        : user.displayName!,
      photoURL: user.photoURL!,
      isAnonymous: user.isAnonymous ? 'Anonymous' : 'standard_user',
      chats: [{ chatName: 'general', chatId: 'general' }],
    };
  }
}

// იუზერის საჯარო ინფორმაციის შესაქმნელად
export class PublicUser {
  constructor(
    public uid: string,
    public username: string,
    public photoURL: string,
    public isAnonymous: 'Anonymous' | 'standard_user'
  ) {}

  static publicUserModel(user: FirebaseUser): publicUser {
    return {
      uid: user.uid,
      username: user.isAnonymous
        ? `Guest#${user.uid.substring(0, 4)}`
        : user.displayName!,
      photoURL: user.photoURL || '',
      isAnonymous: user.isAnonymous ? 'Anonymous' : 'standard_user',
    };
  }
}
