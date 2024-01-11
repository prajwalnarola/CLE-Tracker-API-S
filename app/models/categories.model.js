module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define(
    "categories",
    {
      cle_name: {
        type: Sequelize.ENUM,
        values: [
          "Management General",
          "Skills",
          "Ethics/Professionalism",
          "Law Practice",
        ],
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

  return Categories;
};
