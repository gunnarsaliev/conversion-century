"use client";

import Markdoc, { type Config, type Node } from "@markdoc/markdoc";
import { activeTurn, openInteractions } from "eve/events";
import { useEveAgent } from "eve/react";
import { ArrowUp, Loader2, RotateCcw, Sparkles, Square } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { createChat, getChat, saveChat, type SavedChat } from "@/lib/ai-chat-actions";
import { notifyChatsChanged } from "@/lib/ai-chat-events";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Dashboard AI search — talks to the eve agent in agent/ (/eve/v1/*)
// ---------------------------------------------------------------------------
//
// Read-only questions about the Payload database. The agent answers in
// markdown with relative links to dashboard records.
//
// Chat history: each conversation is saved per user in Payload (`ai-chats`,
// src/lib/ai-chat-actions.ts) and lives at `?chat=<id>`. The sidebar's
// recent-chats list (recent-chats.tsx) refreshes on AI_CHATS_CHANGED.

const EXAMPLE_KEYS = ["example1", "example2", "example3", "example4"] as const;

// Every link in an answer opens in a new tab, so the conversation stays put.
const markdocConfig = {
  nodes: {
    link: {
      ...Markdoc.nodes.link,
      transform(node: Node, config: Config) {
        return new Markdoc.Tag(
          "a",
          { ...node.transformAttributes(config), target: "_blank", rel: "noopener noreferrer" },
          node.transformChildren(config),
        );
      },
    },
  },
};

// The agent's markdown, rendered with Markdoc (already used by the docs site).
const Markdown = ({ text }: { text: string }) => {
  const content = React.useMemo(
    () =>
      Markdoc.renderers.react(Markdoc.transform(Markdoc.parse(text), markdocConfig), React),
    [text],
  );
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-a:text-primary-700 prose-a:underline-offset-2 dark:prose-a:text-primary-300 prose-table:text-sm">
      {content}
    </div>
  );
};

type ChatProps = {
  /** A saved chat to resume, or undefined for a new one. */
  chat?: SavedChat;
  /** Called once a new conversation has been saved, with its chat id. */
  onCreated: (id: number) => void;
  /** Starts a new search (clears `?chat`). */
  onNew: () => void;
};

const Chat = ({ chat, onCreated, onNew }: ChatProps) => {
  const t = useTranslations("AiSearch");
  const locale = useLocale();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = React.useState("");

  // Saving: the chat doc is created when eve creates the session, then
  // updated with the stream after every finished turn.
  const chatIdRef = React.useRef<Promise<number | null> | null>(
    chat ? Promise.resolve(chat.id) : null,
  );
  const firstMessageRef = React.useRef("");
  // A restored chat whose eve session has expired can only be read.
  const [expired, setExpired] = React.useState(false);
  const liveTurnFinished = React.useRef(false);

  const agent = useEveAgent({
    initialEvents: chat?.events,
    initialSession: chat?.session ?? undefined,
    resume: Boolean(chat?.session),
    // Today's date and the UI language, for "last week" and reply language.
    prepareSend: (input) => ({
      ...input,
      clientContext: { today: new Date().toISOString().slice(0, 10), uiLanguage: locale },
    }),
    onSessionChange: (session) => {
      if (!session || chatIdRef.current) return;
      chatIdRef.current = createChat({
        sessionId: session.sessionId,
        firstMessage: firstMessageRef.current,
      })
        .then((id) => {
          if (id !== null) {
            onCreated(id);
            notifyChatsChanged();
          }
          return id;
        })
        .catch(() => null);
    },
    onFinish: (snapshot) => {
      liveTurnFinished.current = true;
      void chatIdRef.current?.then((id) => {
        if (id === null) return;
        return saveChat(id, { session: snapshot.session ?? null, events: snapshot.events })
          .then(notifyChatsChanged)
          .catch(() => undefined);
      });
    },
    onError: () => {
      if (chat && !liveTurnFinished.current) setExpired(true);
    },
  });

  const turnOpen = activeTurn(agent.view) !== undefined;
  const isBusy = agent.status === "busy" || turnOpen;
  const isResuming = agent.status === "resuming";
  // Budget prompts and other questions the agent asks the user.
  const pending = openInteractions(agent.view).filter(
    (item) => item.request.kind !== "sign-in" && item.answer === undefined,
  );

  const submit = (text: string) => {
    const message = text.trim();
    if (!message || isResuming || expired) return;
    if (!firstMessageRef.current) firstMessageRef.current = message;
    setDraft("");
    void agent.send(message);
  };

  const reset = () => {
    onNew();
    setDraft("");
    inputRef.current?.focus();
  };

  const hasConversation = agent.messages.length > 0;

  // Keep the newest reply in view above the pinned composer as it streams in.
  const endRef = React.useRef<HTMLDivElement>(null);
  const lastMessage = agent.messages.at(-1);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [agent.messages.length, lastMessage, pending.length]);

  return (
    // Fills the dashboard panel's scroll area (100svh minus the 3.5rem top bar,
    // the main padding p-3/sm:p-4/md:p-6 and, from lg, the panel's p-2 inset
    // and border) so the composer can sit at the bottom even when empty.
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col gap-6",
        "min-h-[calc(100svh-3.5rem-1.5rem)] sm:min-h-[calc(100svh-3.5rem-2rem)]",
        "md:min-h-[calc(100svh-3.5rem-3rem)] lg:min-h-[calc(100svh-3.5rem-4rem-2px)]",
      )}
    >
      {!hasConversation && (
        <div className="my-auto pt-6 text-center">
          <Sparkles className="mx-auto mb-3 size-8 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>
        </div>
      )}

      {hasConversation && (
        <div className="flex flex-col gap-5 pt-6" aria-live="polite">
          {agent.messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl bg-muted px-4 py-2 text-sm whitespace-pre-wrap">
                  {message.parts.map((part) => (part.type === "text" ? part.text : "")).join("")}
                </p>
              </div>
            ) : (
              <div key={message.id} className="flex flex-col gap-2">
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return <Markdown key={part.id ?? index} text={part.text} />;
                  }
                  if (part.type === "tool" && part.kind !== "control") {
                    const running = part.state !== "completed" && part.state !== "failed";
                    return (
                      <p
                        key={part.callId}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        {running ? (
                          <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                        ) : (
                          <Sparkles className="size-3" aria-hidden="true" />
                        )}
                        {running ? t("searching") : t("searched")}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            ),
          )}

          {pending.map(({ interactionId, request }) => (
            <div key={interactionId} className="rounded-lg border p-3 text-sm">
              <p className="mb-2">{request.prompt}</p>
              <div className="flex flex-wrap gap-2">
                {request.options?.map((option) => (
                  <Button
                    key={option.id}
                    size="sm"
                    variant="outline"
                    disabled={isResuming}
                    onClick={() => void agent.respond([{ interactionId, optionId: option.id }])}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {isBusy && agent.messages.at(-1)?.role === "user" && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("thinking")}
            </p>
          )}

          {expired ? (
            <div role="status" className="rounded-lg border p-3 text-sm text-muted-foreground">
              <p>{t("expired")}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={reset}>
                {t("newSearch")}
              </Button>
            </div>
          ) : (
            agent.error && (
              <p role="alert" className="text-sm text-destructive">
                {t("error")}
              </p>
            )
          )}
          {/* scroll-mb clears the pinned composer below. */}
          <div ref={endRef} aria-hidden="true" className="scroll-mb-32" />
        </div>
      )}

      {/* Pinned to the bottom of the panel: suggestions, composer, note. */}
      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 bg-white pt-2 dark:bg-background">
        {!hasConversation && (
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => submit(t(key))}
                className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {t(key)}
              </button>
            ))}
          </div>
        )}

        <form
          className={cn(
            "flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm",
            "focus-within:ring-3 focus-within:ring-ring/40",
          )}
          onSubmit={(event) => {
            event.preventDefault();
            submit(draft);
          }}
        >
          <label htmlFor="ai-search-input" className="sr-only">
            {t("label")}
          </label>
          <textarea
            id="ai-search-input"
            ref={inputRef}
            autoFocus
            rows={1}
            value={draft}
            disabled={isResuming || expired}
            placeholder={hasConversation ? t("followUp") : t("placeholder")}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                submit(draft);
              }
              if (event.key === "Escape" && hasConversation && !isBusy) reset();
            }}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-base outline-none field-sizing-content placeholder:text-muted-foreground"
          />
          {hasConversation && !isBusy && (
            <Button type="button" size="icon" variant="ghost" aria-label={t("newSearch")} onClick={reset}>
              <RotateCcw aria-hidden="true" />
            </Button>
          )}
          {isBusy ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label={t("stop")}
              onClick={() => void agent.cancel()}
            >
              <Square aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" size="icon" aria-label={t("send")} disabled={!draft.trim() || isResuming}>
              <ArrowUp aria-hidden="true" />
            </Button>
          )}
        </form>

        <p className="text-center text-xs text-muted-foreground">{t("readOnly")}</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Host: which chat is open
