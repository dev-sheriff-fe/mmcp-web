import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';

export type IProps = {
  merchants: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const BillerList = ({ merchants, onSort, onOrder }: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-serial-no'),
      dataIndex: 'serialNo',
      key: 'serialNo',
      align: 'center',
      width: 50,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: t('table:table-item-biller-code'),
      dataIndex: 'billerCode',
      key: 'billerCode',
      align: 'center',
      width: 80,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-biller-name')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'billerName'
          }
          isActive={sortingObj.column === 'billerName'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'billerName',
      key: 'billerName',
      align: alignLeft,
      width: 100,
      onHeaderCell: () => onHeaderClick('billerName'),
    },
    {
      title: t('table:table-item-bank-name'),
      dataIndex: 'bankName',
      key: 'bankName',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-biller-short-name'),
      dataIndex: 'billerShortName',
      key: 'billerShortName',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-biller-category'),
      dataIndex: 'billerCategory',
      key: 'billerCategory',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (status: string) => (
        <span className="capitalize">{status?.toLowerCase()}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: 80,
      render: (_: any, record: any) => (
        <ActionButtons
          id={record.id}
          billerCode={record.billerCode}
          editModalView="BILLER_EDIT"
          editViewModal="BILLER_VIEW"
          // showBillerModal={true}
        />
      ),
    },
  ];

  return (
    <div className="mb-8 overflow-hidden rounded shadow">
      <Table
        //@ts-ignore
        columns={columns}
        emptyText={t('table:empty-table-data')}
        data={merchants}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default BillerList;