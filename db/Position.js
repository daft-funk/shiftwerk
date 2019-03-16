module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    position: DataTypes.STRING,
  });

  Position.associate = (models) => {
    Position.belongsToMany(models.Werker, {
      through: 'WerkerPosition',
    });
    Position.belongsToMany(models.Shift, {
      through: 'ShiftPosition',
    });
  };
  return Position;
};
