import { onAuthStateChanged, type User } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth } from "../../lib/firebase";
import { AuthContext } from "./AuthContext";
import { signInWithGoogle, signOutUser } from "./services/authService";
import { loadUserProfile } from "./services/userProfileService";
import { uploadProfilePhoto } from "./services/profilePhotoService";
import type { AuthContextValue, ParentProfile } from "./types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    if (!auth) {
      setIsAuthLoading(false);
      return;
    }

    let active = true;
    let profileRequestId = 0;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return;
      const requestId = ++profileRequestId;
      setUser(nextUser);
      setProfile(null);
      setIsAuthLoading(false);

      if (!nextUser) {
        setIsProfileLoading(false);
        return;
      }

      setIsProfileLoading(true);
      try {
        const nextProfile = await loadUserProfile(nextUser.uid);
        if (active && requestId === profileRequestId) setProfile(nextProfile);
      } catch {
        if (active && requestId === profileRequestId) setProfile(null);
      } finally {
        if (active && requestId === profileRequestId) setIsProfileLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(() => signInWithGoogle(), []);
  const signOut = useCallback(() => signOutUser(), []);
  const updateProfilePhoto = useCallback(
    async (file: File) => {
      if (!profile) throw new Error("Parent profile is unavailable");
      const photoURL = await uploadProfilePhoto(profile, file);
      setProfile((currentProfile) =>
        currentProfile?.uid === profile.uid ? { ...currentProfile, photoURL } : currentProfile,
      );
    },
    [profile],
  );
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAuthLoading,
      isProfileLoading,
      isAuthenticated: user !== null,
      signIn,
      signOut,
      updateProfilePhoto,
    }),
    [user, profile, isAuthLoading, isProfileLoading, signIn, signOut, updateProfilePhoto],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
