module.exports = (sequelize, DataTypes) => {
  const WerkerCertification = sequelize.define('WerkerCertification', {
    url_Photo: DataTypes.STRING,
  });

  WerkerCertification.associate = (models) => {
    models.Certification.belongsTo(models.Certification);
    models.Certification.belongsTo(models.Werker);
  };
  return WerkerCertification;
};
