import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Eye,
  FileText,
  Globe,
  Link as LinkIcon,
  MapPin,
  MessageSquare,
  Send,
  Star,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  change?: number;
  icon: "eye" | "users" | "star" | "file" | "message";
}

interface User {
  name: string;
  avatar?: string;
  coverImage?: string;
  role?: string;
  company?: string;
  location?: string;
  joinedAt?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

interface UserProfile9Props {
  user?: User;
  stats?: Stat[];
  className?: string;
}

const statIcons = {
  eye: Eye,
  users: Users,
  star: Star,
  file: FileText,
  message: MessageSquare,
};

const UserProfile9 = ({
  user = {
    name: "Alex Morgan",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
    coverImage:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/pawel-czerwinski-O4fAgtXLRwI-unsplash.jpg",
    role: "Senior Software Engineer",
    company: "Vercel",
    location: "San Francisco, CA",
    joinedAt: "March 2021",
    bio: "Building the future of web development. Open source contributor, TypeScript enthusiast, and coffee addict. Previously at Stripe and Google.",
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      website: "https://example.com",
    },
  },
  stats = [
    { label: "Profile Views", value: "12,847", change: 12.5, icon: "eye" },
    { label: "Followers", value: "8,420", change: 8.2, icon: "users" },
    { label: "Stars Earned", value: "2,156", change: -3.1, icon: "star" },
    { label: "Posts", value: "142", change: 24.8, icon: "file" },
  ],
  className,
}: UserProfile9Props) => {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={cn("w-full max-w-4xl space-y-6", className)}>
      {/* Header Card with Cover */}
      <Card className="overflow-hidden pt-0">
        <div
          className="h-32 bg-muted bg-cover bg-center sm:h-40"
          style={{
            backgroundImage: user.coverImage
              ? `url(${user.coverImage})`
              : undefined,
          }}
        />
        <CardContent className="relative pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <Avatar className="-mt-12 size-24 border-4 border-card shadow-lg sm:-mt-16 sm:size-32">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">
                {user.role}
                {user.company && (
                  <span>
                    {" "}
                    at <span className="font-medium">{user.company}</span>
                  </span>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {user.location}
                  </span>
                )}
                {user.joinedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    Joined {user.joinedAt}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button>Follow</Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p>
          )}

          {/* Social Links */}
          <div className="mt-4 flex items-center gap-2">
            {user.socialLinks?.twitter && (
              <Button variant="ghost" size="icon" className="size-8" render={<a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" />} nativeButton={false}><Send className="size-4" /></Button>
            )}
            {user.socialLinks?.linkedin && (
              <Button variant="ghost" size="icon" className="size-8" render={<a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" />} nativeButton={false}><LinkIcon className="size-4" /></Button>
            )}
            {user.socialLinks?.github && (
              <Button variant="ghost" size="icon" className="size-8" render={<a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" />} nativeButton={false}><LinkIcon className="size-4" /></Button>
            )}
            {user.socialLinks?.website && (
              <Button variant="ghost" size="icon" className="size-8" render={<a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" />} nativeButton={false}><Globe className="size-4" /></Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = statIcons[stat.icon];
          const isPositive = stat.change && stat.change > 0;
          const isNegative = stat.change && stat.change < 0;

          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change !== undefined && (
                  <p
                    className={cn(
                      "mt-1 flex items-center text-xs",
                      isPositive && "text-emerald-600",
                      isNegative && "text-red-600",
                      !isPositive && !isNegative && "text-muted-foreground",
                    )}
                  >
                    {isPositive && <ArrowUp className="mr-1 size-3" />}
                    {isNegative && <ArrowDown className="mr-1 size-3" />}
                    {Math.abs(stat.change)}% from last month
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export { UserProfile9 };
