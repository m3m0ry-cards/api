import { Table, Model, Column, DataType } from 'sequelize-typescript';

interface UserCreationAttrs {
  nickname: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({ type: DataType.STRING, defaultValue: 'Пользователь' })
  name: string;
  @Column({ type: DataType.STRING, unique: true })
  email: string;
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  nickname: string;
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
}
