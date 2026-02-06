/**
 * Invoice Utility Functions
 */

/**
 * Generate invoice number with format: PREFIX + DDMMYYYY + RANDOM3DIGITS
 * @param prefix - Invoice prefix (e.g., "INV-", "AGD-")
 * @returns Generated invoice number
 */
export function generateInvoiceNumber(prefix: string = "INV-"): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const datePart = `${dd}${mm}${yyyy}`;
  const randomPart = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${prefix}${datePart}${randomPart}`;
}

/**
 * Format number to Indonesian Rupiah currency
 * @param amount - Amount to format
 * @returns Formatted currency string (e.g., "Rp 1.000.000")
 */
export function formatToIDR(amount: number): string {
  return amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Parse Indonesian currency string to number
 * @param rpString - Currency string (e.g., "Rp 1.000.000")
 * @returns Parsed number
 */
export function parseCurrency(rpString: string): number {
  if (!rpString) return 0;

  // Remove "Rp", spaces, and convert dots to empty, comma to dot
  const cleaned = rpString
    .replace(/[^0-9,]/g, "") // only keep numbers and comma
    .replace(/\./g, "") // remove dots (thousand separator)
    .replace(",", "."); // convert comma (decimal ID) to dot (decimal en-US)

  return parseFloat(cleaned) || 0;
}

/**
 * Convert number to Indonesian words
 * @param n - Number to convert
 * @returns Number in Indonesian words (e.g., "satu juta rupiah")
 */
export function numberToWords(n: number): string {
  const satuan = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
  ];

  function toWords(num: number): string {
    if (num < 10) return satuan[num];
    if (num === 10) return "sepuluh";
    if (num === 11) return "sebelas";
    if (num < 20) return satuan[num % 10] + " belas";
    if (num < 100)
      return satuan[Math.floor(num / 10)] + " puluh " + satuan[num % 10];
    if (num < 200) return "seratus " + toWords(num - 100);
    if (num < 1000)
      return satuan[Math.floor(num / 100)] + " ratus " + toWords(num % 100);
    if (num < 2000) return "seribu " + toWords(num - 1000);
    if (num < 1000000)
      return toWords(Math.floor(num / 1000)) + " ribu " + toWords(num % 1000);
    if (num < 1000000000)
      return (
        toWords(Math.floor(num / 1000000)) + " juta " + toWords(num % 1000000)
      );
    return "Jumlah terlalu besar";
  }

  return toWords(Math.floor(n)).replace(/\s+/g, " ").trim() + " rupiah";
}

/**
 * Calculate discount amount
 * @param subtotal - Subtotal amount
 * @param discountType - Type of discount ("amount" or "percent")
 * @param discountValue - Discount value
 * @returns Calculated discount amount
 */
export function calculateDiscount(
  subtotal: number,
  discountType: "amount" | "percent",
  discountValue: number,
): number {
  if (discountType === "percent") {
    if (discountValue >= 0 && discountValue <= 100) {
      return (discountValue / 100) * subtotal;
    }
    return 0;
  } else if (discountType === "amount") {
    return discountValue;
  }
  return 0;
}

/**
 * Validate invoice step
 * @param step - Step number (1-6)
 * @param invoice - Partial invoice data
 * @returns Validation result with errors
 */
export function validateInvoiceStep(
  step: number,
  invoice: Partial<{
    invoiceNo: string;
    invoiceDate: string;
    dueDate: string;
    billedBy: any;
    billedTo: any;
    items: any[];
    paymentMethods: any[];
    discountType: "amount" | "percent";
    discountValue: number;
  }>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (step) {
    case 1: // Invoice Details
      if (!invoice.invoiceNo) errors.push("Nomor invoice harus diisi");
      if (!invoice.invoiceDate) errors.push("Tanggal invoice harus diisi");
      if (!invoice.dueDate) errors.push("Tanggal jatuh tempo harus diisi");

      if (invoice.invoiceDate && invoice.dueDate) {
        if (new Date(invoice.dueDate) < new Date(invoice.invoiceDate)) {
          errors.push(
            "Tanggal jatuh tempo tidak boleh sebelum tanggal invoice",
          );
        }
      }
      break;

    case 2: // Billed By/To
      if (!invoice.billedBy || !invoice.billedBy.id)
        errors.push("Pilih identitas pengirim (Billed By)");
      if (!invoice.billedTo || !invoice.billedTo.id)
        errors.push("Pilih identitas penerima (Billed To)");
      break;

    case 3: // Invoice Items
      if (!invoice.items || invoice.items.length === 0) {
        errors.push("Tambahkan minimal satu item untuk melanjutkan");
      } else {
        // Validation for discount
        const items = invoice.items || [];
        const subtotal = items.reduce(
          (sum: number, item: any) => sum + (item.amount || 0),
          0,
        );

        if (
          invoice.discountType === "percent" &&
          (invoice.discountValue || 0) > 100
        ) {
          errors.push("Diskon persentase tidak boleh lebih dari 100%");
        }

        if (
          invoice.discountType === "percent" &&
          (invoice.discountValue || 0) < 0
        ) {
          errors.push("Diskon tidak boleh negatif");
        }

        if (
          invoice.discountType === "amount" &&
          (invoice.discountValue || 0) > subtotal
        ) {
          errors.push("Diskon tidak boleh melebihi subtotal");
        }
      }
      break;

    case 4: // Payment Methods
      if (!invoice.paymentMethods || invoice.paymentMethods.length === 0) {
        errors.push("Pilih minimal satu metode pembayaran");
      }
      break;

    case 5: // Terms & Conditions
      // Optional, no validation needed
      break;

    case 6: // Preview
      // All validations from previous steps
      const step1 = validateInvoiceStep(1, invoice);
      const step2 = validateInvoiceStep(2, invoice);
      const step3 = validateInvoiceStep(3, invoice);
      const step4 = validateInvoiceStep(4, invoice);
      errors.push(
        ...step1.errors,
        ...step2.errors,
        ...step3.errors,
        ...step4.errors,
      );
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate DiceBear avatar URL
 * @param seed - Seed for avatar generation (e.g., name)
 * @returns Avatar URL
 */
export function generateAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&scale=100&seed=${encodeURIComponent(seed)}`;
}
