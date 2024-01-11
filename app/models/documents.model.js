module.exports = (sequelize, Sequelize) => {
    const Documents = sequelize.define(
      "documents",
      {
        cle_tracker_id: {
          type: Sequelize.INTEGER,
          validate: {
            notEmpty: true
          },
        },
        document: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
            isAlphanumeric: true,
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
  
    return Documents;
  };
  