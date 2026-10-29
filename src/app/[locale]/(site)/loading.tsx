import { ListingPageSkeleton } from "@/components/skeletons";

// Shown while navigating to a page that isn't prerendered yet; prerendered
// pages come straight from the static shell.
export default function Loading() {
  return <ListingPageSkeleton />;
}
