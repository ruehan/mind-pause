import 'dotenv/config';
import { sql } from '../app/db/config';
import { readFileSync } from 'fs';
import { join } from 'path';

async function applySchema() {
  try {
    console.log('🔄 Applying database schema...\n');

    // Read SQL file
    const sqlScript = readFileSync(join(process.cwd(), 'scripts/init-schema.sql'), 'utf-8');

    // Split by semicolon and filter empty statements
    const statements = sqlScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        await sql.unsafe(statement);

        // Extract table/enum name for better logging
        const match = statement.match(/CREATE\s+(TABLE|TYPE)\s+(\w+)/i);
        if (match) {
          console.log(`✅ Created ${match[1].toLowerCase()}: ${match[2]}`);
        } else if (statement.includes('CREATE INDEX') || statement.includes('CREATE UNIQUE INDEX')) {
          const indexMatch = statement.match(/INDEX\s+(\w+)/i);
          if (indexMatch) {
            console.log(`✅ Created index: ${indexMatch[1]}`);
          }
        }

        successCount++;
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.code === '42P07' || error.code === '42710') {
          const match = statement.match(/CREATE\s+(TABLE|TYPE)\s+(\w+)/i);
          if (match) {
            console.log(`⏭️  ${match[1]} ${match[2]} already exists, skipping...`);
          }
        } else {
          console.error(`❌ Error executing statement:`, error.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
          errorCount++;
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('\n🎉 Database schema applied successfully!');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error applying schema:');
    console.error(error);
    process.exit(1);
  }
}

applySchema();
