import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import Base from './base';
import Operation from './operation.entity';
import User from './user.entity';
import { CategoryTypeEnum } from '../../enums/category-type.enum';

@Entity({
  name: 'categories',
})
class Category extends Base {
  @Column()
  public name: string;

  @Column()
  public type: CategoryTypeEnum;

  @OneToMany(() => Operation, (operation) => operation.category)
  public operations: Operation[];

  @ManyToOne(() => User, (user) => user.categories)
  public user: User;

  @Column()
  userId: number;
}

export default Category;
