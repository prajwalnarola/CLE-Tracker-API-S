module.exports = (sequelize, Sequelize) => {
  const Credits = sequelize.define(
    "credits",
    {
      cle_tracker_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      creditsEarned: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      requiredCredits: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      required_date: {
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
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Credits;
};
