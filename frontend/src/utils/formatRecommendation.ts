export interface FormattedRecommendation {
  title: string;
  sections: RecommendationSection[];
}

export interface RecommendationSection {
  title: string;
  content: string;
  type: 'text' | 'list' | 'highlight';
}

export function formatRecommendation(recommendation: string, type: 'crop' | 'fertilizer' = 'crop'): FormattedRecommendation {
  // Remove markdown formatting
  let cleanedText = recommendation
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1') // Remove bold
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/#{1,6}\s*(.*?)$/gm, '$1') // Remove headers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
    .trim();

  // For fertilizer recommendations, simplify the language
  if (type === 'fertilizer') {
    cleanedText = simplifyFertilizerLanguage(cleanedText);
  }

  // Split into sections based on common patterns
  const sections: RecommendationSection[] = [];
  
  // Split by double newlines to get major sections
  const parts = cleanedText.split(/\n\s*\n/);
  
  let currentSection: RecommendationSection | null = null;
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;
    
    // Check if this is a section header (ends with colon or is all caps)
    if (trimmedPart.endsWith(':') || /^[A-Z\s]+$/.test(trimmedPart)) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: trimmedPart.replace(':', ''),
        content: '',
        type: 'text'
      };
    } else {
      // This is content
      if (currentSection) {
        currentSection.content += (currentSection.content ? '\n\n' : '') + trimmedPart;
      } else {
        // If no section started, create a default one
        currentSection = {
          title: 'Recommendation',
          content: trimmedPart,
          type: 'text'
        };
      }
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  // Process sections to identify lists and highlights
  sections.forEach(section => {
    const lines = section.content.split('\n');
    const hasBulletPoints = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'));
    const hasNumberedList = lines.some(line => /^\d+\./.test(line.trim()));
    
    if (hasBulletPoints || hasNumberedList) {
      section.type = 'list';
    } else if (section.title.toLowerCase().includes('important') || 
               section.title.toLowerCase().includes('key') ||
               section.title.toLowerCase().includes('priority')) {
      section.type = 'highlight';
    }
  });
  
  return {
    title: type === 'fertilizer' ? 'Simple Fertilizer Guide' : 'AI Recommendation',
    sections
  };
}

function simplifyFertilizerLanguage(text: string): string {
  // Replace technical terms with simple farmer language
  const replacements = [
    // Technical terms to simple terms
    ['Nitrogen', 'Nitrogen (N)'],
    ['Phosphorus', 'Phosphorus (P)'],
    ['Potassium', 'Potassium (K)'],
    ['NPK', 'NPK (Nitrogen-Phosphorus-Potassium)'],
    ['Urea', 'Urea (46% Nitrogen)'],
    ['DAP', 'DAP (18% N, 46% P)'],
    ['TSP', 'TSP (46% Phosphorus)'],
    ['Ammonium Sulphate', 'Ammonium Sulphate (21% Nitrogen)'],
    ['Rock Phosphate', 'Rock Phosphate (Natural Phosphorus)'],
    ['Diammonium Phosphate', 'DAP (18% N, 46% P)'],
    ['Triple Superphosphate', 'TSP (46% Phosphorus)'],
    
    // Technical measurements to simple terms
    ['per hectare', 'per acre (or per hectare)'],
    ['hectare', 'acre'],
    ['kg per hectare', 'kg per acre'],
    ['tonnes per hectare', 'tonnes per acre'],
    
    // Technical soil terms
    ['Cation Exchange Capacity', 'Soil\'s ability to hold nutrients'],
    ['Organic Carbon', 'Organic matter'],
    ['Bulk Density', 'Soil compactness'],
    ['Evapotranspiration', 'Water loss from soil'],
    
    // Simplify complex explanations
    ['Banding is best', 'Best method: Place fertilizer in a line beside seeds'],
    ['Broadcast evenly', 'Spread fertilizer evenly over the field'],
    ['Incorporate lightly', 'Mix fertilizer lightly into soil'],
    ['Top dressing', 'Second fertilizer application'],
    ['Split application', 'Apply fertilizer in two parts'],
    
    // Make instructions clearer
    ['Apply', 'Use'],
    ['Dosage', 'Amount to use'],
    ['Application method', 'How to apply'],
    ['Timing', 'When to apply'],
    
    // Simplify scientific terms
    ['pH', 'Soil acidity'],
    ['ppm', 'parts per million'],
    ['g/kg', 'grams per kilogram'],
    ['cmol/kg', 'centimoles per kilogram'],
  ];

  let simplifiedText = text;
  
  replacements.forEach(([technical, simple]) => {
    simplifiedText = simplifiedText.replace(new RegExp(technical, 'gi'), simple);
  });

  // Add simple explanations for complex sections
  simplifiedText = simplifiedText.replace(
    /Why it's Suitable:/g,
    'Why this fertilizer is good for your soil:'
  );
  
  simplifiedText = simplifiedText.replace(
    /Practical Tips for Success:/g,
    'How to use it properly:'
  );
  
  simplifiedText = simplifiedText.replace(
    /Important Considerations:/g,
    'Important things to remember:'
  );

  return simplifiedText;
}

export function formatSoilSummary(soil: any) {
  return {
    title: 'Soil Analysis',
    sections: [
      {
        title: 'Basic Properties',
        content: `Soil Type: ${soil.soil_type}\nTexture: ${soil.texture_class}\npH Level: ${soil.ph}`,
        type: 'text'
      },
      {
        title: 'Nutrient Levels',
        content: `Nitrogen: ${soil.nitrogen_total_g_per_kg} g/kg\nPhosphorous: ${soil.phosphorous_extractable_ppm} ppm\nPotassium: ${soil.potassium_extractable_ppm} ppm\nOrganic Carbon: ${soil.carbon_organic_g_per_kg} g/kg`,
        type: 'text'
      },
      {
        title: 'Soil Composition',
        content: `Sand: ${soil.sand_content_percent}%\nSilt: ${soil.silt_content_percent}%\nClay: ${soil.clay_content_percent}%\nStone Content: ${soil.stone_content_percent}%`,
        type: 'text'
      }
    ]
  };
}

export function formatWeatherSummary(weather: any) {
  return {
    title: 'Weather Analysis',
    sections: [
      {
        title: 'Temperature',
        content: `Average Max: ${weather.avg_temperature_max}°C\nAverage Min: ${weather.avg_temperature_min}°C\nRange: ${weather.min_temperature}°C - ${weather.max_temperature}°C`,
        type: 'text'
      },
      {
        title: 'Precipitation & Conditions',
        content: `Total Rainfall: ${weather.total_rainfall_mm} mm\nSunshine Hours: ${weather.avg_sunshine_hours} hrs/day\nWind Speed: ${weather.avg_wind_speed_kph} km/h\nEvapotranspiration: ${weather.avg_evapotranspiration} mm/day`,
        type: 'text'
      },
      {
        title: 'Period',
        content: `${new Date(weather.period_start).toLocaleDateString()} - ${new Date(weather.period_end).toLocaleDateString()}`,
        type: 'text'
      }
    ]
  };
} 