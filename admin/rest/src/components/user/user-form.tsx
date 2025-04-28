import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRegisterMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from './user-validation-schema';
import { Permission } from '@/types';
import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';

type FormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  userRole: string;
  branchStore: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  supervisor?: string;
  password?: string;
  permission: Permission;
};

const defaultValues = {
  email: '',
  password: '',
};

const userRoleOptions = [
  { id: 'admin', name: 'Administrator' },
  { id: 'manager', name: 'Manager' },
  { id: 'supervisor', name: 'Supervisor' },
  { id: 'cashier', name: 'Cashier' },
  { id: 'support', name: 'Support Staff' },
];

const branchStoreOptions = [
  { id: 'main', name: 'Main Branch' },
  { id: 'north', name: 'North Branch' },
  { id: 'south', name: 'South Branch' },
  { id: 'east', name: 'East Branch' },
  { id: 'west', name: 'West Branch' },
];

const supervisorOptions = [
  { id: 'john_doe', name: 'John Doe' },
  { id: 'jane_smith', name: 'Jane Smith' },
  { id: 'mike_johnson', name: 'Mike Johnson' },
];

const statusOptions = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'locked', name: 'Locked' },
  { id: 'pending', name: 'Pending' },
];

const CustomerCreateForm = () => {
  const { t } = useTranslation();
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  async function onSubmit({ email, password, firstName, lastName }: FormValues) {
      registerUser(
        {
          email,
          password: password ?? '',
          name: `${firstName} ${lastName}`,
          permission: Permission.StoreOwner,
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: 'manual',
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:user-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          {/* User Information */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2 pt-5 mt-2">
              <h3 className="text-lg font-semibold mb-5">
                {t('form:section-title-user-info')}
              </h3>
            </div>
            
            <Input
              label={t('form:input-label-username')}
              {...register('username')}
              variant="outline"
              className="mb-5"
            />
            
            <Input
              label={t('form:input-label-firstname')}
              {...register('firstName')}
              variant="outline"
              className="mb-5"
            />
            
            <Input
              label={t('form:input-label-lastname')}
              {...register('lastName')}
              variant="outline"
              className="mb-5"
            />
            
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              variant="outline"
              className="mb-5"
            />
            
            <Input
              label={t('form:input-label-mobile-no')}
              {...register('mobileNo')}
              variant="outline"
              className="mb-5"
            />
            
            <div className="mb-5">
              <Label>{t('form:input-label-user-role')}</Label>
              <SelectInput
                name="userRole"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={userRoleOptions}
              />
            </div>
            
            <div className="mb-5">
              <Label>{t('form:input-label-branch-store')}</Label>
              <SelectInput
                name="branchStore"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={branchStoreOptions}
              />
            </div>
            
            <div className="mb-5">
              <Label>{t('form:input-label-status')}</Label>
              <SelectInput
                name="status"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={[
                  { id: 'active', name: 'Active' },
                  { id: 'inactive', name: 'Inactive' },
                  { id: 'locked', name: 'Locked' },
                  { id: 'pending', name: 'Pending' }
                ]}
              />
            </div>
            
            <div className="mb-5">
              <Label>{t('form:input-label-supervisor')}</Label>
              <SelectInput
                name="supervisor"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={supervisorOptions}
              />
            </div>
            
      
              <Input
                label={t('form:input-label-password')}
                type="password"
                {...register('password')}
                variant="outline"
                className="mb-5"
              />
  
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        {/* {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )} */}

        <Button >
          {t('form:button-label-add-user')}
        </Button>
      </div>
    </form>
  );
};

export default CustomerCreateForm;
