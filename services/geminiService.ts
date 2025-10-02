
import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult, RecipeResult } from '../types';

const MODEL_NAME = "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const foodResponseSchema = {
  type: Type.OBJECT,
  properties: {
    dishName: {
      type: Type.STRING,
      description: "Nama hidangan atau makanan."
    },
    description: {
      type: Type.STRING,
      description: "Deskripsi singkat tentang item makanan."
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: {
          type: Type.NUMBER,
          description: "Estimasi total kalori."
        },
        protein: {
          type: Type.NUMBER,
          description: "Estimasi protein dalam gram."
        },
        carbohydrates: {
          type: Type.NUMBER,
          description: "Estimasi karbohidrat dalam gram."
        },
        fat: {
          type: Type.NUMBER,
          description: "Estimasi lemak dalam gram."
        },
      },
      required: ["calories", "protein", "carbohydrates", "fat"]
    },
     error: {
      type: Type.STRING,
      description: "Pesan error jika makanan tidak dapat diidentifikasi atau dianalisis.",
      nullable: true
    },
  },
  required: ["dishName", "description", "nutrition"]
};

const recipeResponseSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: {
            type: Type.STRING,
            description: "Nama resep yang dihasilkan."
        },
        description: {
            type: Type.STRING,
            description: "Deskripsi singkat yang menarik tentang resep."
        },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Daftar bahan yang dibutuhkan untuk resep."
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Langkah-langkah instruksi untuk membuat hidangan."
        },
        error: {
            type: Type.STRING,
            description: "Pesan error jika resep tidak dapat dibuat dari bahan yang diberikan.",
            nullable: true
        }
    },
    required: ["recipeName", "description", "ingredients", "instructions"]
};


export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<FoodAnalysisResult> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Analisis makanan ini. Beri nama hidangan, deskripsi singkat, dan estimasi nutrisi (kalori, protein, karbohidrat, lemak). Jawab dalam Bahasa Indonesia. Jika tidak yakin, isi kolom 'error'. Ikuti skema JSON yang diberikan.`,
    };

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: foodResponseSchema,
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result.error) {
        throw new Error(result.error);
    }
    
    return result as FoodAnalysisResult;

  } catch (error) {
    console.error("Error analyzing food image:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui saat analisis.";
    return {
        dishName: "Analisis Gagal",
        description: "Gagal menganalisis gambar. Coba lagi dengan foto yang lebih jelas.",
        nutrition: { calories: 0, protein: 0, carbohydrates: 0, fat: 0 },
        error: errorMessage,
    };
  }
};

export const generateHealthSummary = async (analysis: FoodAnalysisResult): Promise<string> => {
    try {
        const { dishName, nutrition } = analysis;
        const prompt = `Berdasarkan informasi nutrisi untuk hidangan "${dishName}" (Kalori: ${nutrition.calories.toFixed(0)} kcal, Protein: ${nutrition.protein.toFixed(1)}g, Karbohidrat: ${nutrition.carbohydrates.toFixed(1)}g, Lemak: ${nutrition.fat.toFixed(1)}g), berikan ringkasan kesehatan singkat (1-2 kalimat) dalam Bahasa Indonesia. Jelaskan apakah makanan ini baik untuk dikonsumsi secara umum, cocok untuk tujuan tertentu (misalnya, membangun otot atau diet), atau sebaiknya dikonsumsi secukupnya. Buat bahasanya sederhana dan memotivasi.`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { parts: [{ text: prompt }] },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating health summary:", error);
        return "Tidak dapat memuat ringkasan kesehatan saat ini.";
    }
};

const goalMappings: { [key: string]: string } = {
    gain: 'peningkatan berat badan',
    slow_gain: 'peningkatan berat badan secara perlahan',
    maintain: 'mempertahankan berat badan',
    slow_loss: 'pengurangan berat badan secara perlahan',
    loss: 'pengurangan berat badan'
};

export const generatePortionSuggestion = async (analysis: FoodAnalysisResult, dietGoal?: string | null): Promise<string> => {
    try {
        const { dishName, nutrition, description } = analysis;
        let prompt = `Berdasarkan analisis nutrisi hidangan "${dishName}" (Kalori: ${nutrition.calories.toFixed(0)} kcal) yang dideskripsikan sebagai "${description}", berikan saran ukuran porsi yang direkomendasikan dalam Bahasa Indonesia. Pertimbangkan apakah ini makanan padat kalori atau ringan. Berikan saran yang praktis dan mudah dipahami dalam satu kalimat.`;

        if (dietGoal && goalMappings[dietGoal]) {
            const goalDescription = goalMappings[dietGoal];
            prompt += ` \n\nPENTING: Pengguna memiliki tujuan diet untuk "${goalDescription}". Sesuaikan saran porsi Anda dengan tujuan ini. Jika tujuannya adalah pengurangan berat badan, sarankan porsi yang lebih kecil atau opsi rendah kalori. Jika tujuannya adalah peningkatan berat badan, sarankan porsi yang lebih besar atau padat kalori.`;
        } else {
            prompt += ` Contoh: "Karena kalorinya cukup tinggi, porsi sebesar satu mangkuk kecil sudah cukup." atau "Makanan ini cocok sebagai camilan ringan, nikmati sekitar satu genggam."`;
        }

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { parts: [{ text: prompt }] },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating portion suggestion:", error);
        return "Tidak dapat memuat saran porsi saat ini.";
    }
};

export const generateRecipe = async (dishName: string): Promise<RecipeResult> => {
    try {
        const textPart = {
            text: `Berikan saya resep untuk membuat: ${dishName}. Beri nama resep, deskripsi singkat, daftar bahan (termasuk takaran), dan langkah-langkah instruksi yang jelas. Jawab dalam Bahasa Indonesia. Jika nama makanan tidak dikenali atau tidak bisa dibuatkan resep, isi kolom 'error'. Ikuti skema JSON yang diberikan.`
        };

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { parts: [textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeResponseSchema,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result.error) {
            throw new Error(result.error);
        }

        return result as RecipeResult;

    } catch (error) {
        console.error("Error generating recipe:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui saat membuat resep.";
        return {
            recipeName: "Gagal Membuat Resep",
            description: "Maaf, kami tidak dapat membuat resep dari bahan yang Anda berikan. Coba lagi dengan bahan yang berbeda.",
            ingredients: [],
            instructions: [],
            error: errorMessage,
        };
    }
};
