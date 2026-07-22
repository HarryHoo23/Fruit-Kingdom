import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../lib/firebase";
import type { ParentProfile } from "../types";

const maxPhotoSize = 5 * 1024 * 1024;
const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ProfilePhotoErrorKind = "invalidType" | "tooLarge" | "uploadFailed";

export class ProfilePhotoError extends Error {
  constructor(public readonly kind: ProfilePhotoErrorKind) {
    super(kind);
    this.name = "ProfilePhotoError";
  }
}

export const uploadProfilePhoto = async (
  profile: ParentProfile,
  file: File,
): Promise<string> => {
  if (!allowedPhotoTypes.has(file.type)) throw new ProfilePhotoError("invalidType");
  if (file.size > maxPhotoSize) throw new ProfilePhotoError("tooLarge");
  if (!db || !storage) throw new ProfilePhotoError("uploadFailed");

  try {
    const photoRef = ref(
      storage,
      `families/${profile.familyId}/profile-images/${profile.uid}/avatar`,
    );
    await uploadBytes(photoRef, file, { contentType: file.type });
    const downloadUrl = await getDownloadURL(photoRef);
    const photoURL = `${downloadUrl}${downloadUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
    await updateDoc(doc(db, "users", profile.uid), { photoURL });
    return photoURL;
  } catch (error) {
    if (error instanceof ProfilePhotoError) throw error;
    throw new ProfilePhotoError("uploadFailed");
  }
};
