import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FIREBASE = 'FIREBASE';

export const firebaseProvider = {
  provide: FIREBASE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig = {
      type: configService.get('firebase.type'),
      project_id: configService.get('firebase.project_id'),
      private_key_id: configService.get('firebase.private_key_id'),
      private_key: configService.get('firebase.private_key').replace(/\\n/g, '\n'),
      client_email: configService.get('firebase.client_email'),
      client_id: configService.get('firebase.client_id'),
      auth_uri: configService.get('firebase.auth_uri'),
      token_uri: configService.get('firebase.token_uri'),
      auth_provider_x509_cert_url: configService.get('firebase.auth_provider_x509_cert_url'),
      client_x509_cert_url: configService.get('firebase.client_x509_cert_url'),
    } as admin.ServiceAccount;
    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  },
};
