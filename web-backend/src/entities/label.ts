import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export default class Label extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  details: string;

  @Column()
  user_id: number;

  @Column()
  color: string;

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      details: this.details,
      color: this.color,
    };
  }
}
