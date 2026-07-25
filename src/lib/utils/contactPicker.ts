export function isContactPickerSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "contacts" in navigator &&
    typeof window !== "undefined" &&
    "ContactsManager" in window
  );
}

export interface PickedContact {
  name: string;
  tel: string;
}

export async function pickContact(): Promise<PickedContact | null> {
  try {
    // Contact Picker API isn't in lib.dom.d.ts yet.
    // @ts-expect-error - navigator.contacts is not in standard TS DOM types
    const contacts = await navigator.contacts.select(["name", "tel"], {
      multiple: false,
    });
    const contact = contacts?.[0];
    if (!contact) return null;

    return {
      name: contact.name?.[0] ?? "",
      tel: contact.tel?.[0] ?? "",
    };
  } catch {
    return null;
  }
}
