import { useEffect, useRef, useState } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  global_name: string | null;
}

export interface UseDiscordResult {
  sdk: DiscordSDK | null;
  user: DiscordUser | null;
  channelId: string | null;
  guildId: string | null;
  ready: boolean;
  error: string | null;
}

const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID as string | undefined;

export function useDiscord(): UseDiscordResult {
  const sdkRef = useRef<DiscordSDK | null>(null);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [guildId, setGuildId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no client ID is configured, run in dev preview mode with a mock user
    if (!CLIENT_ID) {
      console.warn(
        "[Discord] VITE_DISCORD_CLIENT_ID not set – running in dev mode with a mock user."
      );
      setUser({
        id: "dev-user-1",
        username: "DevUser",
        avatar: null,
        global_name: "Dev User",
      });
      setChannelId("dev-channel");
      setGuildId("dev-guild");
      setReady(true);
      return;
    }

    const sdk = new DiscordSDK(CLIENT_ID);
    sdkRef.current = sdk;

    async function init() {
      try {
        await sdk.ready();

        const { code } = await sdk.commands.authorize({
          client_id: CLIENT_ID!,
          response_type: "code",
          state: "",
          prompt: "none",
          scope: ["identify"],
        });

        // Exchange code for access token via the backend
        const tokenRes = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!tokenRes.ok) throw new Error("Token exchange failed");
        const { access_token } = (await tokenRes.json()) as { access_token: string };

        await sdk.commands.authenticate({ access_token });

        const userRes = await fetch("https://discord.com/api/v10/users/@me", {
          headers: { Authorization: "Bearer " + access_token },
        });
        const discordUser = (await userRes.json()) as DiscordUser;
        setUser(discordUser);

        setChannelId(sdk.channelId);
        setGuildId(sdk.guildId);
        setReady(true);
      } catch (err) {
        console.error("[Discord] Init error:", err);
        setError(String(err));
        // Fallback to an anonymous user so the app remains usable
        setUser({
          id: "fallback-user",
          username: "Anonymous",
          avatar: null,
          global_name: null,
        });
        setReady(true);
      }
    }

    init();
  }, []);

  return {
    sdk: sdkRef.current,
    user,
    channelId,
    guildId,
    ready,
    error,
  };
}
