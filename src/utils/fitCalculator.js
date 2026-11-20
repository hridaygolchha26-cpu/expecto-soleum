/**
 * Expecto Soleum - Biometric Fit Algorithm
 * Senior Software Engineer implementation of precision football boot fitment.
 */

export const calculateSizesFromLength = (lengthCm) => {
  const length = parseFloat(lengthCm) || 27.0;
  
  // Football boots require ~0.8cm - 1.2cm allowance for rapid decelerations and toe clearance
  const internalLength = length + 1.0;
  
  // Standard Paris Points formula: Size EU = (length in cm) * 1.5
  const estimatedEu = Math.round((internalLength * 1.5) * 2) / 2;
  
  // Standard conversions
  const estimatedUk = Math.round((estimatedEu - 33.5) / 1.33 * 2) / 2;
  const estimatedUsMen = Math.round((estimatedUk + 0.5) * 2) / 2;
  const estimatedUsWomen = Math.round((estimatedUsMen + 1.5) * 2) / 2;

  return {
    eu: Math.max(38, Math.min(48, estimatedEu)),
    uk: Math.max(5, Math.min(13.5, estimatedUk)),
    usMen: Math.max(5.5, Math.min(14, estimatedUsMen)),
    usWomen: Math.max(7, Math.min(15.5, estimatedUsWomen)),
    internalLengthCm: internalLength.toFixed(1)
  };
};

export const classifyFootWidth = (widthCm, lengthCm) => {
  const width = parseFloat(widthCm) || 10.0;
  const length = parseFloat(lengthCm) || 27.0;
  
  // Ratio calculation: Foot Width to Foot Length ratio
  const ratio = width / length;

  if (ratio < 0.355) {
    return {
      category: "Narrow",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      description: "Slim profile. Speed boots with tapered midfoots like Mercurial and F50 will feel tailored."
    };
  } else if (ratio <= 0.385) {
    return {
      category: "Medium / Standard",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      description: "Standard athletic width. You enjoy versatile compatibility across 90% of elite models."
    };
  } else if (ratio <= 0.415) {
    return {
      category: "Wide",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      description: "Broader forefoot. Look for natural leather (Tiempo, Copa, Morelia) or adaptive knit (Future)."
    };
  } else {
    return {
      category: "Extra Wide (2E/4E)",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      description: "Substantial metatarsal splay. Dedicated 2E lasts like New Balance Furon or K-leather boots are essential."
    };
  }
};

export const calculateBootMatch = (boot, userMeasurements) => {
  const userWidth = parseFloat(userMeasurements.widthCm) || 10.0;
  const { min, max } = boot.widthToleranceCm;

  let score = 95;
  let status = "Optimal Match";
  let statusType = "optimal"; // 'optimal' | 'snug' | 'warning'

  if (userWidth >= min && userWidth <= max) {
    // Within prime tolerance
    const center = (min + max) / 2;
    const distance = Math.abs(userWidth - center);
    const range = (max - min) / 2;
    score = Math.round(100 - (distance / range) * 8);
    status = "Anatomic Sweetspot";
    statusType = "optimal";
  } else if (userWidth < min) {
    // Narrower than boot
    const diff = min - userWidth;
    score = Math.max(70, Math.round(90 - diff * 18));
    status = "Slightly Roomy Forefoot";
    statusType = "snug";
  } else {
    // Wider than boot
    const diff = userWidth - max;
    score = Math.max(60, Math.round(88 - diff * 26));
    status = diff > 0.6 ? "High Pinch Risk (Too Narrow)" : "Tight Competitive Lock";
    statusType = diff > 0.6 ? "warning" : "snug";
  }

  // Adjust for adaptive materials like Puma Fuzionfit or K-leather
  if (boot.id.includes("future") || boot.id.includes("morelia")) {
    score = Math.min(100, score + 4);
  }

  return {
    score,
    status,
    statusType
  };
};
