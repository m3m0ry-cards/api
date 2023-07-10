import { Table, Model, Column, DataType } from 'sequelize-typescript';

interface TokenCreationAttrs {
  userId: number;
  refreshToken: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({ type: DataType.INTEGER, unique: true })
  userId: number;
  @Column({ type: DataType.STRING })
  refreshToken: string;
}
