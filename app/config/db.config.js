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
db.cleTracker = require("../models/cle_tracker.model")(sequelize, Sequelize);
db.categories = require("../models/categories.model")(sequelize, Sequelize);
db.documents = require("../models/documents.model")(sequelize, Sequelize);
db.credits = require("../models/credits.model")(sequelize, Sequelize);
db.details = require("../models/details.model")(sequelize, Sequelize);
db.setting = require("../models/setting.model")(sequelize, Sequelize);

// has RELATIONS (HasMany / HasOne)
db.user.hasOne(db.deviceToken, { as: "devicetoken", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.cleTracker, { as: "cleTracker", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.categories.hasOne(db.cleTracker, { as: "cleTracker", foreignKey: "category_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.cleTracker.hasMany(db.documents, { as: "documents", foreignKey: "cle_tracker_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.cleTracker.hasMany(db.credits, { as: "credits", foreignKey: "cle_tracker_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.details, { as: "details", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

// belongsTO RELATION (BelongsTo / BelongsToMany)(foreign-key)
db.deviceToken.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.cleTracker.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.cleTracker.belongsTo(db.categories, { as: "categories", foreignKey: "category_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.documents.belongsTo(db.cleTracker, { as: "cleTracker", foreignKey: "cle_tracker_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.credits.belongsTo(db.cleTracker, { as: "cleTracker", foreignKey: "cle_tracker_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.details.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

module.exports = db