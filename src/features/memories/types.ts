export type FamilyRole = "dad" | "mum";

export type AuthorSnapshot = {
  uid: string;
  displayName: string;
  familyRole: FamilyRole;
};

export type MemoryStatus = "active" | "archived";

export type MemoryImage = {
  storagePath: string;
  downloadUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
};

export type Memory = {
  id: string;
  title: string;
  description: string;
  parentMessage: string;
  capturedAt: Date;
  ageInMonths: number;
  regionId: string | null;
  milestoneId: string | null;
  tags: string[];
  location: {
    name: string;
    city: string;
    country: string;
  } | null;
  original: {
    storagePath: string;
    contentType: string;
    sizeBytes: number;
  };
  displayImage: MemoryImage;
  thumbnail: MemoryImage;
  status: MemoryStatus;
  createdBy: AuthorSnapshot;
  updatedBy: AuthorSnapshot;
  uploadedBy: AuthorSnapshot;
  createdAt: Date;
  updatedAt: Date;
};

export type MemoryDraft = Pick<
  Memory,
  | "title"
  | "description"
  | "parentMessage"
  | "capturedAt"
  | "ageInMonths"
  | "regionId"
  | "milestoneId"
  | "tags"
  | "location"
  | "original"
  | "displayImage"
  | "thumbnail"
  | "createdBy"
  | "updatedBy"
  | "uploadedBy"
>;

export type MemoryDirectorySort = "time" | "map" | "tag" | "category";

export type MemoryDirectoryEntry = {
  id: string;
  label: string;
  emoji: string;
  memoryCount: number;
  startPage: number;
  endPage: number;
  targetPageIndex: number;
};

export type ProcessedImageResult = {
  originalFile: File;
  displayBlob: Blob;
  thumbnailBlob: Blob;
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  originalSizeBytes: number;
  displaySizeBytes: number;
  thumbnailSizeBytes: number;
};

export type MemoryUploadStage =
  | "idle"
  | "preparing"
  | "optimising"
  | "uploadingOriginal"
  | "uploadingDisplay"
  | "uploadingThumbnail"
  | "saving"
  | "complete";

export type CreateMemoryDetails = {
  title: string;
  description: string;
  parentMessage: string;
  capturedAt: Date;
  regionId: string | null;
  milestoneId: string | null;
  tags: string[];
  location: Memory["location"];
};
