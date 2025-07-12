// models/bank_doc.js

module.exports = (sequelize, DataTypes) => {
  const BankDoc = sequelize.define('BankDoc', {
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    cancel_cheque_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signature_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return BankDoc;
};
