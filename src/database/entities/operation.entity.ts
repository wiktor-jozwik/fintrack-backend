import { Column, Entity, ManyToOne } from 'typeorm';
import Base from './base';
import Category from './category.entity';

export type OperationCreate = Omit<
  Operation,
  'id' | 'createdAt' | 'updatedAt' | 'categoryId'
>;

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

  @Column()
  public categoryId: number;
}

export default Operation;
