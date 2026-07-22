import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export type AuthErrorKind =
  | "popupClosed"
  | "popupBlocked"
  | "unauthorizedDomain"
  | "network"
  | "generic";

export class FriendlyAuthError extends Error {
  constructor(public readonly kind: AuthErrorKind) {
    super(kind);
    this.name = "FriendlyAuthError";
  }
}

const getAuthInstance = () => {
  if (!auth) throw new FriendlyAuthError("generic");
  return auth;
};

const toFriendlyError = (error: unknown): FriendlyAuthError => {
  if (!(error instanceof FirebaseError)) return new FriendlyAuthError("generic");

  switch (error.code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return new FriendlyAuthError("popupClosed");
    case "auth/popup-blocked":
      return new FriendlyAuthError("popupBlocked");
    case "auth/unauthorized-domain":
      return new FriendlyAuthError("unauthorizedDomain");
    case "auth/network-request-failed":
      return new FriendlyAuthError("network");
    default:
      return new FriendlyAuthError("generic");
  }
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(getAuthInstance(), provider);
  } catch (error) {
    if (error instanceof FriendlyAuthError) throw error;
    throw toFriendlyError(error);
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(getAuthInstance());
  } catch {
    throw new FriendlyAuthError("generic");
  }
};
