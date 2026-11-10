"use client";

import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronsUpDown,
  LogOut,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Search,
  Settings,
  Share,
  SquarePen,
  Trash2,
  User,
} from "lucide-react";
import * as React from "react";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const person1 = {
  name: "Jack Walsh",
  firstName: "Jack",
  lastName: "Walsh",
  initials: "JW",
  email: "jack.walsh@example.com",
  username: "jackwalsh",
  role: "Product Designer",
  company: "Cartwright",
  location: "Brisbane, Australia",
  avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar1.webp",
};

const user = {
  name: person1.name,
  email: person1.email,
  avatar: person1.avatar,
};

const models = [
  {
    id: "fast",
    name: "Swift",
    description: "Quick answers for everyday tasks",
  },
  {
    id: "pro",
    name: "Swift Pro",
    description: "Deeper reasoning for hard work",
  },
  { id: "mini", name: "Swift Mini", description: "Lightweight and low cost" },
];

const chatGroups = [
  {
    label: "Today",
    chats: ["Quarterly report outline", "Fix flaky checkout test"],
  },
  {
    label: "Yesterday",
    chats: ["Onboarding email sequence", "Postgres index strategy"],
  },
  {
    label: "Previous 7 days",
    chats: [
      "Pricing page copy ideas",
      "Trip plan for Lisbon",
      "Explain React server components",
      "Interview questions for designers",
    ],
  },
  {
    label: "Previous 30 days",
    chats: ["Brand naming brainstorm", "Weekly meal prep list"],
  },
];

const messages = [
  { role: "user", lines: ["w-2/3"] },
  { role: "assistant", lines: ["w-full", "w-full", "w-5/6", "w-2/3"] },
  { role: "user", lines: ["w-1/2"] },
  {
    role: "assistant",
    lines: ["w-full", "w-11/12", "w-full", "w-3/4", "w-1/2"],
  },
  { role: "user", lines: ["w-3/5", "w-2/5"] },
  { role: "assistant", lines: ["w-full", "w-4/5"] },
];

const NavUser = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground" />}><Avatar className="size-8 rounded-lg">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback className="rounded-lg">
                                    {person1.initials}
                                  </AvatarFallback>
                                </Avatar><div className="grid flex-1 text-left text-sm leading-tight">
                                  <span className="truncate font-medium">{user.name}</span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    Plus plan
                                  </span>
                                </div><ChevronsUpDown className="ml-auto size-4" /></DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {person1.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const ChatActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}><MoreHorizontal /><span className="sr-only">More</span></DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" side="right" align="start">
        <DropdownMenuItem>
          <Share className="size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil className="size-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img
            src="https://cdn.shadcnblocks.com/shadcnblocks/block/logos/shadcnblocks-logo.svg"
            alt="Shadcnblocks"
            className="size-6 dark:invert"
          />
          <span className="text-sm font-semibold">Shadcnblocks</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SquarePen />
              <span>New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Search />
              <span>Search chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {chatGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.chats.map((chat, chatIndex) => (
                <SidebarMenuItem key={chat}>
                  <SidebarMenuButton
                    isActive={groupIndex === 0 && chatIndex === 0}
                  >
                    <span>{chat}</span>
                  </SidebarMenuButton>
                  <ChatActions />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const ModelPicker = () => {
  const [model, setModel] = React.useState(models[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="gap-1 px-2 text-base font-semibold" />}>{model.name}<ChevronDown className="size-4 text-muted-foreground" /></DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Model</DropdownMenuLabel>
        {models.map((item) => (
          <DropdownMenuItem key={item.id} onSelect={() => setModel(item)}>
            <div className="grid flex-1 gap-0.5">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.description}
              </span>
            </div>
            {item.id === model.id && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Composer = () => {
  return (
    <InputGroup className="rounded-2xl bg-background shadow-sm">
      <InputGroupTextarea
        placeholder="Ask anything"
        className="min-h-14"
        aria-label="Message"
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton variant="ghost" size="icon-sm" aria-label="Attach">
          <Paperclip />
        </InputGroupButton>
        <InputGroupButton
          variant="default"
          size="icon-sm"
          className="ml-auto rounded-full"
          aria-label="Send"
        >
          <ArrowUp />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

interface ApplicationShell21Props {
  className?: string;
}

export function ApplicationShell21({ className }: ApplicationShell21Props) {
  return (
    <SidebarProvider className={cn(className)}>
      <AppSidebar />
      <SidebarInset className="h-svh">
        <header className="flex h-14 shrink-0 items-center gap-1 px-3">
          <SidebarTrigger />
          <ModelPicker />
          <Button variant="ghost" size="sm" className="ml-auto">
            <Share className="size-4" />
            Share
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div key={index} className="flex justify-end">
                  <div className="flex w-3/4 flex-col items-end gap-2 sm:w-1/2">
                    {message.lines.map((width, lineIndex) => (
                      <div
                        key={lineIndex}
                        className={cn("h-10 rounded-2xl bg-muted", width)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div key={index} className="flex gap-3">
                  <div className="size-7 shrink-0 rounded-full bg-muted" />
                  <div className="flex flex-1 flex-col gap-2.5 pt-1">
                    {message.lines.map((width, lineIndex) => (
                      <div
                        key={lineIndex}
                        className={cn("h-3 rounded-full bg-muted/70", width)}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4">
          <Composer />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Swift can make mistakes. Check important info.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
