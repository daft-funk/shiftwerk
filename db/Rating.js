module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: DataTypes.NUMERIC,
    type: DataTypes.STRING,
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Werker);
    Rating.belongsTo(models.Shift);
  };
  return Rating;
};
