const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const InviteApply = sequelize.define('InviteApply', {
    type: { type: DataTypes.ENUM('invite', 'apply'), allowNull: false },
    status: DataTypes.ENUM('accept', 'decline', 'pending'),
    expiration: { type: DataTypes.DATE, defaultValue: moment().add(1, 'days') },
  });

  InviteApply.associate = (models) => {
    InviteApply.belongsTo(models.Werker);
    InviteApply.hasOne(models.ShiftPosition);
  };
  return InviteApply;
};
