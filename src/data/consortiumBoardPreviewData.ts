import { consortiumTypes } from "./consortiumData";

export type ConsortiumBoardPreview = {
  id: string;
  name: string;
  theme: string;
  description: string;
  passiveNames: string[];
};

export const consortiumBoardPreviews: ConsortiumBoardPreview[] = consortiumTypes.map((consortium) => ({
  id: consortium.id,
  name: consortium.name,
  theme: consortium.theme,
  description: consortium.description,
  passiveNames: consortium.passives.map((passive) => passive.name),
}));
