import { COUNTRIES } from '@/data/countries';

import { db } from '../';
import { countries } from '../schemas/countries';

export async function run() {
  await db.insert(countries).values(COUNTRIES);
}
