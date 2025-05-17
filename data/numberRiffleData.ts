import { NumberRiffleProps } from "@/types/numberRiffle";

export const numberRiffleData: NumberRiffleProps[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: i.toString().padStart(2, "0"),
  confirmation: false,
}));
