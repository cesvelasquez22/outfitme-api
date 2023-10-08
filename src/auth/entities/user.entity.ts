import { Profile } from 'src/profiles/entities/profile.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, length: 50 })
  email: string;

  @Column('text')
  fullName: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { nullable: true })
  avatar?: string;

  @CreateDateColumn({ type: 'timestamp', select: false, default: () => 'NOW()' })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    select: false,
    default: () => 'NOW()',
  })
  updatedAt?: Date;

  @Column('bool', { default: true })
  active?: boolean;

  @OneToMany(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  profiles: Profile[];
}
