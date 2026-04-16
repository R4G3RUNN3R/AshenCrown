import {
  consortiumTemplates,
  getConsortiumTemplateById,
  type ConsortiumTemplate,
} from "../data/consortiumTemplateData";

export type ConsortiumCreationState = {
  availableGold: number;
  playerLevel?: number;
  civicStanding?: number;
  existingConsortiumId?: string | null;
};

export type ConsortiumCreationCheck = {
  ok: boolean;
  reason?: string;
  template?: ConsortiumTemplate;
};

export function getAvailableConsortiumTemplates() {
  return consortiumTemplates;
}

export function canCreateConsortium(
  templateId: string,
  state: ConsortiumCreationState,
): ConsortiumCreationCheck {
  const template = getConsortiumTemplateById(templateId);
  if (!template) {
    return { ok: false, reason: "Consortium template not found." };
  }

  if (state.existingConsortiumId) {
    return {
      ok: false,
      reason: "Player is already attached to an existing consortium.",
      template,
    };
  }

  if (state.availableGold < template.creationCostGold) {
    return {
      ok: false,
      reason: `Insufficient gold. Requires ${template.creationCostGold} gold.`,
      template,
    };
  }

  return { ok: true, template };
}

export function getConsortiumCreationSummary(templateId: string) {
  const template = getConsortiumTemplateById(templateId);
  if (!template) return null;

  return {
    id: template.id,
    name: template.name,
    creationCostGold: template.creationCostGold,
    memberCap: template.memberCap,
    passives: template.passives.map((passive) => passive.name),
    actives: template.actives.map((active) => active.name),
    requirements: template.requirements,
  };
}
