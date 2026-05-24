export type Exclusion = {
  id: string;
  type: string;
  width: number;
  height: number;
  quantity: number;
  notes?: string;
};

export type EstimateInput = {
  wallWidth: number;
  wallHeight: number;
  exclusions: Exclusion[];
  coats: number;
  coveragePerGallon: number;
  wasteFactor: number;
  paintCostPerGallon: number;
  laborRate: number;
  laborHoursPer100Sf: number;
};

export function calculateMuralEstimate(input: EstimateInput) {
  const grossSquareFeet = input.wallWidth * input.wallHeight;
  const excludedSquareFeet = input.exclusions.reduce((sum, item) => {
    return sum + (item.width * item.height * item.quantity);
  }, 0);
  const netPaintableSquareFeet = Math.max(0, grossSquareFeet - excludedSquareFeet);
  const paintGallons = Math.ceil((netPaintableSquareFeet * input.coats / input.coveragePerGallon) * (1 + input.wasteFactor));
  const paintCost = paintGallons * input.paintCostPerGallon;
  const laborHours = Math.ceil((netPaintableSquareFeet / 100) * input.laborHoursPer100Sf);
  const laborCost = laborHours * input.laborRate;

  return {
    grossSquareFeet,
    excludedSquareFeet,
    netPaintableSquareFeet,
    paintGallons,
    paintCost,
    laborHours,
    laborCost,
    subtotal: paintCost + laborCost
  };
}
