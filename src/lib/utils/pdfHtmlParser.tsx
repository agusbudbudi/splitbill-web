import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  underline: { textDecoration: "underline" },
  strikethrough: { textDecoration: "line-through" },
  list: { marginLeft: 5, marginTop: 2 },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  bullet: {
    width: 12,
    fontSize: 11,
    marginRight: 4,
  },
  paragraph: { marginBottom: 6 },
});

/**
 * A very simple HTML to react-pdf parser.
 * Handles: <b>, <strong>, <i>, <em>, <ul>, <ol>, <li>, <p>, <br>, <u>, <s>
 */
export const parseHtmlToPdf = (html: string) => {
  if (!html) return null;

  // Clean up the HTML
  const cleanHtml = html
    .replace(/&nbsp;/g, " ")
    .replace(/\u00A0/g, " ") // Fixed: Handle actual Unicode non-breaking space
    .replace(/<br\s*\/?>/gi, "\n")
    .trim();

  // Helper to process a string and return components
  const processNode = (nodeText: string): React.ReactNode => {
    // Entities cleanup
    const processedText = nodeText
      .replace(/&nbsp;/g, " ")
      .replace(/\u00A0/g, " ")
      .replace(/&#160;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]*>/g, (tag) => {
        // Keep some tags for intermediate processing if needed, but for now just strip
        if (
          tag.toLowerCase().startsWith("<b") ||
          tag.toLowerCase().startsWith("<strong") ||
          tag.toLowerCase().startsWith("<i") ||
          tag.toLowerCase().startsWith("<em") ||
          tag.toLowerCase().startsWith("<u") ||
          tag.toLowerCase().startsWith("<s")
        ) {
          return tag;
        }
        return "";
      })
      .trim();

    // Simple regex-based splitting for basic tags within a line
    const parts = processedText.split(/(<[^>]+>[^<]*<\/[^>]+>)/g);

    return parts.map((part, index) => {
      if (part.startsWith("<b>") || part.startsWith("<strong>")) {
        const content = part.replace(/<\/?(b|strong)>/gi, "");
        return (
          <Text key={index} style={styles.bold}>
            {content}
          </Text>
        );
      }
      if (part.startsWith("<i>") || part.startsWith("<em>")) {
        const content = part.replace(/<\/?(i|em)>/gi, "");
        return (
          <Text key={index} style={styles.italic}>
            {content}
          </Text>
        );
      }
      if (part.startsWith("<u>")) {
        const content = part.replace(/<\/?u>/gi, "");
        return (
          <Text key={index} style={styles.underline}>
            {content}
          </Text>
        );
      }
      if (
        part.startsWith("<s>") ||
        part.startsWith("<strike>") ||
        part.startsWith("<del>")
      ) {
        const content = part.replace(/<\/?(s|strike|del)>/gi, "");
        return (
          <Text key={index} style={styles.strikethrough}>
            {content}
          </Text>
        );
      }
      return part; // plain text
    });
  };

  // Split by blocks (p, ul, ol)
  const blocks = cleanHtml.split(
    /(<ul.*?>.*?<\/ul>|<ol.*?>.*?<\/ol>|<p.*?>.*?<\/p>)/gi,
  );

  return blocks.map((block, index) => {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) return null;

    if (trimmedBlock.startsWith("<ul") || trimmedBlock.startsWith("<ol")) {
      const isOrdered = trimmedBlock.startsWith("<ol");
      const items = trimmedBlock.match(/<li.*?>.*?<\/li>/gi) || [];
      return (
        <View key={index} style={styles.list}>
          {items.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>{isOrdered ? `${i + 1}.` : "•"}</Text>
              <Text style={{ flex: 1 }}>
                {processNode(item.replace(/<\/?li.*?>/gi, ""))}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    if (trimmedBlock.startsWith("<p")) {
      return (
        <View key={index} style={styles.paragraph}>
          <Text>{processNode(trimmedBlock.replace(/<\/?p.*?>/gi, ""))}</Text>
        </View>
      );
    }

    // Plain text or remaining content
    return (
      <View key={index} style={styles.paragraph}>
        <Text>{processNode(trimmedBlock)}</Text>
      </View>
    );
  });
};
