module.exports = (sequelize, DataTypes) => {
  const WerkerCertification = sequelize.define('WerkerCertification', {
    url_Photo: { type: DataTypes.STRING, allowNull: false },
  });

  WerkerCertification.associate = (models) => {
    models.Certification.belongsTo(models.Certification);
    models.Certification.belongsTo(models.Werker);
  };
  return WerkerCertification;
};
