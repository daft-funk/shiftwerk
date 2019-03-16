module.exports = (sequelize, DataTypes) => {
  const Certification = sequelize.define('Certification', {
    cert_name: { type: DataTypes.STRING, unique: true, allowNull: false },
  });

  Certification.associate = (models) => {
    Certification.belongsToMany(models.Werker, {
      through: 'WerkerCertification',
    });
  };
  return Certification;
};
