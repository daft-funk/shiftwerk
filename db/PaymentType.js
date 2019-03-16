module.exports = (sequelize, DataTypes) => {
  const PaymentType = sequelize.define('PaymentType', {
    name: DataTypes.STRING,
  });

  PaymentType.associate = (models) => {
    PaymentType.belongsToMany(models.Shift, {
      through: 'ShiftPaymentType',
    });
  };
  return PaymentType;
};
