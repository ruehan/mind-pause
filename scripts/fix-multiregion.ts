import 'dotenv/config';
import { sql } from '../app/db/config';

async function fixMultiRegion() {
  try {
    console.log('🔄 Fixing multi-region configuration...');

    // Check current database regions
    console.log('\n📊 Checking current regions...');
    const regions = await sql`
      SELECT region FROM [SHOW REGIONS FROM DATABASE];
    `;
    console.log('Current regions:', regions);

    // Drop all regions
    if (regions.length > 0) {
      for (const row of regions) {
        console.log(`\n🗑️  Dropping region: ${row.region}`);
        try {
          await sql.unsafe(`ALTER DATABASE "mind-pause-db" DROP REGION "${row.region}"`);
          console.log(`✅ Dropped region: ${row.region}`);
        } catch (error: any) {
          console.log(`⚠️  Could not drop region ${row.region}:`, error.message);
        }
      }
    }

    console.log('\n✅ Multi-region configuration fixed!');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing multi-region:');
    console.error(error);
    process.exit(1);
  }
}

fixMultiRegion();
