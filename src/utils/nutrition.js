import { NUTRITION_DATA } from '../constants/nutritionData';

export const getNutrition = (itemName) => {
  const name = itemName.toLowerCase();
  for (const [food, nutrition] of Object.entries(NUTRITION_DATA)) {
    if (name.includes(food)) {
      return nutrition;
    }
  }
  return null;
};