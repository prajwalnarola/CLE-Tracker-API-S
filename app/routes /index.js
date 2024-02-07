// INPORT LIBRARY
const Router = require("express").Router();

// INPORT CHILD ROUTES AND ASSETS
const authMiddleware = require("../middlewares/auth");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const cleTrackerRoutes = require("./cle_tracker.routes");
const adminRoutes = require("./admin.routes");


// BIND ROUTES FROM DFFRENT FILE
Router.use("/auth/", authRoutes);
Router.use("/user", authMiddleware, userRoutes);
Router.use("/cle_tracker", authMiddleware, cleTrackerRoutes);
Router.use("/admin", authMiddleware, adminRoutes);

module.exports = Router;
