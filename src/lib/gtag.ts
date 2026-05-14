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
    window.gtag("config", GA_MEASUREMENT_ID!, {
      user_id: userId,
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
  login: () => trackEvent("login"),
  signUp: () => trackEvent("sign_up"),
};

export const trackSubscription = {
  viewPlans: () => trackEvent("view_subscription_plans"),
  initiateCheckout: (planId: string) => trackEvent("initiate_checkout", { plan_id: planId }),
  purchaseSuccess: (planId: string, amount: number) => trackEvent("purchase_success", { plan_id: planId, amount }),
  premiumFeatureClick: (featureName: string) => trackEvent("premium_feature_click", { feature_name: featureName }),
};

export const trackSplitBill = {
  start: () => trackEvent("split_bill_start"),
  stepComplete: (stepNumber: number, stepName: string) => 
    trackEvent("split_bill_step_complete", { step_number: stepNumber, step_name: stepName }),
  aiScan: (
    status: "start" | "success" | "error", 
    retryCount?: number, 
    source?: "camera" | "gallery",
    duration?: number,
    itemCount?: number
  ) => 
    trackEvent("ai_scan_receipt", { 
      status, 
      retry_count: retryCount || 0,
      image_source: source || "unknown",
      duration_ms: duration,
      item_count: itemCount
    }),
  aiRetry: () => trackEvent("ai_scan_retry"),
  aiImport: (itemCount?: number, merchantName?: string) => 
    trackEvent("ai_import_result", { 
      item_count: itemCount,
      merchant_name: merchantName,
      has_merchant: !!merchantName
    }),
  selectImage: (source: "camera" | "gallery") => trackEvent("ai_select_image", { source }),
  removeImage: () => trackEvent("ai_remove_image"),
  quickPickActivity: (name: string) => trackEvent("quick_pick_activity", { activity_name: name }),
  calculate: (params: { total_amount: number; num_participants: number }) => 
    trackEvent("calculate_split_bill", params),
  autofillView: (name: string) => trackEvent("activity_name_autofill_view", { name }),
  inputMethod: (method: "ai" | "manual") => trackEvent("split_bill_input_method", { method }),
  save: (params: { total_amount: number; num_participants: number; num_items: number; activity_name: string }) => 
    trackEvent("save_split_bill", params),
  share: (method: "share_api" | "copy_link" | "download_image" | "share_button", id: string) => 
    trackEvent("share_split_bill", { method, id }),
  reEntry: () => trackEvent("re_entry_split_bill"),
  monitorStatus: (id?: string) => trackEvent("monitor_payment_status_click", { bill_id: id }),
  validationError: (step: number, errorMessage: string) => 
    trackEvent("form_validation_error", { step, error_message: errorMessage }),
  finalizeModalView: () => trackEvent("finalize_modal_view"),
  finalizeConfirm: () => trackEvent("finalize_modal_confirm"),
  finalizeCancel: () => trackEvent("finalize_modal_cancel"),
  restart: () => trackEvent("restart_split_bill"),
  delete: (id: string) => trackEvent("delete_split_bill", { id }),
  toggleDetails: (name: string, isOpen: boolean) => 
    trackEvent("toggle_person_details", { person_name: name, is_open: isOpen }),
};

export const trackPublic = {
  openBill: (billId: string) => trackEvent("open_public_bill", { bill_id: billId }),
};

export const trackSocial = {
  addFriend: () => trackEvent("add_friend"),
  useSuggestion: (type: "friend" | "group") => trackEvent("use_besties_suggestion", { type }),
  tutorialComplete: () => trackEvent("tutorial_complete"),
};

export const trackGeneral = {
  appEntry: () => trackEvent("app_entry"),
  viewHistory: () => trackEvent("view_split_bill_history"),
  reviewBannerClick: () => trackEvent("review_banner_click"),
  reviewBannerClose: () => trackEvent("review_banner_close"),
};

export const trackWallet = {
  addMethodInitiate: () => trackEvent("add_payment_method_start"),
  addMethod: (type: string) => trackEvent("add_payment_method", { method_type: type }),
  selectPaymentMethod: (id: string, isSelected: boolean) => 
    trackEvent("select_payment_method", { method_id: id, is_selected: isSelected }),
  copyAccount: (provider: string) => trackEvent("copy_payment_account", { provider }),
  dropOff: () => trackEvent("drop_off_payment_method"),
};

export const trackMarketing = {
  setPersona: (persona: string) => setUserProperties({ marketing_persona: persona }),
  setSocialEngagement: (bestiesCount: number) => setUserProperties({ besties_count: bestiesCount }),
  setUsageIntensity: (totalBills: number) => setUserProperties({ total_bills_created: totalBills }),
};
