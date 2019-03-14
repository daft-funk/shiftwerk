module.exports = (sequelize, DataTypes) => {
  const Maker = sequelize.define('Maker', {

    name: DataTypes.STRING,
    url_photo: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    cache_rating: DataTypes.NUMERIC,
  });

  return Maker;
};
