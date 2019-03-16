module.exports = (sequelize, DataTypes) => {
  const PaymentType = sequelize.define('PaymentType', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  });

  PaymentType.associate = (models) => {
    PaymentType.belongsToMany(models.Shift, {
      through: 'ShiftPaymentType',
    });
  };
  return PaymentType;
};
