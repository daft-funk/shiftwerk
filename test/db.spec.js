const SequelizeMock = require('sequelize-mock');

const sequelize = new SequelizeMock();
const Werker = require('../db/Werker')(sequelize);
// const Certification = require('../db/Certification')(sequelize);
// const Shift = require('../db/Shift')(sequelize);
// const Position = require('../db/Position')(sequelize);
// const PaymentType = require('../db/PaymentType')(sequelize);

/*
 * testInstanceProps
 * takes a sequelize model instance and tests for the existence of each expected property
 * @params
 *  modelProps: Object
 *  modelInstance: Sequelize.model instance
 * @return undefined
 */

const testInstanceProps = (modelProps, modelInstance) => {
  Object.keys(modelProps).forEach((prop) => {
    test(`should have property ${prop}`, async () => {
      expect(modelInstance).toHaveProperty(prop, modelProps[prop]);
    });
  });
};

/*
 * testInstanceMethod
 * ensures proper operation of a sequelize model's custom methods
 * @params
 *  options: Object
 *    expectedMethodsCalled: Array[String]
 *
 */

// const testInstanceMethod = (options, modelInstance) => {

// }

describe('Werker', () => {
  const exampleWorker = {
    name_first: 'barry',
    name_last: 'blue-jeans',
    email: 'example@example.com',
    url_photo: 'example.com/image',
    bio: 'example bio',
    phone: 5555555555,
    last_minute: true,
    lat: 40.1,
    long: 40.2,
  };
  let barry;
  before(async () => {
    barry = await Werker.create(exampleWorker);
  });
  testInstanceProps(exampleWorker, barry);
});
