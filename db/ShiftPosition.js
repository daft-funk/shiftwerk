module.exports = (sequelize, DataTypes) => {
  const ShiftPosition = sequelize.define('ShiftPosition', {
    payment_amnt: DataTypes.NUMERIC,
    filled: DataTypes.BOOLEAN,
  });

  ShiftPosition.associate = (models) => {
    ShiftPosition.belongsTo(models.Shift, {
      foreignKey: 'ShiftId',
    });
    ShiftPosition.belongsTo(models.Position, {
      foreignKey: 'PositionId',
    });
  };
  return ShiftPosition;
};
