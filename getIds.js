import dotenv from 'dotenv';
import sequelize from './server/config/database.js';

dotenv.config();

async function getIds() {
  try {
    await sequelize.authenticate();

    const [geofences] = await sequelize.query('SELECT id, name FROM geofences LIMIT 1');
    const [vehicles] = await sequelize.query('SELECT id, name FROM vehicles LIMIT 1');
    const [hubs] = await sequelize.query('SELECT id, name FROM hubs LIMIT 1');
    const [teams] = await sequelize.query('SELECT id, name FROM teams LIMIT 1');
    const [stores] = await sequelize.query('SELECT id, name FROM stores LIMIT 1');
    const [drivers] = await sequelize.query('SELECT id, name FROM drivers LIMIT 1');

    console.log('REAL IDS FOR API TESTER:');
    console.log('========================');
    console.log(`Geofence: ${geofences[0]?.id} (${geofences[0]?.name})`);
    console.log(`Vehicle: ${vehicles[0]?.id} (${vehicles[0]?.name})`);
    console.log(`Hub: ${hubs[0]?.id} (${hubs[0]?.name})`);
    console.log(`Team: ${teams[0]?.id} (${teams[0]?.name})`);
    console.log(`Store: ${stores[0]?.id} (${stores[0]?.name})`);
    console.log(`Driver: ${drivers[0]?.id} (${drivers[0]?.name})`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getIds();
