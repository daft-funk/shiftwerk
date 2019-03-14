module.exports = (sequelize, DataTypes) => {
  const Certification = sequelize.define('Certification', {
    cert_name: DataTypes.STRING,
  });

  Certification.associate = (models) => {
    Certification.belongsToMany(models.Werker, {
      through: 'WerkerCertification',
      foreignKey: 'CertificationId',
    });
  };
  return Certification;
};
