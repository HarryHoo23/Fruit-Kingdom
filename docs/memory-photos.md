# Private memory photos

Memory photos are stored under `families/hailey-family/memories/{memoryId}` and are intended only for approved, active family members.

The original file is retained privately for long-term storage and may still contain camera metadata. The generated display and thumbnail WebP files are rendered through Canvas, which intentionally does not copy EXIF, device, or GPS metadata. Location is stored only when a parent enters it in the form.

Firebase Storage download URLs contain bearer-style access tokens. Treat these URLs as private secrets: do not publish, log, or intentionally share them. Revoking a leaked URL requires rotating its Storage download token in Firebase.

The current upload flow supports JPEG, PNG, and WebP up to 25 MB. HEIC and HEIF are not decoded or uploaded; parents should export a JPEG version first.
