const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      profile: {
        type: Sequelize.STRING,
      },
      first_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isAlphanumeric: true,
        },
      },
      middle_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isAlphanumeric: true,
        },
      },
      last_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isAlphanumeric: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      date_of_birth: {
        type: Sequelize.DATE,
        validate: {
          notEmpty: true,
        },
      },
      // attorny_registration_number: {
      //   type: Sequelize.STRING,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
      // new_york_state_admission_date: {
      //   type: Sequelize.DATE,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
      // department_of_admission: {
      //   type: Sequelize.STRING,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
      password: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      // is_experienced: {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: "0",
      //   comment: "0 = false, 1 = true",
      // },
      // required_credits: {
      //   type: Sequelize.INTEGER,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
      // required_date: {
      //   type: Sequelize.DATE,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
      uuid: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      device_token: {
        type: Sequelize.STRING,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
        comment: "0 = false, 1 = true",
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

  User.beforeCreate((user, options) => {
    user.uuid = uuidv4();
    user.password = bcrypt.hashSync(user.password, saltRounds);
  });

  return User;
};
