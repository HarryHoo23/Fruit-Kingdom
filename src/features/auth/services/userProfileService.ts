import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { FamilyRole, ParentProfile } from "../types";

const isFamilyRole = (value: unknown): value is FamilyRole => value === "dad" || value === "mum";

const profileLoadTimeoutMs = 10_000;

const withTimeout = async <T>(promise: Promise<T>): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Profile request timed out")), profileLoadTimeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

export const loadUserProfile = async (uid: string): Promise<ParentProfile | null> => {
  if (!db) return null;

  const snapshot = await withTimeout(getDoc(doc(db, "users", uid)));
  if (!snapshot.exists()) return null;

  const data: unknown = snapshot.data();
  if (!data || typeof data !== "object") return null;
  const profile = data as Record<string, unknown>;

  if (
    profile.uid !== uid ||
    typeof profile.email !== "string" ||
    typeof profile.displayName !== "string" ||
    !isFamilyRole(profile.familyRole) ||
    typeof profile.familyId !== "string" ||
    typeof profile.active !== "boolean"
  ) {
    return null;
  }

  return {
    uid,
    email: profile.email,
    displayName: profile.displayName,
    familyRole: profile.familyRole,
    familyId: profile.familyId,
    active: profile.active,
    photoURL: typeof profile.photoURL === "string" ? profile.photoURL : undefined,
  };
};
