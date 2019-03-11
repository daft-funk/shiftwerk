const SequelizeMock = require('sequelize-mock');

const sequelize = new SequelizeMock();
const Werker = require('../db/Werker')(sequelize, SequelizeMock);
// const Certification = require('../db/Certification')(sequelize);
// const Shift = require('../db/Shift')(sequelize);
// const Position = require('../db/Position')(sequelize);
// const PaymentType = require('../db/PaymentType')(sequelize);

describe('Werker', () => {
  const exampleWorker = {
    name_first: 'user',
    name_last: 'mcExample',
    email: 'example@example.com',
    url_photo: 'example.com/image',
    bio: 'example bio',
    phone: 5555555555,
    last_minute: true,
    lat: 40.1,
    long: 40.2,
  };
  let werker;
  beforeAll(async () => {
    const newWerker = await Werker.create(exampleWorker);
    werker = newWerker;
    return werker;
  });

  Object.keys(exampleWorker).forEach((prop) => {
    test(`should have property ${prop}`, async () => {
      expect(werker).toHaveProperty(prop, exampleWorker[prop]);
    });
  });
});
