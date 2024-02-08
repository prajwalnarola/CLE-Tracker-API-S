module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define(
    "setting",
    {
      type: {
        type: Sequelize.ENUM,
        values: [
          "Requirements",
          "Resources",
          "Privacy policy",
          "Terms & conditions",
          "FAQs"
        ],
      },
      key: {
        type: Sequelize.TEXT('long'),
        validate: {
          notEmpty: true,
        },
      },
      value: {
        type: Sequelize.TEXT('long'),
        validate: {
          notEmpty: true,
        },
      },
      tooltip: {
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

  return Setting;
};
