export enum Page {
  Home = 'home',
  Scan = 'scan',
  Calculator = 'calculator',
  WalkingCalculator = 'walking_calculator',
  Recipe = 'recipe',
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface FoodAnalysisResult {
  dishName: string;
  description: string;
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  error?: string;
}

export interface CalorieCalculationResult {
  bmr: number;
  tdee: number;
  goalCalories: number;
  goalLabel: string;
}

export interface RecipeResult {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  error?: string;
}