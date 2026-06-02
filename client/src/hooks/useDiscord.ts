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
const DISCORD_INIT_TIMEOUT_MS = 10000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = window.setTimeout(() => {
      reject(new Error(`Discord initialization timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(id);
        reject(err);
      });
  });
}

export function useDiscord(): UseDiscordResult {
  const sdkRef = useRef<DiscordSDK | null>(null);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [guildId, setGuildId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no client ID is configured, run in dev preview mode with a unique per-session mock user
    if (!CLIENT_ID) {
      console.warn(
        "[Discord] VITE_DISCORD_CLIENT_ID not set – running in dev mode with a mock user."
      );

      const DEV_USER_KEY = "mission-planer:dev-user";
      let devUser: DiscordUser | null = null;
      try {
        const stored = localStorage.getItem(DEV_USER_KEY);
        if (stored) devUser = JSON.parse(stored) as DiscordUser;
      } catch {
        // ignore parse errors
      }

      if (!devUser) {
        const uuid = crypto.randomUUID();
        const shortId = uuid.slice(0, 8);
        devUser = {
          id: `dev-user-${shortId}`,
          username: `DevUser_${shortId}`,
          avatar: null,
          global_name: `DevUser_${shortId}`,
        };
        try {
          localStorage.setItem(DEV_USER_KEY, JSON.stringify(devUser));
        } catch {
          // ignore storage errors
        }
      }

      setUser(devUser);
      setChannelId("dev-channel");
      setGuildId("dev-guild");
      setReady(true);
      return;
    }

    const sdk = new DiscordSDK(CLIENT_ID);
    sdkRef.current = sdk;

    async function init() {
      try {
        await withTimeout(sdk.ready(), DISCORD_INIT_TIMEOUT_MS);

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
        const { access_token } = (await tokenRes.json()) as { access_token?: string };
        if (!access_token) {
          throw new Error("Token exchange succeeded without an access token");
        }

        // authenticate returns the current user directly — use it as the primary source
        const auth = await sdk.commands.authenticate({ access_token });
        let discordUser: DiscordUser = auth.user as DiscordUser;

        // Fall back to a direct API call if the SDK didn't return user info
        if (!discordUser?.id) {
          const userRes = await fetch("https://discord.com/api/v10/users/@me", {
            headers: { Authorization: "Bearer " + access_token },
          });
          discordUser = (await userRes.json()) as DiscordUser;
        }

        setUser(discordUser);

        setChannelId(sdk.channelId);
        setGuildId(sdk.guildId);
        setReady(true);
      } catch (err) {
        console.error("[Discord] Init error:", err);
        setError(err instanceof Error ? err.message : String(err));
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
