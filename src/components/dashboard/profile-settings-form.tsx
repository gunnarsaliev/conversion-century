"use client";

import { Info, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { updateProfile } from "@/app/[locale]/(frontend)/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Profile settings form
// ---------------------------------------------------------------------------
//
// Adapted from settings-profile1a.tsx for the logged-in user: avatar upload
// (wired to the media collection), first/last name, job title, and a
// read-only email field (email changes aren't supported by this form).
// Submits to the updateProfile server action.

type ProfileSettingsUser = {
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  email: string;
  avatarUrl?: string | null;
};

type ProfileSettingsFormProps = {
  user: ProfileSettingsUser;
  heading?: string;
  disclaimer?: string;
};

const ProfileSettingsForm = ({
  user,
  heading = "Your Profile",
  disclaimer = "Any updates made here will be reflected across the dashboard.",
}: ProfileSettingsFormProps) => {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl ?? null,
  );
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Controlled fields, seeded from `user`. If `user` changes (e.g. after a
  // save triggers router.refresh()), the caller should remount this
  // component with a fresh `key` rather than relying on props to update
  // state after mount — an uncontrolled input's defaultValue can't change
  // after mount without a base-ui warning, and syncing state from props via
  // an effect causes an extra render.
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [jobTitle, setJobTitle] = useState(user.jobTitle ?? "");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarRemoved(false);
    }
  };

  const handleRemove = () => {
    setAvatarPreview(null);
    setAvatarRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    if (avatarRemoved) {
      formData.set("removeAvatar", "true");
    }

    const result = await updateProfile(formData);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setAvatarRemoved(false);
    router.refresh();
  };

  return (
    <div className="tracking-tight">
      <div className="flex flex-col gap-3 border-b pb-8">
        <h3 className="text-2xl font-semibold">{heading}</h3>
        <div className="flex w-full items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
          <Info className="size-3.5" />
          {disclaimer}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-10 flex flex-col items-start gap-8 sm:mt-0 sm:flex-row"
      >
        <div className="flex flex-col items-start gap-4 sm:py-10">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatarPreview can be a blob: URL (local file preview), which next/image cannot render.
            <img
              src={avatarPreview}
              alt={user.firstName}
              className="size-30 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-30 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-lg font-semibold">Avatar</p>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                name="avatar"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button type="button" onClick={handleUploadClick}>
                <Upload /> Choose Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={!avatarPreview}
              >
                Remove
              </Button>
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Accepted formats: PNG, JPG, JPEG.
            </p>
          </div>
        </div>

        <div className="w-full space-y-8 sm:border-l sm:py-10 sm:pl-8">
          <div className="grid gap-4 gap-y-8 border-b pb-8">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Primary Email Address</Label>
              <Input id="email" value={user.email} disabled readOnly />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-600">Profile updated.</p>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { ProfileSettingsForm };
