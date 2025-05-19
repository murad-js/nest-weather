import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscription')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  city: string;

  @Column({
    type: 'enum',
    enum: ['hourly', 'daily'],
    default: 'daily',
  })
  frequency: 'hourly' | 'daily';

  @Column({ default: false })
  confirmed: boolean;

  @Column({ unique: true, nullable: false })
  confirmationToken: string;

  @Column({ unique: true, nullable: false })
  unsubscribeToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
