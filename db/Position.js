module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    position: { type: DataTypes.STRING, unique: true, allowNull: false },
  });

  Position.associate = (models) => {
    Position.belongsToMany(models.Werker, {
      through: 'WerkerPosition',
    });
    Position.belongsToMany(models.Shift, {
      through: models.ShiftPosition,
    });
  };
  return Position;
};
