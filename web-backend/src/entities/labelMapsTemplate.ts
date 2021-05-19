import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export default class LabelMapsTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label_id: number;

  @Column()
  template_id: string;
}
