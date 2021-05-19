import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export default class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  devicename: string;

  @Column()
  user_id: number;

  @Column()
  devicecode: string;

  @Column("datetime")
  createdAt: Date;

  @Column()
  workee: number;

  @Column()
  approved: number;

  toJSON() {
    return {
      devicename: this.devicename,
      devicecode: this.devicecode,
      approved: this.approved,
      workee: this.workee,
    };
  }
}
