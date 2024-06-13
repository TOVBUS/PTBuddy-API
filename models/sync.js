const { sequelize } = require('./index');

const sync = () => {
  sequelize
    .sync({ alter: true })
    .then(() => console.log('데이터베이스 생성완료'))
    .catch((error) => {
      console.log(error);
    });
};

sync();
