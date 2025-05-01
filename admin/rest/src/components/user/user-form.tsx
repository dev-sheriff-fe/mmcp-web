import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from './user-validation-schema';
import { Permission } from '@/types';
import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import axiosInstance from '@/utils/fetch-function';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-toastify';

type FormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  userRole: string;
  branchStore: string;
  status: 'active' | 'inactive'
  supervisor?: string;
  password?: string;
  permission: Permission;
};

const defaultValues = {
  email: '',
  password: '',
};

const supervisorOptions = [
  { id: 'john_doe', name: 'John Doe' },
  { id: 'jane_smith', name: 'Jane Smith' },
  { id: 'mike_johnson', name: 'Mike Johnson' },
];

const CustomerCreateForm = () => {
  const { t } = useTranslation();

  // Fetch user roles from API
  const { data: userRolesData } = useQuery(
    'userRoles',
    () =>
      axiosInstance.get('lookupdata/getdatabycategorycode/USER_ROLE?entityCode=ETZ'),
    {
      select: (data) =>
        data.data.map((item: any) => ({
          id: item.lookupCode,
          name: item.lookupName,
          description: item.lookupDesc,
        })),
    }
  );

  const { data: branchCodesData } = useQuery(
    'branchCodes',
    () =>
      axiosInstance.get('lookupdata/getdatabycategorycode/BRANCH_CODE?entityCode=ETZ'),
    {
      select: (data) =>
        data.data.map((item: any) => ({
          id: item.lookupCode,
          name: item.lookupName,
          description: item.lookupDesc,
        })),
    }
  );

  const { data: statusData } = useQuery(
    'status',
    () =>
      axiosInstance.get('lookupdata/getdatabycategorycode/STATUS?entityCode=ETZ'),
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
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  const { mutate: saveUser, isLoading: saving } = useMutation(
    (formData: FormValues) =>
      axiosInstance.request({
        method: 'POST',
        url: 'usermanager/saveuser',
        data: formData,
      }),
    {
      onSuccess: (data) => {
        toast.success(t('form:user-created-success'));
        console.log('User saved successfully:', data);
      },
      onError: (error: any) => {
        if (error?.response?.data) {
          Object.keys(error.response.data).forEach((field: any) => {
            setError(field, {
              type: 'manual',
              message: error.response.data[field][0],
            });
          });
        } else {
          toast.error(t('common:error-creating-user'));
        }
      },
    }
  );

  const onSubmit = (values: FormValues) => {
    const payload = {
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobileNo: values.mobileNo,
      userRole: values.userRole,
      branchStore: values.branchStore,
      status: values.status,
      supervisor: values.supervisor,
      password: values.password,
      permission: values.permission || Permission.StoreOwner,
    };
    saveUser(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:user-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
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
              error={t(errors.username?.message!)}
            />

            <Input
              label={t('form:input-label-firstname')}
              {...register('firstName')}
              variant="outline"
              className="mb-5"
              error={t(errors.firstName?.message!)}
            />

            <Input
              label={t('form:input-label-lastname')}
              {...register('lastName')}
              variant="outline"
              className="mb-5"
              error={t(errors.lastName?.message!)}
            />

            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              variant="outline"
              className="mb-5"
              error={t(errors.email?.message!)}
            />

            <Input
              label={t('form:input-label-mobile-no')}
              {...register('mobileNo')}
              variant="outline"
              className="mb-5"
              error={t(errors.mobileNo?.message!)}
            />

            <div className="mb-5">
              <Label>{t('form:input-label-user-role')}</Label>
              <SelectInput
                name="userRole"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={userRolesData || []}
                isLoading={!userRolesData}
              />
            </div>

            <div className="mb-5">
              <Label>{t('form:input-label-branch-store')}</Label>
              <SelectInput
                name="branchStore"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={branchCodesData || []}
                isLoading={!branchCodesData}
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
              error={t(errors.password?.message!)}
            />
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          type="submit"
          loading={saving}
          disabled={saving}
        >
          {t('form:button-label-add-user')}
        </Button>
      </div>
    </form>
  );
};

export default CustomerCreateForm;