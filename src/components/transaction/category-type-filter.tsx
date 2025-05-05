import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import { useTypesQuery } from '@/data/type';
import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';

type Props = {
  onTransactionTypeFilter: (
    newValue: any,
    actionMeta: ActionMeta<unknown>
  ) => void;
  onStatusFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onRrnFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMerchantCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTerminalIdFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function CategoryTypeFilter({
  onTransactionTypeFilter,
  onStatusFilter,
  onStartDateChange,
  onEndDateChange,
  onRrnFilter,
  onMerchantCodeFilter,
  onNameFilter,
  onTerminalIdFilter,
  className,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const transactionTypes = [
    { value: 'purchase', label: t('common:purchase') },
    { value: 'refund', label: t('common:refund') },
    { value: 'void', label: t('common:void') },
    { value: 'preauth', label: t('common:preauth') },
  ];

  const statusOptions = [
    { value: 'success', label: t('common:success') },
    { value: 'failed', label: t('common:failed') },
    { value: 'pending', label: t('common:pending') },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      <div className="w-full">
        <Label>{t('common:transaction-type')}</Label>
        <Select
          options={transactionTypes}
          placeholder={t('common:select-transaction-type')}
          onChange={onTransactionTypeFilter}
        />
      </div>

      <div className="w-full">
        <Label>{t('common:start-date')}</Label>
        <DatePicker
          selected={null}
          onChange={onStartDateChange}
          placeholderText={t('common:select-start-date')}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:end-date')}</Label>
        <DatePicker
          selected={null}
          onChange={onEndDateChange}
          placeholderText={t('common:select-end-date')}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:rrn')}</Label>
        <Input
          name="rrn"
          placeholder={t('common:enter-rrn')}
          onChange={onRrnFilter}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:status')}</Label>
        <Select
          options={statusOptions}
          placeholder={t('common:select-status')}
          onChange={onStatusFilter}
        />
      </div>

      <div className="w-full">
        <Label>{t('common:merchant-code')}</Label>
        <Input
          name="merchantCode"
          placeholder={t('common:enter-merchant-code')}
          onChange={onMerchantCodeFilter}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:name')}</Label>
        <Input
          name="name"
          placeholder={t('common:enter-name')}
          onChange={onNameFilter}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:terminal-id')}</Label>
        <Input
          name="terminalId"
          placeholder={t('common:enter-terminal-id')}
          onChange={onTerminalIdFilter}
          className="w-full"
        />
      </div>
    </div>
  );
}
