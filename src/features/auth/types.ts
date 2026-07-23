import type { User } from "firebase/auth";
import type { RegionId } from "../../types/domain";

export type FamilyRole = "dad" | "mum";

export type ParentProfile = {
  uid: string;
  email: string;
  displayName: string;
  familyRole: FamilyRole;
  familyId: string;
  active: boolean;
  photoURL?: string;
  currentRegionId?: RegionId;
  unlockedRegionIds?: RegionId[];
};

export type AuthorSnapshot = {
  uid: string;
  displayName: string;
  familyRole: FamilyRole;
};

export type AuthContextValue = {
  user: User | null;
  profile: ParentProfile | null;
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfilePhoto: (file: File) => Promise<void>;
};
