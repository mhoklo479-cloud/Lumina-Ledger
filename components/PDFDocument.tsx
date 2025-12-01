import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Invoice, CompanySettings, TRANSLATIONS } from '../types';

// Register Cairo for Arabic support
Font.register({
  family: 'Cairo',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/cairo/v20/SLXGc1nY6HkvangtZmpcMw.ttf', fontWeight: 400 }, // Regular
    { src: 'https://fonts.gstatic.com/s/cairo/v20/SLXGc1nY6HkvangtZmpcMw.ttf', fontWeight: 600 }, // Bold (simulated)
    { src: 'https://fonts.gstatic.com/s/cairo/v20/SLXGc1nY6HkvangtZmpcMw.ttf', fontWeight: 700 }, // Bold
  ]
});

// Register Inter for Latin support
Font.register({
  family: 'Inter',
  fonts: [
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  arabicPage: {
    fontFamily: 'Cairo',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5', // Indigo 600
    paddingBottom: 20,
  },
  companyCol: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
  },
  metaContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 8,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  billToSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 8,
  },
  billLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  billValue: {
    fontSize: 11,
    color: '#0F172A',
    marginBottom: 2,
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 4,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cellDesc: { flex: 4, textAlign: 'left' },
  cellQty: { flex: 1, textAlign: 'center' },
  cellPrice: { flex: 2, textAlign: 'right' },
  cellTotal: { flex: 2, textAlign: 'right' },
  
  cellText: { fontSize: 10, color: '#334155' },
  cellTextBold: { fontSize: 10, fontWeight: 'bold', color: '#0F172A' },

  footerSection: {
    flexDirection: 'row',
    marginTop: 20,
  },
  notesArea: {
    flex: 3,
    paddingRight: 20,
  },
  totalsArea: {
    flex: 2,
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 20,
  },
  qrPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E2E8F0', // Placeholder gray
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureArea: {
    alignItems: 'center',
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 40,
    paddingTop: 5,
  },
  signatureText: {
    fontSize: 8,
    color: '#64748B',
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  }
});

