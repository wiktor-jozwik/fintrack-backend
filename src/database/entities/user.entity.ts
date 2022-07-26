import { Column, Entity, OneToMany } from 'typeorm';
import Base from './base';
import Category from './category.entity';

@Entity({
  name: 'users',
})
class User extends Base {
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

  @OneToMany(() => Category, (category) => category.user)
  public categories: Category[];
}

export default User;
