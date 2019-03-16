module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: { type: DataTypes.NUMERIC, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Werker);
    Rating.belongsTo(models.Shift);
  };
  return Rating;
};
