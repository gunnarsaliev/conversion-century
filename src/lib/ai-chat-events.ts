// Fired on window when an AI search chat is created, saved or deleted, so the
// sidebar's recent-chats list (components/dashboard/recent-chats.tsx) reloads.
export const AI_CHATS_CHANGED = "ai-chats:changed";

export const notifyChatsChanged = () => window.dispatchEvent(new Event(AI_CHATS_CHANGED));
