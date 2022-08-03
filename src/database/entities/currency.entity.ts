import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import UserCurrency from './user-currency.entity';

@Entity({
  name: 'currencies',
})
class Currency {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public symbol: string;

  @OneToMany(() => UserCurrency, (userCurrency) => userCurrency.currency)
  public userCurrencies: UserCurrency[];
}

export default Currency;
