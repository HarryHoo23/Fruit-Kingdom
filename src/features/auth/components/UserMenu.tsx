import { useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { ProfilePhotoError, type ProfilePhotoErrorKind } from "../services/profilePhotoService";
import { useAuth } from "../useAuth";

const photoErrorKeys: Record<ProfilePhotoErrorKind, string> = {
  invalidType: "auth.profilePhoto.errorType",
  tooLarge: "auth.profilePhoto.errorSize",
  uploadFailed: "auth.profilePhoto.errorUpload",
};

export const UserMenu = () => {
  const { t } = useTranslation();
  const { user, profile, signOut, updateProfilePhoto } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [messageKey, setMessageKey] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  if (!user || !profile) return null;

  const roleLabel = t(`auth.role.${profile.familyRole}`);
  const initials = profile.displayName.trim().slice(0, 2).toUpperCase() || roleLabel.slice(0, 1);

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setMessageKey(null);
    try {
      await updateProfilePhoto(file);
      setHasError(false);
      setMessageKey("auth.profilePhoto.success");
    } catch (error) {
      const kind = error instanceof ProfilePhotoError ? error.kind : "uploadFailed";
      setHasError(true);
      setMessageKey(photoErrorKeys[kind]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <details className="relative max-[560px]:w-full">
      <summary className="flex min-h-[38px] list-none items-center gap-2 rounded-[14px] border border-fruit-border-light bg-fruit-paper/80 px-2.5 font-black text-fruit-text shadow-fruit-sm marker:content-none max-[560px]:justify-center">
        {profile.photoURL ? (
          <img className="h-7 w-7 rounded-full object-cover" src={profile.photoURL} alt="" />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-fruit-bananaLight text-xs">
            {initials}
          </span>
        )}
        <span>{roleLabel}</span>
        <span className="text-xs text-fruit-soft" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-56 rounded-fruit border border-fruit-cardBorder bg-fruit-parchment p-2 shadow-fruit-lg max-[560px]:left-0">
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => void handlePhotoChange(event)}
        />
        <button
          className="w-full rounded-[12px] px-3 py-2 text-left font-extrabold text-fruit-text hover:bg-fruit-bananaLight disabled:opacity-60"
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? t("auth.profilePhoto.uploading") : t("auth.profilePhoto.change")}
        </button>
        <p className="px-3 pb-2 text-xs font-bold text-fruit-soft">{t("auth.profilePhoto.help")}</p>
        {messageKey && (
          <p
            className={`mx-2 mb-2 rounded-[10px] px-2 py-1.5 text-xs font-extrabold ${hasError ? "bg-fruit-appleLight text-fruit-danger" : "bg-fruit-kiwiLight text-fruit-primary"}`}
            role={hasError ? "alert" : "status"}
          >
            {t(messageKey)}
          </p>
        )}
        <button
          className="w-full rounded-[12px] px-3 py-2 text-left font-extrabold text-fruit-danger hover:bg-fruit-appleLight"
          type="button"
          onClick={() => void signOut()}
        >
          {t("auth.logout")}
        </button>
      </div>
    </details>
  );
};
