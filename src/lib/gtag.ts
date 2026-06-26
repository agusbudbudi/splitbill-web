import { sendGAEvent } from "@next/third-parties/google";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Log a custom event to Google Analytics
 * @param eventName Name of the event
 * @param eventParams Additional parameters for the event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA Event]: ${eventName}`, eventParams);
    }
    window.gtag("event", eventName, eventParams);
  }
};

/**
 * Identify user with User-ID and set base properties
 * @param userId Unique identifier for the user
 * @param properties Additional user properties
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA Identify]: ${userId}`, properties);
    }
    window.gtag("set", {
      user_id: userId,
      uid: userId,
    });
    window.gtag("config", GA_MEASUREMENT_ID!, {
      user_id: userId,
      uid: userId,
    });
    if (properties) {
      setUserProperties(properties);
    }
  }
};

/**
 * Clear user identification (on logout)
 */
export const clearUser = () => {
  if (typeof window !== "undefined" && window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log("[GA Clear User]");
    }
    window.gtag("set", {
      user_id: null,
      uid: null,
    });
    window.gtag("config", GA_MEASUREMENT_ID!, {
      user_id: null,
    });
  }
};

/**
 * Set user properties
 * @param properties Key-value pairs of user attributes
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log("[GA User Properties]:", properties);
    }
    window.gtag("set", "user_properties", properties);
  }
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Predefined Event Trackers for Consistency
 */
export const trackAuth = {
  login: () => trackEvent("user_login", { method: "email" }),
  signUp: () => trackEvent("user_signup", { method: "email" }),
  googleLoginClicked: () => trackEvent("user_login_click", { method: "google" }),
  googleLoginSuccess: () => trackEvent("user_login", { method: "google" }),
  googleLoginFailed: (reason?: string) => trackEvent("user_login_failed", { method: "google", reason }),
  googleRegistrationSuccess: () => trackEvent("user_signup", { method: "google" }),
  splitbillFinalizeAfterGoogleLogin: () => trackEvent("bill_finalize_after_google_login"),
  logoutSuccess: () => trackEvent("user_logout"),
};

export const trackSubscription = {
  viewPlans: () => trackEvent("subscription_plans_viewed"),
  initiateCheckout: (planId: string) => trackEvent("checkout_initiated", { plan_id: planId }),
  purchaseSuccess: (planId: string, amount: number) => trackEvent("purchase_completed", { plan_id: planId, amount }),
  premiumFeatureClick: (featureName: string) => trackEvent("premium_feature_click", { feature_name: featureName }),
};

export const trackSplitBill = {
  start: () => trackEvent("bill_funnel_start", { flow_type: "wizard" }),
  stepComplete: (stepNumber: number, stepName: string) => 
    trackEvent("bill_step_completed", { flow_type: "wizard", step_number: stepNumber, step_name: stepName }),
  aiScan: (
    status: "start" | "success" | "error", 
    retryCount?: number, 
    source?: "camera" | "gallery",
    duration?: number,
    itemCount?: number
  ) => {
    if (status === "start") {
      trackEvent("bill_scan_started", { 
        flow_type: "wizard", 
        image_source: source || "unknown" 
      });
    } else {
      trackEvent("bill_scan_completed", { 
        flow_type: "wizard",
        status, 
        retry_count: retryCount || 0,
        image_source: source || "unknown",
        duration_ms: duration,
        item_count: itemCount
      });
    }
  },
  aiRetry: () => trackEvent("bill_scan_retry", { flow_type: "wizard" }),
  aiImport: (itemCount?: number, merchantName?: string) => 
    trackEvent("bill_scan_completed", { 
      flow_type: "wizard",
      status: "success",
      item_count: itemCount,
      merchant_name: merchantName,
      has_merchant: !!merchantName
    }),
  selectImage: (source: "camera" | "gallery") => trackEvent("bill_image_selected", { flow_type: "wizard", image_source: source }),
  removeImage: () => trackEvent("bill_image_removed", { flow_type: "wizard" }),
  quickPickActivity: (name: string) => trackEvent("bill_quick_pick_activity", { flow_type: "wizard", activity_name: name }),
  calculate: (params: { total_amount: number; num_participants: number }) => 
    trackEvent("bill_calculated", { 
      flow_type: "wizard",
      total_amount: params.total_amount,
      participant_count: params.num_participants
    }),
  autofillView: (name: string) => trackEvent("bill_autofill_view", { flow_type: "wizard", name }),
  inputMethod: (method: "ai" | "manual") => trackEvent("bill_input_method", { flow_type: "wizard", method }),
  save: (params: { total_amount: number; num_participants: number; num_items: number; activity_name: string }) => 
    trackEvent("bill_created", { 
      flow_type: "wizard",
      total_amount: params.total_amount,
      participant_count: params.num_participants,
      item_count: params.num_items,
      activity_name: params.activity_name
    }),
  share: (method: "share_api" | "copy_link" | "download_image" | "share_button", id: string) => 
    trackEvent("bill_shared", { flow_type: "wizard", share_method: method, bill_id: id }),
  reEntry: () => trackEvent("bill_re_entry", { flow_type: "wizard" }),
  monitorStatus: (id?: string) => trackEvent("bill_monitor_status_click", { flow_type: "wizard", bill_id: id }),
  validationError: (step: number, errorMessage: string) => 
    trackEvent("bill_validation_error", { flow_type: "wizard", step, error_message: errorMessage }),
  finalizeModalView: () => trackEvent("bill_finalize_modal_view", { flow_type: "wizard" }),
  finalizeConfirm: () => trackEvent("bill_finalize_modal_confirm", { flow_type: "wizard" }),
  finalizeCancel: () => trackEvent("bill_finalize_modal_cancel", { flow_type: "wizard" }),
  restart: () => trackEvent("bill_restart", { flow_type: "wizard" }),
  delete: (id: string) => trackEvent("bill_delete", { flow_type: "wizard", bill_id: id }),
  toggleDetails: (name: string, isOpen: boolean) => 
    trackEvent("bill_toggle_person_details", { flow_type: "wizard", person_name: name, is_open: isOpen }),
};

