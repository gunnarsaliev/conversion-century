import { cacheLife, cacheTag } from "next/cache";

export type GoogleReview = {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  text: string;
  date: string;
};

type ApiReview = {
  reviewId: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating?: string;
  comment?: string;
  createTime: string;
};

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const MIN_RATING = 4;
const MAX_PAGES = 4; // 50 per page

// Reviews in another language come back as "(Translated by Google) <translation>
// \n\n(Original)\n<original>" or "<original>\n\n(Translated by Google)\n<translation>".
// Keep the reviewer's own words.
const originalText = (comment: string) => {
  const [, original] = comment.split("(Original)");
  return (original ?? comment).split("(Translated by Google)")[0].trim();
};

async function accessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.GOOGLE_BUSINESS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_BUSINESS_REFRESH_TOKEN!,
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

// The business's Google reviews, newest first: 4–5 stars with a comment only.
// Read from the Business Profile API with the owner's refresh token and cached
// for an hour, so new reviews appear without a deploy. Without credentials, or
// when Google errors, returns [] (cached briefly) and the page renders without
// them.
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("google-reviews");

  const {
    GOOGLE_BUSINESS_CLIENT_ID,
    GOOGLE_BUSINESS_CLIENT_SECRET,
    GOOGLE_BUSINESS_REFRESH_TOKEN,
    GOOGLE_BUSINESS_ACCOUNT_ID,
    GOOGLE_BUSINESS_LOCATION_ID,
  } = process.env;
  if (
    !GOOGLE_BUSINESS_CLIENT_ID ||
    !GOOGLE_BUSINESS_CLIENT_SECRET ||
    !GOOGLE_BUSINESS_REFRESH_TOKEN ||
    !GOOGLE_BUSINESS_ACCOUNT_ID ||
    !GOOGLE_BUSINESS_LOCATION_ID
  ) {
    return [];
  }

  try {
    const token = await accessToken();
    const url = `https://mybusiness.googleapis.com/v4/accounts/${GOOGLE_BUSINESS_ACCOUNT_ID}/locations/${GOOGLE_BUSINESS_LOCATION_ID}/reviews`;
    const reviews: ApiReview[] = [];
    let pageToken: string | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
      const params = new URLSearchParams({ pageSize: "50", orderBy: "updateTime desc" });
      if (pageToken) params.set("pageToken", pageToken);
      const res = await fetch(`${url}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`reviews ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as { reviews?: ApiReview[]; nextPageToken?: string };
      reviews.push(...(data.reviews ?? []));
      pageToken = data.nextPageToken;
      if (!pageToken) break;
    }

    return reviews
      .map((review) => ({
        id: review.reviewId,
        name: review.reviewer?.displayName || "Google user",
        photo: review.reviewer?.isAnonymous ? undefined : review.reviewer?.profilePhotoUrl,
        rating: STARS[review.starRating ?? ""] ?? 0,
        text: originalText(review.comment ?? ""),
        date: review.createTime,
      }))
      .filter((review) => review.rating >= MIN_RATING && review.text.length > 0)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error("[google-reviews]", error);
    cacheLife("minutes");
    return [];
  }
}
