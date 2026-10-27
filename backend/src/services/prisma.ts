import dotenv from 'dotenv';
import path from 'path';
import ws from 'ws';

// Explicitly load .env from backend root and .env.local from project root if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config();

import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment');
}

let prisma: PrismaClient;

if (connectionString.includes('neon.tech')) {
  neonConfig.webSocketConstructor = ws;
  const adapter = new PrismaNeon({ connectionString });
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient();
}

export default prisma;
