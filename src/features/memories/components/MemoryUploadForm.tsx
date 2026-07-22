import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnimalButton } from "../../../components/AnimalButton";
import { AnimalCard } from "../../../components/AnimalCard";
import { regions } from "../../regions/regionData";
import { toTranslationKey } from "../../../i18n/keys";
import { useCreateMemory } from "../hooks/useCreateMemory";
import { useMemoryUpload } from "../hooks/useMemoryUpload";
import type { CreateMemoryDetails } from "../types";
import { ImageProcessingStatus } from "./ImageProcessingStatus";
import { PhotoDropzone } from "./PhotoDropzone";
import { PhotoPreview } from "./PhotoPreview";
import { UploadProgress } from "./UploadProgress";

const fieldClasses =
  "min-h-12 w-full rounded-fruit border-2 border-fruit-cardBorder bg-fruit-input px-3.5 py-3 text-fruit-text outline-none focus:border-fruit-inputFocus focus:shadow-input-focus disabled:opacity-60";
const labelClasses = "grid gap-1.5 text-sm font-black text-fruit-text";

const todayAsInputDate = () => {
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 10);
};

export const MemoryUploadForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [formError, setFormError] = useState(false);
  const [title, setTitle] = useState("");
  const [capturedAt, setCapturedAt] = useState(todayAsInputDate());
  const [description, setDescription] = useState("");
  const [parentMessage, setParentMessage] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [regionId, setRegionId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [tags, setTags] = useState("");
  const upload = useMemoryUpload();
  const creation = useCreateMemory();

  const processingErrorKey = upload.errorCode
    ? {
        empty: "memories.upload.errorEmpty",
        fileTooLarge: "memories.upload.errorFileTooLarge",
        unsupportedType: "memories.upload.errorUnsupportedType",
        heicUnsupported: "memories.upload.errorHeic",
        decode: "memories.upload.errorDecode",
        webp: "memories.upload.errorWebp",
      }[upload.errorCode]
    : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!upload.processedImage || !title.trim() || !capturedAt || creation.uploading) return;
    setFormError(false);

    const hasLocation = Boolean(locationName.trim() || city.trim() || country.trim());
    const details: CreateMemoryDetails = {
      title: title.trim(),
      description: description.trim(),
      parentMessage: parentMessage.trim(),
      capturedAt: new Date(`${capturedAt}T12:00:00`),
      regionId: regionId || null,
      milestoneId: milestoneId.trim() || null,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 12),
      location: hasLocation
        ? { name: locationName.trim(), city: city.trim(), country: country.trim() }
        : null,
    };

    try {
      const memoryId = await creation.createMemory(details, upload.processedImage);
      navigate(`/memories?memory=${encodeURIComponent(memoryId)}`, { replace: true });
    } catch {
      setFormError(true);
    }
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3" aria-label={t("memories.upload.stepLabel", { step })}>
        {[1, 2].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-1 items-center gap-2">
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full border-2 font-black ${step >= stepNumber ? "border-fruit-primary bg-fruit-primary text-fruit-paper" : "border-fruit-cardBorder bg-fruit-paper text-fruit-soft"}`}
            >
              {stepNumber}
            </span>
            <span className="text-sm font-black text-fruit-text">
              {t(`memories.upload.step${stepNumber}`)}
            </span>
          </div>
        ))}
      </div>

      {step === 1 ? (
        <AnimalCard pattern="default" className="grid gap-4">
          {upload.processing ? (
            <ImageProcessingStatus />
          ) : upload.processedImage && upload.previewUrl ? (
            <PhotoPreview
              previewUrl={upload.previewUrl}
              processed={upload.processedImage}
              onReplace={(file) => void upload.selectPhoto(file)}
              onRemove={upload.removePhoto}
            />
          ) : (
            <PhotoDropzone onSelect={(file) => void upload.selectPhoto(file)} />
          )}

          {processingErrorKey && (
            <p className="rounded-fruit border border-fruit-danger bg-fruit-appleLight p-3 font-bold text-fruit-danger" role="alert" aria-live="assertive">
              {t(processingErrorKey)}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 max-[560px]:grid max-[560px]:grid-cols-2">
            <AnimalButton variant="soft" onClick={() => navigate(-1)}>
              {t("memories.upload.cancel")}
            </AnimalButton>
            <AnimalButton
              disabled={!upload.processedImage || upload.processing}
              onClick={() => setStep(2)}
            >
              {t("memories.upload.continue")} <ArrowRight size={18} aria-hidden="true" />
            </AnimalButton>
          </div>
        </AnimalCard>
      ) : (
        <AnimalCard pattern="default" className="grid gap-5">
          <div className="grid grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)] gap-5 max-[780px]:grid-cols-1">
            {upload.processedImage && upload.previewUrl && (
              <div className="grid content-start gap-3">
                <img
                  src={upload.previewUrl}
                  alt={t("memories.upload.previewAlt")}
                  className="max-h-[420px] w-full rounded-fruit border-2 border-fruit-cardBorder bg-fruit-paper object-contain shadow-fruit"
                />
                <button
                  type="button"
                  disabled={creation.uploading}
                  onClick={() => setStep(1)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 font-black text-fruit-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/40"
                >
                  <ArrowLeft size={18} aria-hidden="true" /> {t("memories.upload.changePhoto")}
                </button>
              </div>
            )}

            <div className="grid gap-4">
              <label className={labelClasses}>
                {t("memories.form.title")} *
                <input className={fieldClasses} required maxLength={100} disabled={creation.uploading} value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <label className={labelClasses}>
                {t("memories.form.capturedAt")} *
                <input className={fieldClasses} required type="date" max={todayAsInputDate()} disabled={creation.uploading} value={capturedAt} onChange={(event) => setCapturedAt(event.target.value)} />
              </label>
              <label className={labelClasses}>
                {t("memories.form.description")}
                <textarea className={fieldClasses} rows={4} maxLength={1200} disabled={creation.uploading} value={description} onChange={(event) => setDescription(event.target.value)} />
              </label>
              <label className={labelClasses}>
                {t("memories.form.parentMessage")}
                <textarea className={fieldClasses} rows={3} maxLength={800} disabled={creation.uploading} value={parentMessage} onChange={(event) => setParentMessage(event.target.value)} />
              </label>
              <label className={labelClasses}>
                {t("memories.form.region")}
                <select className={fieldClasses} disabled={creation.uploading} value={regionId} onChange={(event) => setRegionId(event.target.value)}>
                  <option value="">{t("memories.form.noRegion")}</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.emoji} {t(`regions.${toTranslationKey(region.id)}.name`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClasses}>
                {t("memories.form.milestone")}
                <input className={fieldClasses} maxLength={80} disabled={creation.uploading} value={milestoneId} onChange={(event) => setMilestoneId(event.target.value)} />
              </label>
              <label className={labelClasses}>
                {t("memories.form.tags")}
                <input className={fieldClasses} maxLength={240} placeholder={t("memories.form.tagsHelp")} disabled={creation.uploading} value={tags} onChange={(event) => setTags(event.target.value)} />
              </label>
              <fieldset className="grid gap-3 rounded-fruit border border-fruit-cardDashed p-4">
                <legend className="px-2 text-sm font-black text-fruit-text">{t("memories.form.location")}</legend>
                <label className={labelClasses}>
                  {t("memories.form.locationName")}
                  <input className={fieldClasses} maxLength={100} disabled={creation.uploading} value={locationName} onChange={(event) => setLocationName(event.target.value)} />
                </label>
                <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
                  <label className={labelClasses}>
                    {t("memories.form.city")}
                    <input className={fieldClasses} maxLength={80} disabled={creation.uploading} value={city} onChange={(event) => setCity(event.target.value)} />
                  </label>
                  <label className={labelClasses}>
                    {t("memories.form.country")}
                    <input className={fieldClasses} maxLength={80} disabled={creation.uploading} value={country} onChange={(event) => setCountry(event.target.value)} />
                  </label>
                </div>
              </fieldset>
            </div>
          </div>

          {creation.uploading && <UploadProgress stage={creation.stage} progress={creation.progress} />}
          {(formError || creation.error) && (
            <p className="rounded-fruit border border-fruit-danger bg-fruit-appleLight p-3 font-bold text-fruit-danger" role="alert" aria-live="assertive">
              {t("memories.upload.errorGeneric")}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 max-[560px]:grid max-[560px]:grid-cols-2">
            <AnimalButton variant="soft" disabled={creation.uploading} onClick={() => setStep(1)}>
              <ArrowLeft size={18} aria-hidden="true" /> {t("memories.upload.back")}
            </AnimalButton>
            <AnimalButton type="submit" disabled={creation.uploading || !title.trim() || !capturedAt}>
              <Upload size={18} aria-hidden="true" />
              {creation.uploading ? t("memories.upload.uploading") : t("memories.upload.submit")}
            </AnimalButton>
          </div>
        </AnimalCard>
      )}
    </form>
  );
};
