const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const {
  sequelize,
  User
} = require("./models");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const bookRoute = require("./routes/bookRoute");
const pageRoute = require("./routes/pageRoute");
const favoriteRoute = require("./routes/favoriteRoute");
const recentlyViewedRoute = require("./routes/recentlyViewedRoute");
const reviewRoute = require("./routes/reviewRoute");
const setupSwagger = require("./swagger/swagger");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", bookRoute);
app.use("/api", pageRoute);
app.use("/api", favoriteRoute);
app.use("/api", recentlyViewedRoute);
app.use("/api", reviewRoute);
setupSwagger(app);
const PORT = process.env.PORT || 3000;
async function bootstrapAdmin() {
  const existingAdmin = await User.findOne({
    where: {
      role: "admin"
    }
  });
  if (existingAdmin) return;
  const email = process.env.ADMIN_EMAIL || "mainadmin@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  await User.create({
    name: "Admin",
    email,
    password,
    role: "admin"
  });
  console.log("─────────────────────────────────────────────");
  console.log(" First-run admin account created:");
  console.log(`   email:    ${email}`);
  console.log(`   password: ${password}`);
  console.log(" Log in, then change it under Admin > Account.");
  console.log("─────────────────────────────────────────────");
}
sequelize.sync().then(async () => {
  await bootstrapAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
