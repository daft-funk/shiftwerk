module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    name: DataTypes.STRING,
    time_date: DataTypes.DATE,
    duration: DataTypes.NUMERIC,
    lat: DataTypes.NUMERIC,
    long: DataTypes.NUMERIC,
    description: DataTypes.STRING,
    cache_rating: DataTypes.NUMERIC,
  });

  Shift.associate = (models) => {
    Shift.belongsTo(models.Maker, {
      foreignKey: 'MakerId',
    });
    Shift.belongsToMany(models.Werker, {
      through: 'WerkerShift',
      foreignKey: 'ShiftId',
    });
    Shift.belongsToMany(models.PaymentType, {
      through: 'ShiftPaymentType',
      foreignKey: 'ShiftId',
    });
  };
  return Shift;
};
