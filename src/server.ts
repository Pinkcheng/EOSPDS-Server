import app from './app';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

import { Initialize } from './model/Initialize.model';

createConnection().then(() => {
  console.log('\n===================');
  console.log('\t資料庫連線成功！！');
  console.log('\n===================');

  console.log('\n\t*** 開始安裝系統預設資料 *** ');

  new Initialize().installDatabaseDefaultData()
    .then(() => {
      console.log('\n\t*** 全部安裝完成 ***');
      console.log('===================\n');

      /**
       * Start Express server.
       */
      app.listen(app.get('port'), () => {
        console.log(
          '  App is running at http://localhost:%d in %s mode',
          app.get('port'),
          app.get('env')
        );
        console.log('  Press CTRL-C to stop\n');
      });
    });

}).catch(error => console.log('TypeORM connection error: ', error));