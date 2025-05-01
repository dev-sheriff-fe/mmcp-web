import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import TextArea from '@/components/ui/text-area';
import Input from '@/components/ui/input';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';

type FormValues = {
  products: Array<{
    productId: string;
    productCode: string;
    productName: string;
    productDesc: string;
    amount: number;
    amountType: string;
    status: string;
  }>;
  paymentData: Array<{
    fieldID: string;
    fieldName: string;
    fieldDataType: string;
    maxLength: number;
    mandatoryFlag: string;
  }>;
};

const BillerEdit = () => {
  const { t } = useTranslation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
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

  const amountTypeOptions = [
    { id: 'FIXED', name: 'Fixed' },
    { id: 'VARIABLE', name: 'Variable' }
  ];

  const datatypeOptions = [
    { id: 'STRING', name: 'String' },
    { id: 'NUMBER', name: 'Number' },
    { id: 'DATE', name: 'Date' },
  ];

  const mandatoryFlagOptions = [
    { id: 'Y', name: 'Yes' },
    { id: 'N', name: 'No' },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      products: data?.products || [{
        productId: '',
        productCode: '',
        productName: '',
        productDesc: '',
        amount: 0,
        amountType: 'FIXED',
        status: 'Active',
      }],
      paymentData: data?.paymentData || [{
        fieldID: '',
        fieldName: '',
        fieldDataType: 'STRING',
        maxLength: 0,
        mandatoryFlag: 'Y',
      }]
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    closeModal();
  }

  return (
    <div className="m-auto w-[800px] rounded bg-light px-4">
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
            {t('common:products')}
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'paymentData' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
            onClick={() => setActiveTab('paymentData')}
          >
            {t('common:payment-data')}
          </button>
        </div>

        <div className="px-10 py-7">
          {activeTab === 'products' && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">{t('common:products')}</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
                  <Input
                    label={t('form:input-label-product-id')}
                    {...register(`products.0.productId` as const)}
                    variant="outline"
                    error={t(errors.products?.[0]?.productId?.message!)}
                  />

                  <Input
                    label={t('form:input-label-product-code')}
                    {...register(`products.0.productCode` as const)}
                    variant="outline"
                    error={t(errors.products?.[0]?.productCode?.message!)}
                  />

                  <Input
                    label={t('form:input-label-product-name')}
                    {...register(`products.0.productName` as const)}
                    variant="outline"
                    error={t(errors.products?.[0]?.productName?.message!)}
                  />

                  <TextArea
                    label={t('form:input-label-product-desc')}
                    {...register(`products.0.productDesc` as const)}
                    variant="outline"
                    error={t(errors.products?.[0]?.productDesc?.message!)}
                  />

                  <Input
                    label={t('form:input-label-amount')}
                    type="number"
                    {...register(`products.0.amount` as const)}
                    variant="outline"
                    error={t(errors.products?.[0]?.amount?.message!)}
                  />

                  <div>
                    <Label>{t('form:input-label-amount-type')}</Label>
                    <SelectInput
                      name={`products.0.amountType` as const}
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={amountTypeOptions}
                    />
                  </div>

                  <div className="mb-5">
                    <Label>{t('form:input-label-status')}</Label>
                    <SelectInput
                      name="status"
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={statusData || []}
                      isLoading={!statusData}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button type="submit">
                    {t('form:button-text-save-product')}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'paymentData' && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">{t('common:payment-data')}</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
                  <Input
                    label={t('form:input-label-field-id')}
                    {...register(`paymentData.0.fieldID` as const)}
                    variant="outline"
                    error={t(errors.paymentData?.[0]?.fieldID?.message!)}
                  />

                  <Input
                    label={t('form:input-label-field-name')}
                    {...register(`paymentData.0.fieldName` as const)}
                    variant="outline"
                    error={t(errors.paymentData?.[0]?.fieldName?.message!)}
                  />

                  <div className="mb-5">
                    <Label>{t('form:input-label-field-data-type')}</Label>
                    <SelectInput
                      name="paymentData.0.fieldDataType"
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={datatypeOptions}
                    />
                  </div>

                  <Input
                    label={t('form:input-label-max-length')}
                    type="number"
                    {...register(`paymentData.0.maxLength` as const)}
                    variant="outline"
                    error={t(errors.paymentData?.[0]?.maxLength?.message!)}
                  />

                  <div className="mb-5">
                    <Label>{t('form:input-label-mandatory-flag')}</Label>
                    <SelectInput
                      name="paymentData.0.mandatoryFlag"
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={mandatoryFlagOptions}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button type="submit">
                    {t('form:button-text-save-collection')}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillerEdit;