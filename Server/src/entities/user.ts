import {
  Entity,
  Column,
  Timestamp,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column("timestamp")
  signints: Timestamp;

  @Column()
  password: string;

  @Column()
  email: string;

  toJSON = () => {
    return {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
    };
  };
}
