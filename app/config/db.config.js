require("dotenv").config();
const Sequelize = require("sequelize");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = ""

const sequelize = new Sequelize(dbName, dbUser, dbPassword,{
    port: process.env.PORT,
    host: process.env.DB_HOST,
    dialect: "mysql"
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model")(sequelize, Sequelize);
db.deviceToken = require("../models/device_token.model")(sequelize, Sequelize);

// has RELATIONS (HasMany / HasOne)
db.user.hasOne(db.deviceToken, { as: "devicetoken", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

// belongsTO RELATION (BelongsTo / BelongsToMany)(foreign-key)
db.deviceToken.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

module.exports = db