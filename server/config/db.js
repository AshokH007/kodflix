const { Sequelize } = require('sequelize');
require('dotenv').config();

// SSL configuration for Aiven
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // This bypasses the self-signed certificate check
        }
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ KODFLIX connected to Aiven PostgreSQL');
    } catch (error) {
        console.error('❌ PostgreSQL connection error:', error);
        // Log more detail if available
        if (error.original) {
            console.error('Original error:', error.original);
        }
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
