import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class DatabaseSource {
  @InjectDataSource()
  protected dataSource: DataSource;

  async transaction(callback, isSave: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const result = await callback();
      if (isSave) {
        await queryRunner.manager.save(result);
      }
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }
}
