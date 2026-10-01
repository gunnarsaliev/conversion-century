import { Bath, Bed, Maximize } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const title = "Image Card";

const price = "425000";
const beds = 3;
const baths = 2;
const area = 240;

const Example = () => (
  <Card className="w-full max-w-md overflow-hidden">
    <CardHeader>
      <CardTitle>3-Bedroom House</CardTitle>
      <CardDescription>
        A luxurious 3-bedroom house with a modern design.
      </CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      {/** biome-ignore lint/performance/noImgElement: "Kibo UI is framework agnostic" */}
      <img
        alt=""
        height={1380}
        src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        width={2070}
      />
    </CardContent>
    <CardFooter className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border px-4 py-2">
          <Bed className="h-4 w-4" />
          <span className="text-sm font-medium">{beds}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border px-4 py-2">
          <Bath className="h-4 w-4" />
          <span className="text-sm font-medium">{baths}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border px-4 py-2">
          <Maximize className="h-4 w-4" />
          <span className="text-sm font-medium">{area}m²</span>
        </div>
      </div>
      <p className="text-2xl font-bold">${Number(price).toLocaleString()}</p>
    </CardFooter>
  </Card>
);

export default Example;
