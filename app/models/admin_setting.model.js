module.exports = (sequelize, Sequelize) => {
  const Admin_setting = sequelize.define(
    "admin_setting",
    {
      requirements: {
        type: Sequelize.TEXT('long'),
        validate: {
          notEmpty: true,
        },
      },
      privacy_policy: {
        type: Sequelize.TEXT('long'),
        validate: {
          notEmpty: true,
        },
      },
      terms_and_conditions: {
        type: Sequelize.TEXT('long'),
        validate: {
          notEmpty: true,
        },
      },
      
      is_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
        comment: "0 = false, 1 = true",
      },
      is_testdata: {
        type: Sequelize.BOOLEAN,
        defaultValue: "1",
        comment: "0 = false, 1 = true",
      },
    },
    { freezeTableName: true, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" },
  );

  return Admin_setting;
};
