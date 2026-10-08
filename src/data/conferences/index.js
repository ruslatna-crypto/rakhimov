import internationalConferences from './internationalConferences.json';
import infraR2000Conferences from './infraR2000.json';
import republicanConferences from './republicanConferences.json';

export {
  internationalConferences,
  infraR2000Conferences,
  republicanConferences
};

export const allConferences = [
  ...internationalConferences.map(c => ({ ...c, section: 'international' })),
  ...infraR2000Conferences.map(c => ({ ...c, section: 'infra2000' })),
  ...republicanConferences.map(c => ({ ...c, section: 'republican' }))
];
