import { useCallback, useEffect, useState } from "react";
import {
  getSubscription,
  hasAccess,
  isInTrial,
  trialDaysLeft,
  type Subscription,
} from "@/lib/subscription";

interface SubscriptionState {
  access: boolean;
  inTrial: boolean;
  trialDays: number;
  subscription: Subscription | null;
}

function read(): SubscriptionState {
  return {
    access: hasAccess(),
    inTrial: isInTrial(),
    trialDays: trialDaysLeft(),
    subscription: getSubscription(),
  };
}

/** Subscribes to storage events so multiple tabs stay in sync. */
export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(read);

  const refresh = useCallback(() => setState(read()), []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mbd_subscription" || e.key === "mbd_trial_start" || e.key === null) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return { ...state, refresh };
}
