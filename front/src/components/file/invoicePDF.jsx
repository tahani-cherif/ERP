// InvoicePDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10, fontSize: 14 },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 10,
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
  subHeader: { fontSize: 18, marginBottom: 10 },
  headervide: { marginTop: '150px' },
  entreprise: { marginLeft: 'auto' },
});

const InvoicePDF = ({ invoice }) => {
  const { t } = useTranslation();

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.headervide}></View>
        <Text style={styles.header}>
          {t('facture')} N° : {invoice?.number}
        </Text>
        <Text style={styles.section}>Date : {invoice?.date}</Text>
        <View style={styles.entreprise}>
          <Text style={styles.subHeader}>{t('entreprise')} :</Text>
          <Text style={styles.section}>{t('nameentreprise') + ' : ...................'}</Text>
          <Text style={styles.section}>
            {t('address') + ' ' + t('entreprise') + ' : ...................'}
          </Text>
          <Text style={styles.section}>
            {t('phone') + ' ' + t('entreprise') + ' : ...................'}
          </Text>
          <Text style={styles.section}>
            {t('matriculeFiscale2') + ' ' + t('entreprise') + ' : ...................'}
          </Text>
        </View>
        <Text style={styles.subHeader}>Client :</Text>
        <Text style={styles.section}>{t('nomClients') + ' : ' + invoice?.client?.name}</Text>
        <Text style={styles.section}>
          {t('address') + ' Client : '}
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
        <Text style={styles.section}>{t('timbre')} : 1</Text>
        <Text style={styles.section}>
          {t('montantTotal') + ' '}TTC: {invoice?.totalTTC}
        </Text>
        <Text style={styles.section}> {t('modepaiement') + ' ' + invoice?.paymentTerms}</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
