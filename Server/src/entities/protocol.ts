import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export default class Protocol extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  archived: number;

  @Column("json")
  value: JSON;

  toJSON() {
    return {
      id: this.id,
      archived: this.archived === 1,
      protocol: this.value,
    };
  }
}
