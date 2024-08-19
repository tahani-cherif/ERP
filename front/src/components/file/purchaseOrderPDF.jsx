// PurchaseOrderPDF.js
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
  headervide:{marginTop:"150px"}
});

const PurchaseOrderPDF = ({ order }) => {
  const { t } = useTranslation();

  return (
    <Document>
      <Page style={styles.page}>
      <View style={styles.headervide}>
      </View>
        <Text style={styles.header}>
          {t('bonCommande')} N° : {order?.number}
        </Text>
        <Text style={styles.section}>Date : {order?.date}</Text>
        <Text style={styles.subHeader}>{t('fournisseur')} :</Text>
        <Text style={styles.section}>{t('nomFournisseur') + ' ' + order?.supplier?.name}</Text>
        <Text style={styles.section}>
          {t('address') + ' ' + t('fournisseur')} {order?.supplier?.address}
        </Text>
        <Text style={styles.subHeader}>Client :</Text>
        <Text style={styles.section}>{t('nomClients') + ' ' + order?.client?.name}</Text>
        <Text style={styles.section}>
          {t('address') + ' Client'}
          {order?.client?.address}
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
          {order?.items?.map((item, index) => (
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
          {t('montantTotal') + ' '}HT: {order?.totalHT}
        </Text>
        <Text style={styles.section}>
          TVA ({order?.taxRate}%): {order?.taxAmount}
        </Text>
        <Text style={styles.section}>
          {t('montantTotal') + ' '}TTC: {order?.totalTTC}
        </Text>
        <Text style={styles.section}> {t('modepaiement') + ' ' + order?.paymentTerms}</Text>
      </Page>
    </Document>
  );
};

export default PurchaseOrderPDF;
