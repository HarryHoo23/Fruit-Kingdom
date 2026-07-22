import type { AuthorSnapshot, ParentProfile } from "./types";

export const createAuthorSnapshot = (profile: ParentProfile): AuthorSnapshot => ({
  uid: profile.uid,
  displayName: profile.displayName,
  familyRole: profile.familyRole,
});
