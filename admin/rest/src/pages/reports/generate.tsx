import { useTranslation } from 'next-i18next';
import { Table } from '@/components/ui/table';
import useGenerateReport from '@/hooks/useGenerateReport';
import { generateReportColumn } from '@/utils/locals';
const generate = () => {
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

export default generate;
