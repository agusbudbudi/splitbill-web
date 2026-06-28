import type { ChatStep } from "@/store/useSplitBillChatStore";

interface ChatStateSnapshot {
  participants: string[];
  payerName: string;
  scannedResult: any;
  expenses: any[];
}

/**
 * Validates whether transitioning from one step to another is allowed
 * based on the current state of the chat store.
 */
export function validateStepTransition(
  from: ChatStep,
  to: ChatStep,
  state: ChatStateSnapshot
): { isValid: boolean; error?: string } {
  // Always allow resetting or going back to greeting
  if (to === "GREETING") {
    return { isValid: true };
  }

  switch (to) {
    case "SELECT_PAYER":
      if (state.participants.length < 2) {
        return {
          isValid: false,
          error: "Minimal harus ada 2 teman yang ditambahkan untuk patungan.",
        };
      }
      break;

    case "SCAN_RECEIPT":
      // If we are coming from a step after ADD_FRIENDS, we must have a payer selected
      if (!state.payerName) {
        return {
          isValid: false,
          error: "Silakan pilih siapa yang membayar bill ini terlebih dahulu.",
        };
      }
      break;

    case "ASSIGN_ITEMS":
      if (!state.scannedResult) {
        return {
          isValid: false,
          error: "Struk belanja belum berhasil di-scan atau diunggah.",
        };
      }
      break;

    case "SET_TAX_METHOD":
    case "SET_ACTIVITY":
      if (state.expenses.length === 0) {
        return {
          isValid: false,
          error: "Tidak ada item struk yang bisa diproses.",
        };
      }
      break;

    default:
      break;
  }

  return { isValid: true };
}
