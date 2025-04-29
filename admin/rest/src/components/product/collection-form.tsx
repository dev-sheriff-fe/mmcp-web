import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Label from '@/components/ui/label';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import TextArea from '@/components/ui/text-area';

const defaultValues = {
  fieldCode: '',
  fieldName: '',
  dataType: 'TEXT',
  fieldLength: '',
  mandatory: false,
  inputType: false,
  lookupData: '',
};

type CollectionField = {
  fieldCode: string;
  fieldName: string;
  dataType: string;
  fieldLength: string;
  mandatory: boolean;
  inputType: boolean;
  lookupData: string;
};

type IProps = {
  initialValues?: CollectionField | null;
};

const dataTypeOptions = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'DATE', label: 'Date' },
];

const yesNoOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export default function AddCollectionForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CollectionField>({
    defaultValues: initialValues ?? defaultValues,
  });

  const onSubmit = async (values: CollectionField) => {
    // Handle form submission
    console.log('Collection field submitted:', values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:collection-field-description')}
          details={t('form:collection-field-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Field Code */}
            <Input
              label={t('form:input-label-field-code')}
              {...register('fieldCode', { required: 'Field code is required' })}
              variant="outline"
              error={t(errors.fieldCode?.message!)}
            />

            {/* Field Name */}
            <Input
              label={t('form:input-label-field-name')}
              {...register('fieldName', { required: 'Field name is required' })}
              variant="outline"
              error={t(errors.fieldName?.message!)}
            />

            {/* Data Type */}
            <div>
              <Label>{t('form:input-label-data-type')}</Label>
              <SelectInput
                name="dataType"
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={dataTypeOptions}
                rules={{ required: 'Data type is required' }}
              />
              {errors.dataType && (
                <p className="mt-1 text-xs text-red-500">
                  {t(errors.dataType.message!)}
                </p>
              )}
            </div>

            {/* Field Length */}
            <Input
              label={t('form:input-label-field-length')}
              {...register('fieldLength')}
              variant="outline"
              type="number"
            />

            {/* Mandatory */}
            <div>
              <Label>{t('form:input-label-mandatory')}</Label>
              <SelectInput
                name="mandatory"
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={yesNoOptions}
              />
            </div>

            {/* Input Type */}
            <div>
              <Label>{t('form:input-label-input-type')}</Label>
              <SelectInput
                name="inputType"
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={yesNoOptions}
              />
            </div>

            {/* Lookup Data - Full width */}
            <div className="md:col-span-2">
              <Label>{t('form:input-label-lookup-data')}</Label>
              <TextArea
                {...register('lookupData')}
                placeholder={t('form:input-placeholder-lookup-data')}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>

        <Button type="submit">
          {t('form:button-label-save')}
        </Button>
      </div>
    </form>
  );
}