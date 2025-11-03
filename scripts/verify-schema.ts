import 'dotenv/config';
import { sql } from '../app/db/config';

async function verifySchema() {
  try {
    console.log('🔍 Verifying database schema...\n');

    // Check tables
    console.log('📋 Tables:');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    tables.forEach((row: any) => {
      console.log(`   ✅ ${row.table_name}`);
    });

    // Check enums
    console.log('\n🎨 Enums:');
    const enums = await sql`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e'
      ORDER BY typname;
    `;
    enums.forEach((row: any) => {
      console.log(`   ✅ ${row.typname}`);
    });

    console.log('\n📊 Summary:');
    console.log(`   Tables: ${tables.length}`);
    console.log(`   Enums: ${enums.length}`);
    console.log('\n✅ Database schema verification complete!');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying schema:');
    console.error(error);
    process.exit(1);
  }
}

verifySchema();
