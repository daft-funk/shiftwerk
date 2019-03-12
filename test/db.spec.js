const SequelizeMock = require('sequelize-mock');

const sequelize = new SequelizeMock();
const Werker = require('../db/Werker')(sequelize, SequelizeMock); // ugly hack to get DataTypes
// const Certification = require('../db/Certification')(sequelize, SequelizeMock);
// const WerkerCertification = require('../db/WerkerCertification')(sequelize, SequelizeMock);
// const Shift = require('../db/Shift')(sequelize, SequelizeMock);
// const WerkerShift = require('../db/WerkerShift')(sequelize, SequelizeMock);
// const Position = require('../db/Position')(sequelize, SequelizeMock);
// const ShiftPosition = require('../db/ShiftPosition')(sequelize, SequelizeMock);
// const WerkerPosition = require('../db/WerkerPosition')(sequelize, SequelizeMock);
// const PaymentType = require('../db/PaymentType')(sequelize, SequelizeMock);
// const ShiftPaymentType = require('../db/ShiftPaymentType')(sequelize, SequelizeMock);
// const Rating = require('../db/Rating')(sequelize, SequelizeMock);
// const Favorite = require('../db/Favorite')(sequelize, SequelizeMock);
// const InviteApply = require('../db/InviteApply')(sequelize, SequelizeMock);
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

const exampleMaker = {
  
};

describe('Werker', () => {
  let werker;
  beforeAll(async () => {
    const newWerker = await Werker.create(exampleWorker);
    werker = newWerker;
    return werker;
  });

  describe('props', () => {
    Object.keys(exampleWorker).forEach((prop) => {
      test(`should have property ${prop}`, async () => {
        expect(werker).toHaveProperty(prop, exampleWorker[prop]);
      });
    });
  });

  xdescribe('instance methods', () => {
    [
      'getFullName',
      'setAverageRating',
    ].forEach((method) => {
      test(`should have a method ${method}`, () => {
        expect(werker[method]).toBeInstanceOf(Function);
      });
    });
    describe('getFullName', () => {
      test('should return the first and last name of the werker separated by a space', () => {
        expect(werker.getFullName()).toBe('user mcExample');
      });
    });
    describe('setAverageRating', () => {
      // relies on Rating model existing
      beforeAll(async () => {
        jest.spyOn(Rating.sum);
        await werker.setAverageRating();
      });

      afterAll(() => {
        Rating.sum.mockReset();
      });

      test('should sum all of werker\'s ratings', () => {
        expect(Rating.sum).toHaveBeenCalledWith('rating', {
          where: { werkerId: werker.id },
        });
      });

      test('for a werker with no ratings, should not set rating', () => {
        expect(werker.ratings).toBeNull();
      });

      test('for a werker with ratings, should calculate the average rating, setting the netRating prop on the werker', async () => {
        await Promise.all([4, 5, 5, 3]
          .map(rating => Rating.create({ werkerId: werker.id, shiftId: 0, rating })));
        await werker.setAverageRating();
        expect(werker.rating).toBe(3.75);
      });
    });
  });
  xdescribe('associations', () => {

  });
});
