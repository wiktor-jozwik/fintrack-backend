import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from './category.entity';
import Currency from './currency.entity';

export type OperationCreate = Omit<
  Operation,
  'id' | 'categoryId' | 'currencyId'
>;

@Entity({
  name: 'operations',
})
class Operation {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ type: 'decimal' })
  public moneyAmount: number;

  @Column({ type: 'date' })
  public date: Date;

  @ManyToOne(() => Category, (category) => category.operations)
  public category: Category;

  @Column()
  public categoryId: number;

  @ManyToOne(() => Currency, (currency) => currency.operations)
  public currency: Currency;

  @Column()
  public currencyId: number;
}

export default Operation;
