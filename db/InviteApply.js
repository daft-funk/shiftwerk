module.exports = (sequelize, DataTypes) => {
  const InviteApply = sequelize.define('InviteApply', {
    status: DataTypes.STRING,
    expiration: DataTypes.DATE,
    type: DataTypes.STRING,
  });

  InviteApply.associate = (models) => {
    InviteApply.belongsTo(models.Shift);
    InviteApply.belongsTo(models.Werker);
    InviteApply.belongsTo(models.Position);
  };
  return InviteApply;
};
