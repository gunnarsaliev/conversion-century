import {
  Calendar,
  Globe,
  Link as LinkIcon,
  MapPin,
  Send,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

interface Stats {
  followers: number;
  following: number;
  contributions: number;
}

interface User {
  name: string;
  avatar?: string;
  coverImage?: string;
  role?: string;
  company?: string;
  bio?: string;
  location?: string;
  joinedAt?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
  stats?: Stats;
  isFollowing?: boolean;
}

interface UserProfile3Props {
  user?: User;
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

const UserProfile3 = ({
  user = {
    name: "Alex Morgan",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
    coverImage:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/pawel-czerwinski-O4fAgtXLRwI-unsplash.jpg",
    role: "Design Engineer",
    company: "Linear",
    bio: "Bridging design and engineering to create seamless user experiences. Previously built design systems at Notion and contributed to Radix UI. I write about design tokens, component architecture, and the intersection of aesthetics and functionality.",
    location: "New York, NY",
    joinedAt: "March 2021",
    skills: [
      "React",
      "TypeScript",
      "Figma",
      "Design Systems",
      "CSS",
      "Animation",
    ],
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      website: "https://example.com",
    },
    stats: {
      followers: 8420,
      following: 312,
      contributions: 1247,
    },
    isFollowing: false,
  },
  className,
}: UserProfile3Props) => {
  const socialIcons = [
    { key: "twitter", icon: Send, href: user.socialLinks?.twitter },
    { key: "linkedin", icon: LinkIcon, href: user.socialLinks?.linkedin },
    { key: "github", icon: LinkIcon, href: user.socialLinks?.github },
    { key: "website", icon: Globe, href: user.socialLinks?.website },
  ].filter((item) => item.href);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-card">
          {/* Cover Image */}
          <div className="relative h-32 bg-muted sm:h-40">
            {user.coverImage && (
              <img
                src={user.coverImage}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar - overlapping cover */}
            <div className="-mt-12 mb-4 flex items-end justify-between sm:-mt-14">
              <Avatar className="size-24 border-4 border-card sm:size-28">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button variant={user.isFollowing ? "outline" : "default"}>
                  {user.isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">Message</Button>
              </div>
            </div>

            {/* Name and Role */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">
                {user.role}
                {user.company && (
                  <>
                    {" "}
                    at <span className="font-medium">{user.company}</span>
                  </>
                )}
              </p>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {user.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.joinedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Joined {user.joinedAt}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialIcons.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socialIcons.map(({ key, icon: Icon, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            )}

            {/* Stats */}
            {user.stats && (
              <div className="mt-6 flex gap-6 border-t pt-6">
                <div>
                  <span className="font-semibold">
                    {formatNumber(user.stats.followers)}
                  </span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {formatNumber(user.stats.following)}
                  </span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {formatNumber(user.stats.contributions)}
                  </span>{" "}
                  <span className="text-muted-foreground">Contributions</span>
                </div>
              </div>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3 text-sm font-medium">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { UserProfile3 };
