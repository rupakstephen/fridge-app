import { PRODUCE_EXPIRATION } from '../constants/produceExpiration';

export const categorizeItem = (itemName) => {
  const name = itemName.toLowerCase();
  
  // Produce
  for (const produce of Object.keys(PRODUCE_EXPIRATION)) {
    if (name.includes(produce)) return 'fridge';
  }
  
  // Dairy products
  if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
      name.includes('butter') || name.includes('cream') || name.includes('dairy')) {
    return 'fridge';
  }
  
  // Meat/Protein
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
      name.includes('fish') || name.includes('meat') || name.includes('salmon') ||
      name.includes('turkey') || name.includes('bacon')) {
    return 'fridge';
  }
  
  // Eggs
  if (name.includes('egg')) return 'fridge';
  
  // Default to pantry
  return 'pantry';
};