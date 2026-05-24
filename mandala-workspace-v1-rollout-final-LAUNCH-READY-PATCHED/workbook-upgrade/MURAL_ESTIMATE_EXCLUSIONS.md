# Mural Estimate Exclusions

The mural estimate must calculate net paintable area, not only gross wall area.

## Required Formula Logic

Gross Wall Area = Wall Width × Wall Height  
Excluded Area Total = SUM(Width × Height × Quantity for every excluded item)  
Net Paintable Area = Gross Wall Area - Excluded Area Total

## Required Exclusion Types
- Window
- Door
- Vent
- Utility Box
- Signage Area
- Architectural Cutout
- No-Paint Zone
- Protected Area
- Other

## Required Workbook Tab

Estimate Exclusions

Columns:

Project ID | Exclusion ID | Type | Width | Height | Quantity | Area | Notes | Include In Deduction
