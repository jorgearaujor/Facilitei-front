import { api, ensureCsrfToken } from "./api";

export type PushConfig = {
  enabled: boolean;
  publicKey: string;
  subscribed: boolean;
};

export type PushCapability = "unsupported" | "denied" | "available" | "subscribed";

const supported = () =>
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

function applicationServerKey(value: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
}

function usesApplicationServerKey(subscription: PushSubscription, publicKey: string) {
  const current = subscription.options.applicationServerKey;
  if (!current) return false;
  const expected = applicationServerKey(publicKey);
  const actual = new Uint8Array(current);
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function subscriptionPayload(subscription: PushSubscription) {
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
    throw new Error("Assinatura push incompleta.");
  }
  return {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
    userAgent: navigator.userAgent,
  };
}

export async function getPushCapability(): Promise<PushCapability> {
  if (!supported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const registration = await navigator.serviceWorker.ready;
  return (await registration.pushManager.getSubscription()) ? "subscribed" : "available";
}

async function removeSubscription(subscription: PushSubscription): Promise<void> {
  try {
    await ensureCsrfToken();
    await api.post("/notifications/push/unsubscribe", subscriptionPayload(subscription));
  } finally {
    await subscription.unsubscribe();
  }
}

export async function syncExistingPushSubscription(publicKey: string): Promise<boolean> {
  if (!supported() || Notification.permission !== "granted") return false;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return false;
  if (!usesApplicationServerKey(subscription, publicKey)) {
    await removeSubscription(subscription);
    return false;
  }
  await ensureCsrfToken();
  await api.post("/notifications/push/subscriptions", subscriptionPayload(subscription));
  return true;
}

export async function enablePushNotifications(publicKey: string): Promise<void> {
  if (!supported()) throw new Error("Este navegador não oferece suporte a notificações push.");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Permissão de notificações não concedida.");

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (subscription && !usesApplicationServerKey(subscription, publicKey)) {
    await removeSubscription(subscription);
    subscription = null;
  }
  subscription ??= await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey(publicKey),
  });
  await ensureCsrfToken();
  await api.post("/notifications/push/subscriptions", subscriptionPayload(subscription));
}

export async function disablePushNotifications(): Promise<void> {
  if (!supported()) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;
  await removeSubscription(subscription);
}