export const trackPublic = {
  openBill: (billId: string) => trackEvent("bill_open_public", { bill_id: billId }),
};

export const trackSocial = {
  addFriend: () => trackEvent("social_add_friend"),
  useSuggestion: (type: "friend" | "group") => trackEvent("social_use_suggestion", { type }),
  tutorialComplete: () => trackEvent("tutorial_complete"),
};

export const trackGeneral = {
  appEntry: () => trackEvent("app_entry"),
  viewHistory: () => trackEvent("history_viewed"),
  reviewBannerClick: () => trackEvent("review_banner_click"),
  reviewBannerClose: () => trackEvent("review_banner_close"),
};

export const trackWallet = {
  addMethodInitiate: () => trackEvent("payment_method_add_started"),
  addMethod: (type: string) => trackEvent("payment_method_added", { method_type: type }),
  selectPaymentMethod: (id: string, isSelected: boolean) => 
    trackEvent("payment_method_selected", { method_id: id, is_selected: isSelected }),
  copyAccount: (provider: string) => trackEvent("payment_method_account_copied", { provider }),
  dropOff: () => trackEvent("payment_method_drop_off"),
};

export const trackMarketing = {
  setPersona: (persona: string) => setUserProperties({ marketing_persona: persona }),
  setSocialEngagement: (bestiesCount: number) => setUserProperties({ besties_count: bestiesCount }),
  setUsageIntensity: (totalBills: number) => setUserProperties({ total_bills_created: totalBills }),
};

/**
 * Chat Split Bill (Agent Billy) event trackers
 * Prefix: chat_ -> Standardized under bill_* events with flow_type: "chat"
 */
export const trackChatBill = {
  open: (params: {
    referrer_page: string;
    wizard_step?: number;
  }) => trackEvent("bill_funnel_start", { 
    flow_type: "chat", 
    entry_point: params.referrer_page, 
    wizard_step: params.wizard_step 
  }),

  friendsConfirmed: (params: { participant_count: number }) =>
    trackEvent("bill_friends_confirmed", { 
      flow_type: "chat", 
      participant_count: params.participant_count 
    }),

  scanImageSelected: (source: "camera" | "gallery") =>
    trackEvent("bill_scan_started", { flow_type: "chat", image_source: source }),

  scanStarted: (params: { source: "camera" | "gallery" | "unknown" }) =>
    trackEvent("bill_scan_started", { flow_type: "chat", image_source: params.source }),

  scanFallbackManual: () => trackEvent("bill_scan_fallback_manual", { flow_type: "chat" }),

  scanRetried: (params: { source: "camera" | "gallery" | "unknown" }) =>
    trackEvent("bill_scan_retry", { flow_type: "chat", image_source: params.source }),

  scanReset: () => trackEvent("bill_scan_reset", { flow_type: "chat" }),

  scanAccepted: (params: {
    item_count: number;
    additional_item_count: number;
    has_merchant: boolean;
  }) => trackEvent("bill_scan_completed", { 
    flow_type: "chat", 
    status: "success",
    item_count: params.item_count,
    additional_item_count: params.additional_item_count,
    has_merchant: params.has_merchant
  }),

  itemsAssigned: (params: { total_items: number }) =>
    trackEvent("bill_items_assigned", { 
      flow_type: "chat", 
      item_count: params.total_items 
    }),

  taxMethodConfirmed: (params: {
    additional_item_count: number;
    methods: string;
  }) => trackEvent("bill_tax_confirmed", { 
    flow_type: "chat", 
    additional_item_count: params.additional_item_count,
    tax_methods: params.methods
  }),

  activityConfirmed: (params: {
    activity_name: string;
    used_quick_pick: boolean;
    quick_pick_value?: string;
  }) => trackEvent("bill_activity_confirmed", { 
    flow_type: "chat", 
    activity_name: params.activity_name,
    used_quick_pick: params.used_quick_pick,
    quick_pick_value: params.quick_pick_value
  }),

  paymentSkipped: () => trackEvent("bill_payment_skipped", { flow_type: "chat" }),

  paymentSaved: (params: {
    method_count: number;
    method_names: string;
  }) => trackEvent("bill_payment_saved", { 
    flow_type: "chat", 
    method_count: params.method_count,
    method_names: params.method_names
  }),

  paymentAddClicked: () => trackEvent("bill_payment_add_clicked", { flow_type: "chat" }),

  summaryViewed: (params: { auth_state: "login" | "non_login" }) =>
    trackEvent("bill_created", { 
      flow_type: "chat", 
      auth_state: params.auth_state 
    }),

  restarted: () => trackEvent("bill_restart", { flow_type: "chat" }),

  reviewSent: (params: {
    rating: number;
    auth_state: "login" | "non_login";
  }) => trackEvent("bill_review_sent", { 
    flow_type: "chat", 
    rating: params.rating,
    auth_state: params.auth_state
  }),

  headerRefreshClicked: (params: { current_step: string }) =>
    trackEvent("bill_header_refresh_clicked", { flow_type: "chat", current_step: params.current_step }),

  closed: (params: { at_step: string }) =>
    trackEvent("bill_funnel_closed", { flow_type: "chat", at_step: params.at_step }),
};
