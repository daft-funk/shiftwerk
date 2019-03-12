module.exports = (sequelize, DataTypes) => {
  const Werker = sequelize.define('Werker', {
    name_first: DataTypes.STRING,
    name_last: DataTypes.STRING,
    email: DataTypes.STRING,
    url_photo: DataTypes.STRING,
    bio: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    last_minute: DataTypes.BOOL,
    lat: DataTypes.NUMERIC,
    long: DataTypes.NUMERIC,
  });
  return Werker;
};
