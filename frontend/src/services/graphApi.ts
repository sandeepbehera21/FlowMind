export const graphEndpoints = {
  messages: "/me/messages",
  chats: "/me/chats",
  chatMessages: (chatId: string) => `/me/chats/${chatId}/messages`
};
