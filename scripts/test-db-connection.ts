import 'dotenv/config';
import { sql } from '../app/db/config';

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');

    // Simple query to test connection
    const result = await sql`SELECT version()`;

    console.log('✅ Database connection successful!');
    console.log('📊 Database version:', result[0].version);

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
