import { useCallback, useEffect, useState } from "react";
import {
  getSubscription,
  hasAccess,
  isInTrial,
  trialDaysLeft,
  canGenerateStory,
  dailyStoriesLeft,
  dailyStoriesUsed,
  FREE_DAILY_LIMIT,
  type Subscription,
} from "@/lib/subscription";

interface SubscriptionState {
  access: boolean;
  inTrial: boolean;
  trialDays: number;
  subscription: Subscription | null;
  canGenerate: boolean;
  storiesLeft: number;
  storiesUsed: number;
  dailyLimit: number;
}

function read(): SubscriptionState {
  return {
    access:       hasAccess(),
    inTrial:      isInTrial(),
    trialDays:    trialDaysLeft(),
    subscription: getSubscription(),
    canGenerate:  canGenerateStory(),
    storiesLeft:  dailyStoriesLeft(),
    storiesUsed:  dailyStoriesUsed(),
    dailyLimit:   FREE_DAILY_LIMIT,
  };
}

/** Subscribes to storage events so multiple tabs stay in sync. */
export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(read);

  const refresh = useCallback(() => setState(read()), []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "mbd_subscription" ||
        e.key === "mbd_trial_start"  ||
        e.key === "mbd_daily_stories" ||
        e.key === null
      ) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return { ...state, refresh };
}
