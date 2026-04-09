import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SupabaseService } from '../supabase/supabase.service';
import { createHash, randomBytes } from 'crypto';

async function bootstrap() {
  const args = process.argv.slice(2);
  const projectName = args[0];
  const type = args[1] === '--test' ? 'test' : 'live';

  if (!projectName) {
    console.error('Usage: pnpm ts-node src/scripts/create-project.ts "Project Name" [--test]');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const supabaseService = app.get(SupabaseService);
  const supabase = supabaseService.getClient();

  try {
    // 1. Generate a random secure key
    const randomPart = randomBytes(24).toString('base64url');
    const prefix = `ak_${type}`;
    const rawKey = `${prefix}_${randomPart}`;

    // 2. Hash the key for database storage
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    // 3. Save to Supabase (assuming the table exists)
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name: projectName,
          key_hash: keyHash,
          prefix: prefix,
          is_active: true,
        },
      ])
      .select();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    console.log('\n--- Project Created Successfully ---');
    console.log(`Project Name: ${projectName}`);
    console.log(`Prefix:       ${prefix}`);
    console.log('------------------------------------');
    console.log('IMPORTANT: Copy the following API Key. It will NOT be shown again!');
    console.log(`\nAPI KEY: ${rawKey}\n`);
    console.log('------------------------------------');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
