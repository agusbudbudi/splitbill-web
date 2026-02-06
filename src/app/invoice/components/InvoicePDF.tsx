import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { parseHtmlToPdf } from "@/lib/utils/pdfHtmlParser";
import { formatToIDR } from "@/lib/utils/invoice";

// Register fonts if needed, or use defaults
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11, // increased from 10
    color: "#2d2d3e", // foreground
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingBottom: 8, // reduced
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d2d3e",
    letterSpacing: -0.5,
  },
  logo: {
    height: 48,
    width: "auto",
  },
  metaInfo: {
    marginTop: 6,
  },
  metaText: {
    fontSize: 10, // increased from 9
    color: "#64748b", // muted-foreground
    marginBottom: 3,
  },
  metaValue: {
    fontWeight: "bold",
    color: "#2d2d3e",
  },
  billingSection: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 4,
  },
  billingBox: {
    flex: 1,
    backgroundColor: "#F0F9FF", // primary/5 blue
    padding: 8, // reduced from 12
    borderRadius: 8,
  },
  billingTitle: {
    fontSize: 9, // increased from 8
    fontWeight: "bold",
    color: "#479FEA", // primary blue
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  billingContent: {
    flexDirection: "row",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  billingInfo: {
    flex: 1,
  },
  billingName: {
    fontSize: 14, // increased from 12
    fontWeight: "bold",
    marginBottom: 2,
    color: "#2d2d3e",
  },
  billingDetail: {
    fontSize: 9, // increased from 8
    color: "#64748b",
    marginBottom: 1,
  },
  table: {
    marginTop: 6, // reduced from 10
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#BAE6FD", // primary/20 blue
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0F2FE", // primary/10 blue
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#F0F9FF", // primary/5 blue
    borderBottomWidth: 1,
    borderBottomColor: "#BAE6FD",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  headerText: {
    fontSize: 10, // increased from 9
    fontWeight: "bold",
    color: "#2d2d3e",
  },
  lastRow: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  col1: { width: "50%", padding: 8 }, // reduced from 12
  col2: { width: "10%", padding: 8, textAlign: "center" },
  col3: { width: "20%", padding: 8, textAlign: "right" },
  col4: { width: "20%", padding: 8, textAlign: "right" },
  itemName: {
    fontSize: 11, // increased from 10
    fontWeight: "bold",
    color: "#2d2d3e",
  },
  itemDescription: {
    fontSize: 9, // increased from 8
    color: "#64748b",
    marginTop: 2,
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8, // reduced from 15
  },
  totalsTable: {
    width: 200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  totalLabel: {
    color: "#64748b",
    fontSize: 10, // increased from 9
  },
  totalValue: {
    fontWeight: "bold",
    color: "#2d2d3e",
    fontSize: 11, // increased from 10
  },
  discountValue: {
    fontWeight: "bold",
    color: "#ef4444",
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginTop: 6,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grandTotalLabel: {
    fontWeight: "bold",
    color: "#2d2d3e",
    fontSize: 13, // increased from 12
  },
  grandTotalValue: {
    fontWeight: "bold",
    color: "#479FEA", // primary blue
    fontSize: 16, // increased from 14
  },
  wordsAmount: {
    fontSize: 9, // increased from 8
    color: "#64748b",
    textAlign: "right",
    marginTop: 6,
    fontStyle: "italic",
  },
  paymentMethods: {
    marginTop: 10, // reduced from 20
  },
  sectionTitle: {
    fontSize: 10, // increased from 9
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  paymentItem: {
    width: "48%",
    padding: 10,
    backgroundColor: "#F8FAFC", // soft gray
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  paymentIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  paymentLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  paymentText: {
    flex: 1,
  },
  tncSection: {
    marginTop: 10, // reduced from 20
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9, // increased from 8
    color: "#999",
  },
});

export const InvoicePDF = ({ invoice }: { invoice: any }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>
                Invoice No:{" "}
                <Text style={styles.metaValue}>{invoice.invoiceNo}</Text>
              </Text>
              <Text style={styles.metaText}>
                Date:{" "}
                <Text style={styles.metaValue}>
                  {formatDate(invoice.invoiceDate)}
                </Text>
              </Text>
              <Text style={styles.metaText}>
                Due Date:{" "}
                <Text style={styles.metaValue}>
                  {formatDate(invoice.dueDate)}
                </Text>
              </Text>
            </View>
          </View>
          {invoice.logo && (
            <View>
              <Image src={invoice.logo} style={styles.logo} />
            </View>
          )}
        </View>

        {/* Billed info */}
        <View style={styles.billingSection}>
          {invoice.billedBy && (
            <View style={styles.billingBox}>
              <Text style={styles.billingTitle}>Billed By</Text>
              <View style={styles.billingContent}>
                <Image
                  src={
                    invoice.billedBy.avatar ||
                    "https://api.dicebear.com/9.x/personas/png?seed=" +
                      encodeURIComponent(invoice.billedBy.name)
                  }
                  style={styles.avatar}
                />
                <View style={styles.billingInfo}>
                  <Text style={styles.billingName}>
                    {invoice.billedBy.name}
                  </Text>
                  {invoice.billedBy.phone && (
                    <Text style={styles.billingDetail}>
                      {invoice.billedBy.phone}
                    </Text>
                  )}
                  {invoice.billedBy.email && (
                    <Text style={styles.billingDetail}>
                      {invoice.billedBy.email}
                    </Text>
                  )}
                  {invoice.billedBy.address && (
                    <Text style={styles.billingDetail}>
                      {invoice.billedBy.address}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
          {invoice.billedTo && (
            <View style={styles.billingBox}>
              <Text style={styles.billingTitle}>Billed To</Text>
              <View style={styles.billingContent}>
                <Image
                  src={
                    invoice.billedTo.avatar ||
                    "https://api.dicebear.com/9.x/personas/png?seed=" +
                      encodeURIComponent(invoice.billedTo.name)
                  }
                  style={styles.avatar}
                />
                <View style={styles.billingInfo}>
                  <Text style={styles.billingName}>
                    {invoice.billedTo.name}
                  </Text>
                  {invoice.billedTo.phone && (
                    <Text style={styles.billingDetail}>
                      {invoice.billedTo.phone}
                    </Text>
                  )}
                  {invoice.billedTo.email && (
                    <Text style={styles.billingDetail}>
                      {invoice.billedTo.email}
                    </Text>
                  )}
                  {invoice.billedTo.address && (
                    <Text style={styles.billingDetail}>
                      {invoice.billedTo.address}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.col1}>
              <Text style={styles.headerText}>Item Description</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.headerText}>Qty</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.headerText}>Rate</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.headerText}>Amount</Text>
            </View>
          </View>
          {invoice.items?.map((item: any, index: number) => (
            <View
              key={item.id}
              style={[
                styles.tableRow,
                index === invoice.items.length - 1 ? styles.lastRow : {},
              ]}
              wrap={false}
            >
              <View style={styles.col1}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description && (
                  <View style={styles.itemDescription}>
                    {parseHtmlToPdf(item.description)}
                  </View>
                )}
              </View>
              <View style={styles.col2}>
                <Text>{item.qty}</Text>
              </View>
              <View style={styles.col3}>
                <Text>{formatToIDR(item.rate)}</Text>
              </View>
              <View style={styles.col4}>
                <Text style={{ fontWeight: "bold" }}>
                  {formatToIDR(item.amount)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>
                {formatToIDR(invoice.subtotal)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={[styles.totalValue, styles.discountValue]}>
                - {formatToIDR(invoice.discountAmount)}
              </Text>
            </View>
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>Total Amount:</Text>
              <Text style={styles.grandTotalValue}>
                {formatToIDR(invoice.total)}
              </Text>
            </View>
            {invoice.totalInWords && (
              <Text style={styles.wordsAmount}>{invoice.totalInWords}</Text>
            )}
          </View>
        </View>

        {/* Payment Methods */}
        {invoice.paymentMethods && invoice.paymentMethods.length > 0 && (
          <View style={styles.paymentMethods} wrap={false}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <View style={styles.paymentGrid}>
              {invoice.paymentMethods.map((method: any) => (
                <View key={method.id} style={styles.paymentItem}>
                  <View style={styles.paymentIcon}>
                    {method.logo && method.logo !== "/img/wallet-icon.png" ? (
                      <Image src={method.logo} style={styles.paymentLogo} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 7,
                          fontWeight: "bold",
                          color: "#64748b",
                        }}
                      >
                        {(method.bankName || method.name)
                          .substring(0, 3)
                          .toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.paymentText}>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>
                      {method.bankName || method.name}
                    </Text>
                    <Text
                      style={{ fontSize: 8, color: "#64748b", marginTop: 1 }}
                    >
                      {method.type === "bank"
                        ? method.accountNumber
                        : method.phone}
                    </Text>
                    <Text style={{ fontSize: 7, color: "#94a3b8" }}>
                      a.n. {method.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TnC */}
        {invoice.tnc && (
          <View style={styles.tncSection} wrap={false}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <View style={{ fontSize: 8, color: "#64748b", lineHeight: 1.5 }}>
              {parseHtmlToPdf(invoice.tnc)}
            </View>
          </View>
        )}

        {/* Footer */}
        {invoice.footer && <Text style={styles.footer}>{invoice.footer}</Text>}
      </Page>
    </Document>
  );
};
