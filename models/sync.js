const { sequelize } = require('./index');

const sync = () => {
  sequelize
    .sync({ force: true, alter: true })
    .then(() => console.log('데이터베이스 생성완료'))
    .catch((error) => {
      console.log(error);
    });
};

// sync();

// const { sequelize } = require('./index');

// const sync = async () => {
//   try {
//     await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
//     await sequelize.sync({ force: true, alter: true });
//     await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
//     console.log('데이터베이스 생성완료');
//   } catch (error) {
//     console.log(error);
//   }
// };

// sync();