interface InvoicePDFProps {
  invoice: Invoice;
  settings: CompanySettings;
  language: string;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, settings, language }) => {
  const isArabic = language === 'ar';
  
  const calculateTotal = () => {
    const subtotal = invoice.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    return subtotal + taxAmount - invoice.discount;
  };

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxAmount = subtotal * (invoice.taxRate / 100);

  // Dynamic Styles based on language
  const baseStyle = isArabic ? styles.arabicPage : styles.page;
  const rowStyle = isArabic ? styles.rtlRow : {};
  const alignStyle = isArabic ? styles.rtlText : {};
  const t = TRANSLATIONS[language];

  return (
    <Document>
      <Page size="A4" style={baseStyle}>
        
        {/* Header */}
        <View style={[styles.header, rowStyle]}>
          <View style={styles.companyCol}>
             {settings.logoUrl && (
                 <Image src={settings.logoUrl} style={{ width: 40, height: 40, marginBottom: 10, borderRadius: 4 }} />
             )}
             <Text style={[styles.companyName, alignStyle]}>{settings.name}</Text>
             <Text style={[styles.companyDetail, alignStyle]}>{settings.address}</Text>
             <Text style={[styles.companyDetail, alignStyle]}>{settings.email}</Text>
             <Text style={[styles.companyDetail, alignStyle]}>{t.taxId}: {settings.taxId}</Text>
          </View>
          <View style={{ alignItems: isArabic ? 'flex-start' : 'flex-end' }}>
             <Text style={styles.invoiceTitle}>{t.invoices}</Text>
             <View style={[styles.metaContainer, isArabic ? { flexDirection: 'row-reverse' } : {}]}>
                <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, alignStyle]}>NO.</Text>
                    <Text style={[styles.metaValue, alignStyle]}>{invoice.id}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, alignStyle]}>DATE</Text>
                    <Text style={[styles.metaValue, alignStyle]}>{invoice.date}</Text>
                </View>
             </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={[styles.billToSection, rowStyle]}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.billLabel, alignStyle]}>{t.clientDetails}</Text>
                <Text style={[styles.billValue, alignStyle, { fontWeight: 'bold' }]}>{invoice.clientName}</Text>
                <Text style={[styles.billValue, alignStyle]}>{invoice.clientEmail}</Text>
                {invoice.clientAddress && <Text style={[styles.billValue, alignStyle]}>{invoice.clientAddress}</Text>}
            </View>
             <View style={{ flex: 1, alignItems: isArabic ? 'flex-start' : 'flex-end' }}>
                <Text style={[styles.billLabel, alignStyle]}>{t.summary}</Text>
                <Text style={[styles.billValue, alignStyle]}>{t.status}: {invoice.status.toUpperCase()}</Text>
                <Text style={[styles.billValue, alignStyle]}>{t.paymentTerms}: {invoice.paymentTerms || 'On Receipt'}</Text>
            </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
            {/* Header */}
            <View style={[styles.tableHeader, rowStyle]}>
                <Text style={[styles.tableHeaderCell, styles.cellDesc, alignStyle]}>{t.description}</Text>
                <Text style={[styles.tableHeaderCell, styles.cellQty]}>{t.qty}</Text>
                <Text style={[styles.tableHeaderCell, styles.cellPrice, alignStyle]}>{t.price}</Text>
                <Text style={[styles.tableHeaderCell, styles.cellTotal, alignStyle]}>{t.total}</Text>
            </View>
            
            {/* Rows */}
            {invoice.items.map((item, idx) => (
                <View key={idx} style={[styles.tableRow, rowStyle, { backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }]}>
                    <Text style={[styles.cellDesc, styles.cellText, alignStyle]}>{item.description}</Text>
                    <Text style={[styles.cellQty, styles.cellText]}>{item.quantity}</Text>
                    <Text style={[styles.cellPrice, styles.cellText, alignStyle]}>{invoice.currency} {item.price.toFixed(2)}</Text>
                    <Text style={[styles.cellTotal, styles.cellTextBold, alignStyle]}>{invoice.currency} {(item.price * item.quantity).toFixed(2)}</Text>
                </View>
            ))}
        </View>

        {/* Footer Grid */}
        <View style={[styles.footerSection, rowStyle]}>
            {/* Notes */}
            <View style={styles.notesArea}>
                {invoice.notes && (
                    <>
                        <Text style={[styles.billLabel, alignStyle]}>{t.notes}</Text>
                        <Text style={[styles.companyDetail, alignStyle, { fontSize: 10 }]}>{invoice.notes}</Text>
                    </>
                )}
            </View>

            {/* Totals */}
            <View style={styles.totalsArea}>
                 <View style={[styles.totalRow, rowStyle]}>
                    <Text style={styles.totalLabel}>{t.subtotal}</Text>
                    <Text style={styles.totalValue}>{invoice.currency} {subtotal.toFixed(2)}</Text>
                 </View>
                 <View style={[styles.totalRow, rowStyle]}>
                    <Text style={styles.totalLabel}>{t.tax} ({invoice.taxRate}%)</Text>
                    <Text style={styles.totalValue}>{invoice.currency} {taxAmount.toFixed(2)}</Text>
                 </View>
                 {invoice.discount > 0 && (
                    <View style={[styles.totalRow, rowStyle]}>
                        <Text style={styles.totalLabel}>{t.discount}</Text>
                        <Text style={[styles.totalValue, { color: '#EF4444' }]}>- {invoice.currency} {invoice.discount.toFixed(2)}</Text>
                    </View>
                 )}
                 <View style={[styles.grandTotalRow, rowStyle]}>
                    <Text style={styles.grandTotalLabel}>{t.grandTotal}</Text>
                    <Text style={styles.grandTotalValue}>{invoice.currency} {calculateTotal().toFixed(2)}</Text>
                 </View>
            </View>
        </View>

        {/* Bottom Bar: QR & Signature */}
        <View style={[styles.bottomBar, rowStyle]}>
            <View style={styles.qrPlaceholder}>
                <Text style={{ fontSize: 8 }}>QR Code</Text>
            </View>
            
            <View style={styles.signatureArea}>
                 {settings.signatureUrl && (
                    <Image src={settings.signatureUrl} style={{ width: 100, height: 40, objectFit: 'contain' }} />
                 )}
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>{t.signature}</Text>
            </View>
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePDF;