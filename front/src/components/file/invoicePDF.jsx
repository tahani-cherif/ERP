// InvoicePDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: 'row' },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: { margin: 5, fontSize: 12 },
  header: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  subHeader: { fontSize: 14, marginBottom: 10 },
});

const InvoicePDF = ({ invoice }) => {
  const { t } = useTranslation();

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>
          {t('facture')} N° : {invoice?.number}
        </Text>
        <Text style={styles.section}>Date : {invoice?.date}</Text>
        <Text style={styles.subHeader}>Client :</Text>
        <Text style={styles.section}>{t('nomClients') + ' :' + invoice?.client?.name}</Text>
        <Text style={styles.section}>
          {t('address') + ' Client :'}
          {invoice?.client?.address}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{t('nom')}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{t('quantite')}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{t('price')}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{t('montantTotal')}</Text>
            </View>
          </View>
          {invoice?.items?.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item?.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item?.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item?.unitPrice}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item?.total}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.section}>
          {t('montantTotal') + ' '}HT: {invoice?.totalHT}
        </Text>
        <Text style={styles.section}>
          TVA ({invoice?.taxRate}%): {invoice?.taxAmount}
        </Text>
        <Text style={styles.section}>
          {t('montantTotal') + ' '}TTC: {invoice?.totalTTC}
        </Text>
        <Text style={styles.section}> {t('modepaiement') + ' ' + invoice?.paymentTerms}</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
