import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export abstract class DatabaseSource {
  @InjectDataSource()
  protected dataSource: DataSource;

  // async transaction(
  //   repository: Repository<Booking | User | Cost>,
  //   method: string,
  //   arg: any,
  // ) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   try {
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();
  //     if (method === 'findOne') {
  //       repository.findOneBy(arg);
  //     } else if (method === 'findAll') {
  //     }
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     console.log(error);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async transaction(callback, isSave: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const result = await callback();
      console.log(result);
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
