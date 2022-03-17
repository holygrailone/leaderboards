type LegendClass = "Crusader" | "Magist" | "Ranger";

interface LegendData {
  rank: number;
  legendid: number;
  address: string;
  gen: number;
  title: string;
  minted: number;
  banned: boolean;
  knowledge: number;
  name: string;
  class: LegendClass;
  level: number;
  xp: number;
  gold: number;
}

interface LegendLabelData {
  label: string;
  id: keyof LegendData;
  numeric: boolean;
}

interface FilterLegendProps {
  filterName: LegendClass | string | number;
  selected: boolean;
}
