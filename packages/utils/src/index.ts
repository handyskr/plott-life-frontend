type RoomFeatures = {
  bedrooms?: number;
  bathrooms?: number;
  livingrooms?: number;
  kitchens?: number;
  [key: string]: number | undefined;
};

export function formatFeatures(features: RoomFeatures): string {
  const labels: Record<string, string> = {
    bedrooms: "침실",
    bathrooms: "욕실",
    livingrooms: "거실",
    kitchens: "주방",
  };

  return Object.entries(features)
    .filter(([key, value]) => value && value > 0)
    .map(([key, value]) => `${labels[key] ?? key} ${value}개`)
    .join(", ");
}
