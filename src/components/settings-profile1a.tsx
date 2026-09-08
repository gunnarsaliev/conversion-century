"use client";

import { Info, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface User {
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  timezone?: string;
  startWeekOn?: string;
  email?: string;
}

interface SettingsProfile1aProps {
  heading?: string;
  disclaimer?: string;
  user?: User;
  className?: string;
}

const SettingsProfile1a = ({
  heading = "Your Profile",
  disclaimer = "Any updates made here will be reflected across all your workspaces.",
  user = {
    profilePicture:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
    firstName: "John",
    lastName: "Doe",
    timezone: "UTC",
    startWeekOn: "Monday",
    email: "johndoe@example.com",
  },
  className,
}: SettingsProfile1aProps) => {
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    user.profilePicture,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    }
  };

  const handleRemove = () => {
    setProfilePicture(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="py-32">
      <div className={cn("container max-w-5xl tracking-tight", className)}>
        <div className="flex flex-col gap-3 border-b pb-8">
          <h3 className="text-2xl font-semibold">{heading}</h3>
          <div className="flex w-full items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            <Info className="size-3.5" />
            {disclaimer}
          </div>
        </div>
        <form className="mt-10 flex flex-col items-start gap-8 sm:mt-0 sm:flex-row">
          <div className="flex flex-col items-start gap-4 sm:py-10">
            {profilePicture ? (
              <img
                src={profilePicture}
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
                  disabled={!profilePicture}
                >
                  Remove
                </Button>
              </div>
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                Accepted formats: PNG, JPG, JPEG.
                <br />
                Max size: 10MB.
              </p>
            </div>
          </div>

          <div className="w-full space-y-8 sm:border-l sm:py-10 sm:pl-8">
            <div className="grid gap-4 gap-y-8 border-b pb-8">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" defaultValue={user.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" defaultValue={user.lastName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Primary Email Address</Label>
                <div>
                  <Input id="email" defaultValue={user.email} disabled />
                  <a
                    href="https://shadcnblocks.com"
                    className="text-xs underline"
                  >
                    Update email address
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue={user.timezone}>
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue placeholder="Choose your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="IST">IST</SelectItem>
                    <SelectItem value="EST">EST</SelectItem>
                    <SelectItem value="PST">PST</SelectItem>
                    <SelectItem value="MST">MST</SelectItem>
                    <SelectItem value="CST">CST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-week-on">Start Week On</Label>
                <Select defaultValue={user.startWeekOn}>
                  <SelectTrigger id="start-week-on" className="w-full">
                    <SelectValue placeholder="Choose a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export { SettingsProfile1a };
