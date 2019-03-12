const SequelizeMock = require('sequelize-mock');

const sequelize = new SequelizeMock();

const Werker = require('../db/Werker')(sequelize, SequelizeMock); // ugly hack to get DataTypes
const Maker = require('../db/Maker')(sequelize, SequelizeMock);
const Certification = require('../db/Certification')(sequelize, SequelizeMock);
const WerkerCertification = require('../db/WerkerCertification')(sequelize, SequelizeMock);
const Shift = require('../db/Shift')(sequelize, SequelizeMock);
const WerkerShift = require('../db/WerkerShift')(sequelize, SequelizeMock);
const Position = require('../db/Position')(sequelize, SequelizeMock);
const ShiftPosition = require('../db/ShiftPosition')(sequelize, SequelizeMock);
const WerkerPosition = require('../db/WerkerPosition')(sequelize, SequelizeMock);
const PaymentType = require('../db/PaymentType')(sequelize, SequelizeMock);
const ShiftPaymentType = require('../db/ShiftPaymentType')(sequelize, SequelizeMock);
const Rating = require('../db/Rating')(sequelize, SequelizeMock);
const Favorite = require('../db/Favorite')(sequelize, SequelizeMock);
const InviteApply = require('../db/InviteApply')(sequelize, SequelizeMock);

const examples = {
  Werker: {
    nameFirst: 'user',
    nameLast: 'mcExample',
    email: 'example@example.com',
    urlPhoto: 'example.com/image',
    bio: 'example bio',
    phone: 5555555555,
    lastMinute: true,
    lat: 40.1,
    long: 40.2,
  },

  Maker: {
    name: 'jonny restaurant',
    urlPhoto: 'example.com/image',
    phone: 5555555555,
    email: 'example@example.com',
  },

  Shift: {
    name: 'catering example',
    timeDate: new Date(),
    duration: 300,
    address: '1234 example st',
    lat: 40.2,
    long: 40.1,
    paymentAmount: 5,
    description: 'example event',
  },

  Certification: {
    certName: 'safeserv',
  },

  Position: {
    position: 'example',
  },

  PaymentType: {
    paymentName: 'dead leaves',
  },
};

describe('Werker', () => {
  let werker;
  beforeAll(async () => {
    const newWerker = await Werker.create(examples.Werker);
    werker = newWerker;
    return werker;
  });

  describe('props', () => {
    Object.keys(examples.Werker).forEach((prop) => {
      test(`should have property ${prop}`, async () => {
        expect(werker).toHaveProperty(prop, examples.Werker[prop]);
      });
    });
  });

  describe.skip('instance methods', () => {
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
  describe.skip('associations', () => {
    [
      [Certification, { through: WerkerCertification }],
      [Shift, { through: Rating }],
      [Maker, { through: Favorite }],
      [Shift, { through: WerkerShift }],
      [Position, { through: WerkerPosition }],
      [Shift, { through: InviteApply }],
    ].forEach((association) => {
      test(`should have a belongsToMany association with ${association[0]} through ${association[1].through}`, () => {
        expect(Werker.belongsToMany).toHaveBeenCalledWith(...association);
      });
    });
  });
});

describe.skip('Maker', () => {
  let maker;
  beforeAll(async () => {
    const newMaker = await Maker.create(examples.Maker);
    maker = newMaker;
    return maker;
  });
  describe('props', () => {
    Object.keys(examples.Maker).forEach((prop) => {
      test(`should have property ${prop}`, async () => {
        expect(maker).toHaveProperty(prop, examples.Maker[prop]);
      });
    });
  });

  describe.skip('instance methods', () => {
    describe('setAverageRating', () => {
      // relies on Rating model existing
      beforeAll(async () => {
        jest.spyOn(Rating.sum);
        await maker.setAverageRating();
      });

      afterAll(() => {
        Rating.sum.mockReset();
      });

      test('should sum all of maker\'s ratings', () => {
        expect(Rating.sum).toHaveBeenCalledWith('rating', {
          where: { makerId: maker.id },
        });
      });

      test('for a maker with no ratings, should not set rating', () => {
        expect(maker.ratings).toBeNull();
      });

      test('for a maker with ratings, should calculate the average rating, setting the netRating prop on the maker', async () => {
        await Promise.all([4, 5, 5, 3]
          .map(rating => Rating.create({ makerId: maker.id, shiftId: 0, rating })));
        await maker.setAverageRating();
        expect(maker.rating).toBe(3.75);
      });
    });
  });

  describe.skip('associations', () => {
    test('should have a belongsToMany association with Werker through Favorites', () => {
      expect(Maker.belongsToMany).toHaveBeenCalledWith(Werker, { through: Favorites });
    });
    test('should have a hasMany association with Shift', () => {
      expect(Maker.hasMany).toHaveBeenCalledWith(Shift);
    });
  });
});

describe.skip('Shift', () => {
  let shift;
  beforeAll(async () => {
    const newShift = await Shift.create(examples.Shift);
    shift = newShift;
    return shift;
  });

  describe('props', () => {
    Object.keys(examples.Shift).forEach((prop) => {
      test(`should have property ${prop}`, async () => {
        expect(shift).toHaveProperty(prop, examples.Shift[prop]);
      });
    });
  });

  describe.skip('associations', () => {
    [
      [Werker, { through: Rating }],
      [PaymentType, { through: ShiftPaymentType }],
      [Werker, { through: WerkerShift }],
      [Position, { through: ShiftPosition }],
      [Werker, { through: InviteApply }],
    ].forEach((association) => {
      test(`should have a belongsToMany association with ${association[0]} through ${association[1].through}`, () => {
        expect(Shift.belongsToMany).toHaveBeenCalledWith(...association);
      });
    });
    test('should have a hasOne relationship with Maker', () => {
      expect(Shift.hasOne).toHaveBeenCalledWith(Maker);
    });
  });
});

[Certification, Position, PaymentType].forEach((model) => {
  describe.skip(`${model}`, () => {
    let instance;
    beforeAll(async () => {
      const newInstance = await model.create(examples[model.name]); // idk if this works
      instance = newInstance;
      return instance;
    });

    describe('props', () => {
      Object.keys(examples[model.name]).forEach((prop) => {
        test(`should have property ${prop}`, async () => {
          expect(instance).toHaveProperty(prop, examples[model.name][prop]);
        });
      });
    });
  });
});
