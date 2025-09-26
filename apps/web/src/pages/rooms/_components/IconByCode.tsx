import {
  Bed,
  Television,
  Wifi,
  Refrigerator,
  WashingMachine,
  MicrowaveOven,
  AirConditioner,
  Book,
  Closet,
  Sofa,
  Sink,
  GasStove,
  Iron,
  Cookware,
  KitchenTool,
  VacuumCleaner,
  Spa,
  Dryer,
  WiredInternet,
  Topper,
  Curtain,
  Table,
  HairDryer,
  Stove,
  Tableware,
  Heater,
  } from '@plott-life/ui/components/icons';

interface Props {
  code: string;
  className?: string;
}

export const iconMap: Record<string, any> = {
  TV: Television,
  WIFI: Wifi,
  AIR_CONDITIONER: AirConditioner,
  REFRIGERATOR: Refrigerator,
  WASHING_MACHINE: WashingMachine,
  MICROWAVE: MicrowaveOven,
  SHARED_REFRIGERATOR: Refrigerator,
  BOOKSHELF: Book,
  CLOSET: Closet,
  SOFA: Sofa,
  BED: Bed,
  SINK: Sink,
  GAS_STOVE: GasStove,
  COOKING_TOOLS: Cookware,
  POTS_AND_PANS: KitchenTool,
  BATHTUB: Spa,
  DRYING_RACK: Iron,
  DRYER: Dryer,
  VACUUM_CLEANER: VacuumCleaner,
  HEATER: Heater,
  WIRED_INTERNET: WiredInternet,
  FREE_BEDDING: Topper,
  PAID_BEDDING: Topper,
  CURTAIN: Curtain,
  DINING_TABLE: Table,
  HAIR_DRYER: HairDryer,
  INDUCTION: Stove,
  DISHES: Tableware,
  WASHER_DRYER_COMBO: WashingMachine,
};

  export default function IconByCode({ code, className = '' }: Props) {
    const Icon = iconMap[code] ?? null;
    return Icon ? <Icon className={className} /> : null;
  }
