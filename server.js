// D:\zestfindz\server.js

const app = require('./app');
const sequelize = require('./src/config/db');

// ✅ Import Models
require('./src/models/Role'); // Register Role model

// ✅ Import Middleware (for global registration if needed)
require('./src/middleware/roleMiddleware'); // <-- Only imported, not applied globally

const PORT = 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);

    try {
        await sequelize.sync();
        console.log('✅ Database synced successfully');
    } catch (error) {
        console.error('❌ Database sync failed:', error);
    }
});
