import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Category from './category.entity';
import UserCurrency from './user-currency.entity';

@Entity({
  name: 'users',
})
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public firstName: string;

  @Column({ nullable: true })
  public lastName: string;

  @Column({ nullable: true })
  public phoneNumber: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Category, (category) => category.user)
  public categories: Category[];

  @OneToMany(() => UserCurrency, (userCurrency) => userCurrency.user)
  public userCurrencies: UserCurrency[];
}

export default User;
