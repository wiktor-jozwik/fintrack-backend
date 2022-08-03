import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Currency from './currency.entity';

@Entity({
  name: 'users_currencies',
  orderBy: {
    createdAt: 'ASC',
  },
})
class UserCurrency {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => User, (user) => user.userCurrencies)
  public user: User;

  @Column()
  public userId: number;

  @ManyToOne(() => Currency, (currency) => currency.userCurrencies)
  public currency: Currency;

  @Column()
  public currencyId: number;
}

export default UserCurrency;
