"use client";

import { Check, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";

import { updateProfile } from "@/app/[locale]/(frontend)/dashboard/settings/actions";
import {
  fieldClassName,
  labelClassName,
  legendClassName,
  sectionClassName,
  submitButtonClassName,
  textareaClassName,
} from "@/components/form-styles";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ABOUT_MAX_LENGTH } from "@/lib/profile-settings";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Profile settings form
// ---------------------------------------------------------------------------
//
// The logged-in user's own profile, styled like the offer form (shared
// form-styles: one card, sections split by rules, soft filled fields):
// photo (wired to the media collection), personal info with a read-only
// email, about, and important dates (birthday, work birthday — shown on the
// team pages and used for the dashboard celebration banners). Saves through
// the updateProfile server action once something has changed; "Discard"
// resets to the saved values. Status, role and documents are managed by
// admins in /admin, not here.

type ProfileSettingsUser = {
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  about?: string | null;
  /** "YYYY-MM-DD", as used by <input type="date">; "" when unset. */
  birthday: string;
  workBirthday: string;
  email: string;
  avatarUrl?: string | null;
};

type ProfileSettingsFormProps = {
  user: ProfileSettingsUser;
  className?: string;
};

function FormField({
  id,
  label,
  description,
  children,
}: {
  id: string;
  label: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className={labelClassName}>
        {label}
      </FieldLabel>
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

const ProfileSettingsForm = ({ user, className }: ProfileSettingsFormProps) => {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl ?? null,
  );
  const [avatarChanged, setAvatarChanged] = useState(false);
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
  const [about, setAbout] = useState(user.about ?? "");
  const [birthday, setBirthday] = useState(user.birthday);
  const [workBirthday, setWorkBirthday] = useState(user.workBirthday);

  const isDirty =
    avatarChanged ||
    firstName !== user.firstName ||
    lastName !== user.lastName ||
    jobTitle !== (user.jobTitle ?? "") ||
    about !== (user.about ?? "") ||
    birthday !== user.birthday ||
    workBirthday !== user.workBirthday;

  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() ||
    user.email[0]?.toUpperCase();

  // Any edit clears the last save's confirmation.
  const change = (setter: (value: string) => void, value: string) => {
    setSuccess(false);
    setter(value);
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarChanged(true);
      setAvatarRemoved(false);
      setSuccess(false);
    }
  };

  const handleRemove = () => {
    setAvatarPreview(null);
    setAvatarChanged(true);
    setAvatarRemoved(true);
    setSuccess(false);
    clearFileInput();
  };

  const handleDiscard = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setJobTitle(user.jobTitle ?? "");
    setAbout(user.about ?? "");
    setBirthday(user.birthday);
    setWorkBirthday(user.workBirthday);
    setAvatarPreview(user.avatarUrl ?? null);
    setAvatarChanged(false);
    setAvatarRemoved(false);
    setError(null);
    clearFileInput();
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
    setAvatarChanged(false);
    setAvatarRemoved(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <FieldGroup className="gap-8">
        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>Profile photo</FieldLegend>
          <FieldDescription>
            Shown on your team card, in the sidebar and across the dashboard.
          </FieldDescription>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatarPreview can be a blob: URL (local file preview), which next/image cannot render.
              <img
                src={avatarPreview}
                alt={firstName}
                className="size-20 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-muted/60 text-xl font-semibold text-muted-foreground">
                {initials}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  name="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-full px-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload aria-hidden="true" /> Upload photo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-full px-4 text-muted-foreground"
                  onClick={handleRemove}
                  disabled={!avatarPreview}
                >
                  <Trash2 aria-hidden="true" /> Remove
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">PNG or JPG. A square image works best.</p>
            </div>
          </div>
        </FieldSet>

        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>Personal information</FieldLegend>
          <FieldGroup>
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <FormField id="firstName" label="First name">
                <Input
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => change(setFirstName, event.target.value)}
                  className={fieldClassName}
                />
              </FormField>
              <FormField id="lastName" label="Last name">
                <Input
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => change(setLastName, event.target.value)}
                  className={fieldClassName}
                />
              </FormField>
            </div>
            <FormField id="jobTitle" label="Job title">
              <Input
                id="jobTitle"
                name="jobTitle"
                autoComplete="organization-title"
                placeholder="e.g. SEO Specialist"
                value={jobTitle}
                onChange={(event) => change(setJobTitle, event.target.value)}
                className={fieldClassName}
              />
            </FormField>
            <FormField
              id="email"
              label="Email address"
              description="Your sign-in email. Ask an admin if it needs to change."
            >
              <Input
                id="email"
                value={user.email}
                disabled
                readOnly
                className={cn(fieldClassName, "disabled:opacity-70")}
              />
            </FormField>
          </FieldGroup>
        </FieldSet>

        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>About</FieldLegend>
          <FormField
            id="about"
            label="Bio"
            description={
              <span className="flex justify-between gap-3">
                <span>A short introduction for your team profile. Line breaks are kept.</span>
                <span
                  className={cn(
                    "shrink-0 tabular-nums",
                    about.length > ABOUT_MAX_LENGTH && "text-destructive",
                  )}
                >
                  {about.length}/{ABOUT_MAX_LENGTH}
                </span>
              </span>
            }
          >
            <Textarea
              id="about"
              name="about"
              rows={5}
              placeholder="What you work on, what you're great at, what you enjoy outside work…"
              value={about}
              onChange={(event) => change(setAbout, event.target.value)}
              className={textareaClassName}
            />
          </FormField>
        </FieldSet>

        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>Important dates</FieldLegend>
          <FieldDescription>
            Celebrated on the dashboard. Only the day and month of your birthday are shown.
          </FieldDescription>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <FormField id="birthday" label="Birthday">
              <Input
                id="birthday"
                name="birthday"
                type="date"
                autoComplete="bday"
                value={birthday}
                onChange={(event) => change(setBirthday, event.target.value)}
                className={fieldClassName}
              />
            </FormField>
            <FormField id="workBirthday" label="Work birthday" description="The day you joined the team.">
              <Input
                id="workBirthday"
                name="workBirthday"
                type="date"
                value={workBirthday}
                onChange={(event) => change(setWorkBirthday, event.target.value)}
                className={fieldClassName}
              />
            </FormField>
          </div>
        </FieldSet>

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
          <p
            role="status"
            className={cn(
              "flex items-center gap-1.5 text-sm sm:mr-auto",
              error ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {error ? (
              error
            ) : success ? (
              <>
                <Check className="size-4 text-emerald-600" aria-hidden="true" />
                Profile updated
              </>
            ) : isDirty ? (
              "You have unsaved changes"
            ) : null}
          </p>
          <Button
            type="button"
            variant="outline"
            className={cn(submitButtonClassName, "px-6")}
            onClick={handleDiscard}
            disabled={isSubmitting || !isDirty}
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={!isDirty}
            loading={isSubmitting}
            loadingText="Saving…"
            className={cn(submitButtonClassName, "text-white")}
          >
            Save changes
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export { ProfileSettingsForm };
