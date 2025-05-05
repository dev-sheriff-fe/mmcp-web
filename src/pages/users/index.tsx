import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import CustomerList from '@/components/user/user-list';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useUsersQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { users, paginatorInfo, loading, error } = useUsersQuery({
    limit: 20,
    page,
    name: searchTerm,
    orderBy,
    sortedBy,
  });
  const { data, isLoading } = useQuery(
    'users',
    () =>
      axiosInstance.request({
        method: 'GET',
        url: '/usermanager/getUserMasterList',
        params: {
          pageNumber: page,
          pageSize: 20,
          name: searchTerm,
          role: '',
          mobileNo: '',
        },
      }),
    {}
  );
  const newPaginatorInfo = {
    currentPage: page,
    firstPageUrl: '',
    from: 1,
    lastPage: data?.data?.totalPages,
    lastPageUrl: '',
    links: [],
    nextPageUrl: null,
    path: '',
    perPage: 20,
    prevPageUrl: null,
    to: 10,
    total: data?.data?.totalCount,
    hasMorePages: data?.data?.totalPages > page,
  };

  if (isLoading || loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">Users</h1>
        </div>

        <div className="flex w-full items-center ms-auto md:w-3/4">
          <Search onSearch={handleSearch} />
          <LinkButton
            href={`${Routes.user.create}`}
            className="h-12 ms-4 md:ms-6"
          >
            <span>+ Add Users</span>
          </LinkButton>
        </div>
      </Card>

      {loading ? null : (
        <CustomerList
          customers={data?.data?.userInfoList ?? users ?? []}
          paginatorInfo={
            newPaginatorInfo.total ? newPaginatorInfo : paginatorInfo
          }
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      )}
    </>
  );
}

Customers.authenticate = {
  permissions: adminOnly,
};
Customers.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
