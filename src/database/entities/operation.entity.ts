import { Column, Entity, ManyToOne } from 'typeorm';
import Base from './base';
import Category from './category.entity';

@Entity({
  name: 'operations',
})
class Operation extends Base {
  @Column()
  public name: string;

  @Column({ type: 'decimal' })
  public moneyAmount: number;

  @ManyToOne(() => Category, (category) => category.operations)
  public category: Category;
}

export default Operation;
