module.exports = (sequelize, Sequelize) => {
  const Cle_Tracker = sequelize.define(
    "cle_tracker",
    {
      user_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true
        },
      },
      cle_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      cle_date: {
        type: Sequelize.DATE,
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

  return Cle_Tracker;
};
