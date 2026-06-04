import { db } from './index';
import { lifestyleGoals, routineCategories, plans } from './schema';
import { logger } from '../services/logger.service';

async function seed() {
  logger.info('🌱 Seeding database...');
  
  try {
    // 1. Lifestyle Goals
    const goalsData = [
      { name: 'Tidur lebih teratur', sortOrder: 1 },
      { name: 'Skincare lebih konsisten', sortOrder: 2 },
      { name: 'Pagi lebih tenang', sortOrder: 3 },
      { name: 'Kurangi overwhelmed', sortOrder: 4 },
      { name: 'Lebih rutin bergerak', sortOrder: 5 },
      { name: 'Punya waktu untuk diri sendiri', sortOrder: 6 },
    ];
    
    await db.insert(lifestyleGoals).values(goalsData).onConflictDoNothing({ target: lifestyleGoals.name });
    logger.info('✅ Lifestyle goals seeded successfully.');

    // 2. Routine Categories
    const categoriesData = [
      { name: 'Morning', sortOrder: 1 },
      { name: 'Night', sortOrder: 2 },
      { name: 'Skincare', sortOrder: 3 },
      { name: 'Wellness', sortOrder: 4 },
      { name: 'Fitness', sortOrder: 5 },
      { name: 'Haircare', sortOrder: 6 },
      { name: 'Mindfulness', sortOrder: 7 },
      { name: 'Cycle Care', sortOrder: 8 },
    ];
    
    await db.insert(routineCategories).values(categoriesData).onConflictDoNothing({ target: routineCategories.name });
    logger.info('✅ Routine categories seeded successfully.');

    // 3. Plans
    const plansData = [
      { name: 'Free', maxRoutines: 3, features: { reflection: 'basic', themes: 'standard' } },
      { name: 'Premium Monthly', maxRoutines: 9999, features: { reflection: 'advanced', themes: 'premium', widgets: true } },
      { name: 'Premium Yearly', maxRoutines: 9999, features: { reflection: 'advanced', themes: 'premium', widgets: true } },
    ];
    
    await db.insert(plans).values(plansData).onConflictDoNothing({ target: plans.name });
    logger.info('✅ Plans seeded successfully.');

    logger.info('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
