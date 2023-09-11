import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE } from './firebase';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  readonly auth: admin.auth.Auth;
  readonly #cloudStorage: admin.storage.Storage;
  constructor(@Inject(FIREBASE) private readonly firebase: admin.app.App) {
    this.auth = this.firebase.auth();
    this.#cloudStorage = this.firebase.storage();
  }
}
