import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import UserCurrency from './user-currency.entity';
import Operation from './operation.entity';

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

  @OneToMany(() => Operation, (operation) => operation.category)
  public operations: Operation[];
}

export default Currency;
