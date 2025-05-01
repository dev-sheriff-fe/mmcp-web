import { Table } from '@/components/ui/table';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useShippingClassesQuery } from '@/data/merchant';
import { SortOrder } from '@/types';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import axiosInstance from '@/utils/fetch-function';
import ActionButtons from '@/components/common/action-buttons';
import BillerProductList from '@/components/biller/biller-product-list';
import BillerCollectionList from '@/components/biller/biller-collection-list';


const BillerView = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: billerData } = useModalState();
  const { closeModal } = useModalAction();
  const locale = router.locale;
  

  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [activeTab, setActiveTab] = useState<'products' | 'paymentData'>('products');

  const { data: statusData } = useQuery(
    'status',
    () =>
      axiosInstance.get(
        'lookupdata/getdatabycategorycode/STATUS?entityCode=ETZ'
      ),
    {
      select: (data) =>
        data.data.map((item: any) => ({
          id: item.lookupCode,
          name: item.lookupName,
          description: item.lookupDesc,
        })),
    }
  );

    const {
      merchantClasses: billerProducts,
      merchantClasses: billerCollections,
      loading,
      error,
    } = useShippingClassesQuery({
      orderBy,
      sortedBy,
      language: locale,
      limit: 20,
    });

  return (
    <div className="m-auto w-[1000px] rounded bg-light px-4">
      <div className="flex border-b border-dashed border-border-base py-2 sm:py-4">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:title-biller-operations')}
        </h1>
      </div>
      <div className="mt-7">
        <div className="flex border-b border-border-200">
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'products' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
            onClick={() => setActiveTab('products')}
          >
            {t('common:view-products')}
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'paymentData' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
            onClick={() => setActiveTab('paymentData')}
          >
            {t('common:view-payment-data')}
          </button>
        </div>

        <div className="px-4 py-7">
          {activeTab === 'products' && (
            <div className="space-y-5">
              <BillerProductList
                onOrder={setOrder}
                onSort={setColumn}
                merchants={billerProducts}
              />
            </div>
          )}

          {activeTab === 'paymentData' && (
            <div className="space-y-5">
              {/* <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('common:payment-data')}</h3>
                <Button>
                  {t('form:button-text-add-payment-data')}
                </Button>
              </div> */}
              <BillerCollectionList
                onOrder={setOrder}
                onSort={setColumn}
                merchants={billerCollections}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillerView;