"use client";

import Markdoc, { type Config, type Node } from "@markdoc/markdoc";
import { activeTurn, openInteractions } from "eve/events";
import { useEveAgent } from "eve/react";
import { ArrowUp, Loader2, RotateCcw, Sparkles, Square } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Dashboard AI search — talks to the eve agent in agent/ (/eve/v1/*)
// ---------------------------------------------------------------------------
//
// Read-only questions about the Payload database. The agent answers in
// markdown with relative links to dashboard records.

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

const AiSearch = () => {
  const t = useTranslations("AiSearch");
  const locale = useLocale();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = React.useState("");

  const agent = useEveAgent({
    // Today's date and the UI language, for "last week" and reply language.
    prepareSend: (input) => ({
      ...input,
      clientContext: { today: new Date().toISOString().slice(0, 10), uiLanguage: locale },
    }),
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
    if (!message || isResuming) return;
    setDraft("");
    void agent.send(message);
  };

  const reset = () => {
    agent.newSession();
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

          {agent.error && (
            <p role="alert" className="text-sm text-destructive">
              {t("error")}
            </p>
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
            disabled={isResuming}
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

export { AiSearch };
