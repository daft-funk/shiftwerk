const models = require('./index');

module.exports = (sequelize, DataTypes) => {
  const WerkerCertification = sequelize.define('WerkerCertification', {
    url_Photo: DataTypes.STRING,
  });

  WerkerCertification.associate = (models) => {
    models.Certification.belongsTo(models.Certification, {
      foreignKey: 'CertificationId',
    });
    models.Certification.belongsTo(models.Werker, {
      foreignKey: 'WerkerId',
    });
  };
  return WerkerCertification;
};
