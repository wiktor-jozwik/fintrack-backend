import { Column, Entity } from 'typeorm';
import Base from './base.entity';

@Entity({
  name: 'users',
})
class User extends Base {
  @Column({ nullable: true, name: 'first_name' })
  public firstName: string;

  @Column({ nullable: true, name: 'last_name' })
  public lastName: string;

  @Column({ nullable: true, name: 'phone_number' })
  public phoneNumber: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;
}

export default User;
