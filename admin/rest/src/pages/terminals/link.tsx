import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import Input from '@/components/ui/input';
import SelectInput from '@/components/ui/select-input';
import Modal from '@/components/ui/modal/modal';
import { useTranslation } from 'next-i18next';

type FormValues = {
  terminalId: string;
  terminalSerialNo: string;
  locationName: string;
  virtualAccountNo: string;
  status: string;
  tellers: string[];
  branchCode: string;
};

interface LinkTerminalModalProps {
  open?: boolean;
  onClose?: () => void;
  data?: any;
}

const statusOptions = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'maintenance', name: 'Maintenance' },
];

const tellerOptions = [
  { id: 'teller1', name: 'Teller 1' },
  { id: 'teller2', name: 'Teller 2' },
  { id: 'teller3', name: 'Teller 3' },
];

const branchCodeOptions = [
  { id: 'branch001', name: 'Branch 001 (Main)' },
  { id: 'branch002', name: 'Branch 002' },
  { id: 'branch003', name: 'Branch 003' },
];

const LinkTerminalModal = ({ open, onClose, data: propData }: LinkTerminalModalProps) => {
  const { t } = useTranslation();

  const contextData = useModalState();
  const contextClose = useModalAction().closeModal;
  
  const data = propData || contextData;
  const closeModal = onClose || contextClose;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      terminalId: data?.terminalId || '',
      terminalSerialNo: data?.terminalSerialNo || '',
      locationName: data?.locationName || '',
      virtualAccountNo: data?.virtualAccountNo || '',
      status: data?.status || 'active',
      tellers: data?.tellers || [],
      branchCode: data?.branchCode || '',
    },
  });

  function onSubmit(values: FormValues) {
    console.log('Terminal linking submitted:', values);

    closeModal();
  }

  const content = (
    <div className="m-auto w-[800px] rounded bg-light p-7 ">
      <div className="flex border-b border-dashed border-border-base py-2 sm:py-4">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:title-link-terminal')}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div className='grid gap-5 grid-cols-1 md:grid-cols-2 mt-8'>
          <Input
            label={t('form:input-label-terminal-id')}
            {...register('terminalId', {
              required: `${t('form:error-terminal-id-required')}`,
            })}
            variant="outline"
            error={t(errors.terminalId?.message!)}
          />
          
          <Input
            label={t('form:input-label-terminal-serial-no')}
            {...register('terminalSerialNo', {
              required: `${t('form:error-terminal-serial-no-required')}`,
            })}
            variant="outline"
            error={t(errors.terminalSerialNo?.message!)}
          />
          
          <Input
            label={t('form:input-label-location-name')}
            {...register('locationName', {
              required: `${t('form:error-location-name-required')}`,
            })}
            variant="outline"
            error={t(errors.locationName?.message!)}
          />
          
          <Input
            label={t('form:input-label-virtual-account-no')}
            {...register('virtualAccountNo')}
            variant="outline"
            error={t(errors.virtualAccountNo?.message!)}
          />
        </div>

        <div className='grid gap-5 grid-cols-1 md:grid-cols-2'>
          <div>
            <label className="mb-2 block text-sm font-semibold text-body">
              {t('form:input-label-status')}
            </label>
            <SelectInput
              name="status"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={statusOptions}
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-semibold text-body">
              {t('form:input-label-tellers')}
            </label>
            <SelectInput
              name="tellers"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={tellerOptions}
              isMulti
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-semibold text-body">
              {t('form:input-label-branch-code')}
            </label>
            <SelectInput
              name="branchCode"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={branchCodeOptions}
              rules={{ required: `${t('form:error-branch-code-required')}` }}
            />
            {errors.branchCode && (
              <p className="mt-1 text-xs text-red-500">
                {t(errors.branchCode.message!)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit">
            {t('form:button-label-link-terminal')}
          </Button>
        </div>
      </form>
    </div>
  );

  if (typeof open !== 'undefined') {
    return (
      <Modal open={open} onClose={closeModal}>
        {content}
      </Modal>
    );
  }

  return content;
};

export default LinkTerminalModal;