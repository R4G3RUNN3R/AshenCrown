import { getProfileForViewer } from "../services/profileService.js";

export async function getProfile(req, res, next) {
  try {
    const profile = await getProfileForViewer(req.auth?.user ?? null, req.params.publicId);
    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
}
