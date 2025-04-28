import { useState } from 'react';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import TransactionList from '@/components/transaction/transaction-list';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import CategoryTypeFilter from '@/components/transaction/category-type-filter';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import { useShippingClassesQuery } from '@/data/merchant';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const locale = router.locale;

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rrn, setRrn] = useState<string>('');
  const [merchantCode, setMerchantCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [terminalId, setTerminalId] = useState<string>('');


  
  const { merchantClasses: transactions, loading, error } = useShippingClassesQuery({
    name: searchTerm,
    orderBy,
    sortedBy,
    language: locale,
    limit: 20,
    page,
    // type,
    // categories: category,
    transactionType,
    status,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    rrn,
    merchantCode,
    terminalId,
  });

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  const handleTransactionTypeFilter = (selectedOption: any) => {
    setPage(1);
    setTransactionType(selectedOption?.value || null);
  };

  const handleStatusFilter = (selectedOption: any) => {
    setPage(1);
    setStatus(selectedOption?.value || null);
  };

  const handleStartDateChange = (date: Date | null) => {
    setPage(1);
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setPage(1);
    setEndDate(date);
  };

  const handleRrnFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setRrn(e.target.value);
  };

  const handleMerchantCodeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setMerchantCode(e.target.value);
  };

  const handleNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setName(e.target.value);
  };

  const handleTerminalIdFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setTerminalId(e.target.value);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:input-label-transactions')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
          <CategoryTypeFilter
            onTransactionTypeFilter={handleTransactionTypeFilter}
            onStatusFilter={handleStatusFilter}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onRrnFilter={handleRrnFilter}
            onMerchantCodeFilter={handleMerchantCodeFilter}
            onNameFilter={handleNameFilter}
            onTerminalIdFilter={handleTerminalIdFilter}
            // onCategoryFilter={(selectedOption: any) => setCategory(selectedOption?.value || '')}
            // onTypeFilter={(selectedOption: any) => setType(selectedOption?.value || '')}
          />
          </div>
        </div>
      </Card>

      <TransactionList
        merchants={transactions}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

TransactionsPage.authenticate = {
  permissions: adminOnly,
};

TransactionsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});