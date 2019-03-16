module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    fav: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.Werker);
    Favorite.belongsTo(models.Maker);
  };
  return Favorite;
};