// ---------------------------------------------------------------------------
//
// useEveAgent reads its session once, so a different chat needs a fresh
// <Chat>. The host remounts it only when `?chat=` points somewhere the
// mounted chat isn't: a new conversation writes its own id into the URL
// (history.replaceState) without remounting mid-answer, while the sidebar's
// links and "New search" switch chats.

// `awaitingUrl`: a chat just created here whose id may not have reached
// useSearchParams yet; until it does, the old URL isn't a navigation.
type Open =
  | { key: number; chatId: null }
  | { key: number; chatId: number; chat?: SavedChat | null; awaitingUrl?: boolean };

const parseChatId = (value: string | null) => {
  const id = value ? Number(value) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
};

const AiSearch = () => {
  const t = useTranslations("AiSearch");
  const router = useRouter();
  const pathname = usePathname();
  const urlChatId = parseChatId(useSearchParams().get("chat"));

  const [open, setOpen] = React.useState<Open>(() =>
    urlChatId === null ? { key: 0, chatId: null } : { key: 0, chatId: urlChatId },
  );

  const awaitingUrl = "awaitingUrl" in open && open.awaitingUrl === true;
  if (awaitingUrl && urlChatId === open.chatId) {
    setOpen({ ...open, awaitingUrl: false });
  } else if (!awaitingUrl && urlChatId !== open.chatId) {
    // The URL moved to another chat (sidebar link, back/forward, New search).
    setOpen(
      urlChatId === null
        ? { key: open.key + 1, chatId: null }
        : { key: open.key + 1, chatId: urlChatId },
    );
  }

  // Load a saved chat the first time it's opened.
  const needsLoad = open.chatId !== null && !("chat" in open);
  React.useEffect(() => {
    if (!needsLoad || open.chatId === null) return;
    let cancelled = false;
    const { key, chatId } = open;
    getChat(chatId)
      .catch(() => null)
      .then((chat) => {
        if (!cancelled) setOpen((current) => (current.key === key ? { key, chatId, chat } : current));
      });
    return () => {
      cancelled = true;
    };
  }, [needsLoad, open]);

  const onCreated = React.useCallback(
    (id: number) => {
      // Same instance keeps streaming: record the id without remounting.
      setOpen((current) => ({ key: current.key, chatId: id, chat: null, awaitingUrl: true }));
      window.history.replaceState(null, "", `${pathname}?chat=${id}`);
    },
    [pathname],
  );

  const onNew = React.useCallback(() => {
    if (open.chatId === null) setOpen((current) => ({ key: current.key + 1, chatId: null }));
    else router.push(pathname);
  }, [open.chatId, pathname, router]);

  if (needsLoad) {
    return (
      <p className="flex items-center justify-center gap-2 pt-24 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {t("loading")}
      </p>
    );
  }

  // `chat: null` is either a chat this instance just created (keep it) or one
  // that couldn't be loaded / isn't the user's (start a new search instead).
  const chat = "chat" in open && open.chat ? open.chat : undefined;
  return <Chat key={open.key} chat={chat} onCreated={onCreated} onNew={onNew} />;
};

export { AiSearch };
