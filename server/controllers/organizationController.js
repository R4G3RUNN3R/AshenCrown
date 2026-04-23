import {
  addOrganizationMemberForUser,
  assignGuildQuestMemberForUser,
  applyToConsortiumForUser,
  cancelGuildQuestForUser,
  assignConsortiumPositionForUser,
  claimDailyConsortiumPointsForUser,
  createOrganizationForUser,
  depositConsortiumTreasuryForUser,
  depositGuildArmoryForUser,
  getMyOrganization,
  initiateGuildQuestForUser,
  listConsortiumTypes,
  launchGuildDungeonForUser,
  planGuildQuestForUser,
  recruitGuildMemberForUser,
  redeemConsortiumRewardForUser,
  replanGuildQuestForUser,
  removeConsortiumMemberForUser,
  reviewConsortiumApplicationForUser,
  runConsortiumOutreachForUser,
  unlockGuildSkillForUser,
  updateGuildSettingsForUser,
  withdrawGuildArmoryForUser,
} from "../services/organizationService.js";

const wrap = (handler) => async (req, res, next) => {
  try { await handler(req, res); } catch (error) { next(error); }
};

export const getMyOrganizationController = wrap(async (req, res) => { res.status(200).json(await getMyOrganization(req.auth.user, req.query.type)); });
export const postOrganizationController = wrap(async (req, res) => { res.status(201).json(await createOrganizationForUser(req.auth.user, req.body ?? {})); });
export const postConsortiumClaimPointsController = wrap(async (req, res) => { res.status(200).json(await claimDailyConsortiumPointsForUser(req.auth.user, req.params.organizationId)); });
export const postConsortiumRedeemController = wrap(async (req, res) => { res.status(200).json(await redeemConsortiumRewardForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postOrganizationMemberController = wrap(async (req, res) => { res.status(200).json(await addOrganizationMemberForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postConsortiumApplyController = wrap(async (req, res) => { res.status(200).json(await applyToConsortiumForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postConsortiumApplicationReviewController = wrap(async (req, res) => { res.status(200).json(await reviewConsortiumApplicationForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postConsortiumPositionController = wrap(async (req, res) => { res.status(200).json(await assignConsortiumPositionForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postConsortiumMemberRemoveController = wrap(async (req, res) => { res.status(200).json(await removeConsortiumMemberForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postConsortiumTreasuryDepositController = wrap(async (req, res) => { res.status(200).json(await depositConsortiumTreasuryForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postConsortiumOutreachController = wrap(async (req, res) => { res.status(200).json(await runConsortiumOutreachForUser(req.auth.user, req.params.organizationId)); });
export const getConsortiumTemplatesController = wrap(async (_req, res) => { res.status(200).json({ consortiumTemplates: listConsortiumTypes() }); });
export const postGuildSettingsController = wrap(async (req, res) => { res.status(200).json(await updateGuildSettingsForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildRecruitController = wrap(async (req, res) => { res.status(200).json(await recruitGuildMemberForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildSkillUnlockController = wrap(async (req, res) => { res.status(200).json(await unlockGuildSkillForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildArmoryDepositController = wrap(async (req, res) => { res.status(200).json(await depositGuildArmoryForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildArmoryWithdrawController = wrap(async (req, res) => { res.status(200).json(await withdrawGuildArmoryForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildDungeonLaunchController = wrap(async (req, res) => { res.status(200).json(await launchGuildDungeonForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildQuestPlanController = wrap(async (req, res) => { res.status(200).json(await planGuildQuestForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildQuestAssignController = wrap(async (req, res) => { res.status(200).json(await assignGuildQuestMemberForUser(req.auth.user, req.params.organizationId, req.body ?? {})); });
export const postGuildQuestCancelController = wrap(async (req, res) => { res.status(200).json(await cancelGuildQuestForUser(req.auth.user, req.params.organizationId)); });
export const postGuildQuestInitiateController = wrap(async (req, res) => { res.status(200).json(await initiateGuildQuestForUser(req.auth.user, req.params.organizationId)); });
export const postGuildQuestReplanController = wrap(async (req, res) => { res.status(200).json(await replanGuildQuestForUser(req.auth.user, req.params.organizationId)); });
