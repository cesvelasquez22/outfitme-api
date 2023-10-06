import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  profileName: string;

  @Column('bool', { default: false })
  default: boolean;

  @ManyToOne(() => User, (user) => user.profiles, {
    onDelete: 'CASCADE',
  })
  user: User;
}
