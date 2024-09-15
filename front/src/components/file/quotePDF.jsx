// QuotePDF.js
import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import api from 'src/utils/axios';

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
    marginBottom: 20,
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
  conditions: { marginTop: 20, fontSize: 12 },
  headervide: { marginTop: '150px' },
  entreprise: { marginLeft: 'auto' },
});

const QuotePDF = ({ quote }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(
    localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || ''),
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?._id !== user?.admin) {
          const userupdate = await api.get('/users/' + user?.admin);
          setUser({
            ...user,
            matriculefiscaleEntreprise: userupdate?.data?.matriculefiscaleEntreprise,
            phoneEntreprise: userupdate?.data?.phoneEntreprise,
            addressEntreprise: userupdate?.data?.addressEntreprise,
            nomEntreprise: userupdate?.data?.nomEntreprise,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.headervide}></View>
        <Text style={styles.header}>Devis N° : {quote?.number}</Text>
        <Text style={styles.section}>Date : {quote?.date}</Text>
        <View style={styles.entreprise}>
          <Text style={styles.subHeader}>{t('entreprise')} :</Text>
          <Text style={styles.section}>{t('nameentreprise') + ' : ' + user?.nomEntreprise}</Text>
          <Text style={styles.section}>
            {t('address') + ' ' + t('entreprise') + ' :' + user?.addressEntreprise}
          </Text>
          <Text style={styles.section}>
            {t('phone') + ' ' + t('entreprise') + ' :' + user?.phoneEntreprise}
          </Text>
          <Text style={styles.section}>
            {t('matriculeFiscale2') +
              ' ' +
              t('entreprise') +
              ' : ' +
              user?.matriculefiscaleEntreprise}
          </Text>
        </View>
        <Text style={styles.subHeader}>Client :</Text>
        <Text style={styles.section}>{t('nomClients') + ' : ' + quote?.client?.name}</Text>
        <Text style={styles.section}>
          {t('address') + ' Client : '}
          {quote?.client?.address}
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
            {user?.role === 'agence' && (
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{t('montantbenefices')}</Text>
              </View>
            )}
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{t('montantTotal')}</Text>
            </View>
          </View>
          {quote?.items?.map((item, index) => (
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
              {user?.role === 'agence' && (
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.montantbenefices}</Text>
                </View>
              )}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item?.total}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.section}>
          {t('montantTotal') + ' '}HT: {quote?.totalHT}
        </Text>
        <Text style={styles.section}>
          TVA ({quote?.taxRate}%) : {quote?.taxAmount}
        </Text>
        <Text style={styles.section}>
          {t('montantTotal') + ' '}TTC: {quote?.totalTTC}
        </Text>
        <Text style={styles.conditions}> {t('modepaiement') + ' : ' + t(quote?.paymentTerms)}</Text>
      </Page>
    </Document>
  );
};

export default QuotePDF;
