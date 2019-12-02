const Sequelize = require('sequelize').Sequelize;
const path = require('path');
const fs = require('fs');
const config = require('../config')();

const sequelize = new Sequelize(config.db_name, config.db_user, config.db_pass, {
    dialect: 'postgres',
    host: config.db_host,
    port: config.db_port,
    logging: false
});

const db = {};
const currentFile = path.basename(__filename);

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== currentFile) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

    db.Category.hasMany(db.Product, { as: 'Products', foreignKey: 'category' });
sequelize.sync()
    .catch((err) => console.error('[SEQUELIZE]:\n', err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;