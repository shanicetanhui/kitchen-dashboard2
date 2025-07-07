import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface OrderItems {
  name: string;
  quantity: number;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  items: OrderItems;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Received', 'Completed'],
    default: 'Pending'
  })
  status: 'Pending' | 'Received' | 'Completed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isVisible: boolean;
}
