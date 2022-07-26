import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import Base from './base';
import Operation from './operation.entity';
import User from './user.entity';

@Entity({
  name: 'categories',
})
class Category extends Base {
  @Column()
  public name: string;

  @Column({ name: 'type' })
  public type: CategoryTypeEnum;

  @OneToMany(() => Operation, (operation) => operation.category)
  public operations: Operation[];

  @ManyToOne(() => User, (user) => user.categories)
  public user: User;
}

export default Category;
