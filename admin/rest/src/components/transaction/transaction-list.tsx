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

const TransactionList = ({ merchants, onSort, onOrder }: IProps) => {
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
      title: t('table:table-item-transaction-serial-no'),
      dataIndex: 'TransactionSN',
      key: 'TransactionSN',
      align: 'center',
      width: 50,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: t('table:table-item-transaction-ref'),
      dataIndex: 'tranRefNo',
      key: 'transactionRef',
      align: alignLeft,
      width: 80,
    },
    {
      title: t('table:table-item-posted-date'),
      dataIndex: 'createdDate',
      key: 'postedDate',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-transaction-type'),
      dataIndex: 'id',
      key: 'TransactionType',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      width: 80,
    },
    // {
    //   title: t('table:table-item-wallet-id'),
    //   dataIndex: 'name',
    //   key: 'walletID',
    //   align: alignLeft,
    //   width: 80,
    // },
    {
      title: t('table:table-item-terminal-id'),
      dataIndex: 'terminalId',
      key: 'terminalID',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-rrn'),
      dataIndex: 'rrn',
      key: 'rrn',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-stan'),
      dataIndex: 'stan',
      key: 'stan',
      align: 'center',
      width: 80,
    },
    //     {
    //   title: t('table:table-item-wallet-id'),
    //   dataIndex: 'name',
    //   key: 'walletID',
    //   align: alignLeft,
    //   width: 80,
    // },
    {
      title: t('table:table-item-posted-by'),
      dataIndex: 'createdBy',
      key: 'postedBy',
      align: "center",
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
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 50,
      render: (id: string, { slug, is_active }: any) => (
        <ActionButtons
          id={id}
          editUrl={`${Routes.merchant.list}/edit/${id}`}
          detailsUrl={`/${slug}`}
          // addTerminalUrl={`${Routes.merchant.list}/${id}/add-terminal`}
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

export default TransactionList;