import { Module } from '@nestjs/common';
import { firebaseProvider } from './firebase';
import { FirebaseService } from './firebase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [FirebaseService],
  providers: [firebaseProvider, FirebaseService],
})
export class FirebaseModule {}
