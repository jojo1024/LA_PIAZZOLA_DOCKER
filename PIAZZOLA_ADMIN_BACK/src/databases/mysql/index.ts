import { MysqlError, OkPacket } from "mysql";


const db = require("./mysqlDB");
const selectCmd = db.query.bind(db)
const execCmd = db.query.bind(db)

export const _executeSql = (sql: string, param: any) => {
  return new Promise((resolve, reject) => {
    try {
      execCmd(
        sql,
        param,
        function (this: any, error: any, result: OkPacket) {
          if (error) {

            return reject(error);
          }
          resolve(
            result === undefined ? { affectedRows: this.changes, lastID: this.lastID } : result
          );
        }
      );
    } catch (err) {
      console.log("🚀 ~ file: index.ts ~ line 26 ~ returnnewPromise ~ err", err)

      reject(err);
    }
  });
};

export const _selectSql: any = (sql: string, param: (string | number)[]) => {
  return new Promise((resolve, reject) => {
    try {
      selectCmd(sql, param, (error: any, rows: any) => {
        if (error) return reject(error);
        resolve(rows);
      });
    } catch (err) {
      //    Logger.error(err);
      reject(err);
    }
  });
};

export default db;
