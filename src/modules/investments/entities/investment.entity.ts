import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  investorId: string;

  @Column()
  projectId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'investorId' })
  investor: User;

  @ManyToOne(() => Project, project => project.investments)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}