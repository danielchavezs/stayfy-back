require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_URL } = process.env;

const defineBooks = require ('./models/Book'); 

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
 logging: false, 
 native: false, 
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection with database has been established successfully.');
    // console.log(VAR_2)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });


modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

defineBooks(sequelize); 

const { Book } = sequelize.models; 
const { User } = sequelize.models;
const { Order } = sequelize.models;
const { Review } = sequelize.models;

 Order.belongsToMany(User, {through: 'User_Order'});    // PENDIENTES DE AJUSTAR SI USAMOS MÁS DE UN MODELO 
 User.belongsToMany(Order, {through: 'User_Order'});    // PENDIENTES DE AJUSTAR SI USAMOS MÁS DE UN MODELO 
 Review.belongsTo(User, { foreignKey: "userId" });
 Review.belongsTo(Book, { foreignKey: "bookId" });


const createDefaultAdminUser = async () => {
  const [user, created] = await User.findOrCreate({
    where: { username: 'admin' },
    defaults: {
      email: 'admin@stafy.com',
      passwordHash: 'administrador',
      fullName: 'Admin User',
      isAdmin: true,
      isSuperAdmin: true,
    },
  });

  if (created) {
    console.log('Usuario administrador por defecto creado.');
  } else {
    console.log('El usuario administrador ya existe.');
  }
};

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
  createDefaultAdminUser,
  User
};


