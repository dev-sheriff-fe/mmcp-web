import { useTranslation } from 'next-i18next';
import { Table } from '@/components/ui/table';
import useGenerateReport from '@/hooks/useGenerateReport';
import Layout from '@/components/layouts/admin';

import { generateReportColumn } from '@/utils/locals';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const Generate = () => {
  const { t } = useTranslation();
  const { reports, isLoading, code, downloadMutation } = useGenerateReport();
  return (
    <Table
      //@ts-ignore
      columns={generateReportColumn(reports)}
      emptyText={t('table:empty-table-data')}
      data={reports}
      rowKey="id"
      scroll={{ x: 900 }}
    />
  );
};

export default Generate;
Generate.Layout = Layout;
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
