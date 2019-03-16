module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    name: DataTypes.STRING,
    time_date: DataTypes.DATE,
    duration: DataTypes.NUMERIC,
    lat: DataTypes.NUMERIC,
    long: DataTypes.NUMERIC,
    description: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    cache_rating: DataTypes.NUMERIC,
  });

  Shift.associate = (models) => {
    Shift.belongsTo(models.Maker);
    Shift.belongsToMany(models.Werker, {
      through: 'WerkerShift',
    });
    Shift.belongsToMany(models.PaymentType, {
      through: 'ShiftPaymentType',
    });
    Shift.belongsToMany(models.Position, {
      through: models.ShiftPosition,
    });
  };
  return Shift;
};
