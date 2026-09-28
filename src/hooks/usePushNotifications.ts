import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  disablePushNotifications,
  enablePushNotifications,
  getPushCapability,
  syncExistingPushSubscription,
  type PushCapability,
  type PushConfig,
} from "../lib/pushNotifications";

export function usePushNotifications(enabled = true) {
  const [capability, setCapability] = useState<PushCapability>("available");
  const [isChanging, setIsChanging] = useState(false);
  const configQuery = useQuery({
    queryKey: ["push-config"],
    queryFn: () => api.get<PushConfig>("/notifications/push/config").then(({ data }) => data),
    enabled,
    staleTime: 5 * 60_000,
  });

  const refreshCapability = useCallback(async () => {
    setCapability(await getPushCapability());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void refreshCapability();
  }, [enabled, refreshCapability]);

  useEffect(() => {
    if (!enabled || !configQuery.data?.enabled) return;
    void syncExistingPushSubscription(configQuery.data.publicKey)
      .then(() => refreshCapability())
      .catch(() => undefined);
  }, [configQuery.data?.enabled, configQuery.data?.publicKey, enabled, refreshCapability]);

  const enable = async () => {
    if (!configQuery.data?.publicKey) throw new Error("Push ainda não foi configurado no servidor.");
    setIsChanging(true);
    try {
      await enablePushNotifications(configQuery.data.publicKey);
      setCapability("subscribed");
    } finally {
      setIsChanging(false);
    }
  };

  const disable = async () => {
    setIsChanging(true);
    try {
      await disablePushNotifications();
      await refreshCapability();
    } finally {
      setIsChanging(false);
    }
  };

  return {
    config: configQuery.data,
    capability,
    isLoading: configQuery.isLoading,
    isChanging,
    enable,
    disable,
  };
}
