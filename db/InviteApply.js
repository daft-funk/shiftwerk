module.exports = (sequelize, DataTypes) => {
  const InviteApply = sequelize.define('InviteApply', {
    status: DataTypes.STRING,
    expiration: DataTypes.DATE,
    type: DataTypes.STRING,
  });

  InviteApply.associate = (models) => {
    InviteApply.belongsTo(models.Shift, {
      foreignKey: 'ShiftId',
    });
    InviteApply.belongsTo(models.Werker, {
      foreignKey: 'WerkerId',
    });
    InviteApply.belongsTo(models.Position, {
      foreignKey: 'PositionId',
    });
  };
  return InviteApply;
};
