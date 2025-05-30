import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import Link from '@/components/ui/link';
import Form from '@/components/ui/forms/form';
import { Routes } from '@/config/routes';
import { useLogin } from '@/data/user';
import type { LoginInput } from '@/types';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Router from 'next/router';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import { useMutation } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import { log } from 'console';

const loginFormSchema = yup.object().shape({
  email: yup.string().required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
});

const LoginForm = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      axiosInstance.post('/usermanager/weblogin', {
        username: email,
        password: password,
        userlang: 'en',
        deviceId: '000',
        channelType: 'WEB',
      }),
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.data.ticketID);
        localStorage.setItem('user', JSON.stringify(data.data));
        if (data?.data?.ticketID) {
          if (hasAccess(allowedRoles, ['store_owner', 'super_admin'])) {
            setAuthCredentials(data?.data.ticketID, [
              'store_owner',
              'super_admin',
            ]);
            Router.push(Routes.dashboard);
            return;
          }
          setErrorMessage('form:error-enough-permission');
        } else {
          setErrorMessage('form:error-credential-wrong');
        }
      },
    }
  );

  function onSubmit({ email, password }: LoginInput) {
    // login(
    //   {
    //     email,
    //     password,
    //   },
    //   {
    //     onSuccess: (data) => {
    //       if (data?.token) {
    //         if (hasAccess(allowedRoles, data?.permissions)) {
    //           setAuthCredentials(data?.token, data?.permissions);
    //           Router.push(Routes.dashboard);
    //           return;
    //         }
    //         setErrorMessage('form:error-enough-permission');
    //       } else {
    //         setErrorMessage('form:error-credential-wrong');
    //       }
    //     },
    //     onError: () => {},
    //   }
    // );
    loginMutation.mutate({ email, password });
  }

  return (
    <>
      <Form<LoginInput> validationSchema={loginFormSchema} onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={'Username'}
              {...register('email')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors?.email?.message!)}
            />
            <PasswordInput
              label={t('form:input-label-password')}
              forgotPassHelpText={t('form:input-forgot-password-label')}
              {...register('password')}
              error={t(errors?.password?.message!)}
              variant="outline"
              className="mb-4"
              forgotPageLink={Routes.forgotPassword}
            />
            <Button
              className="w-full"
              loading={loginMutation.isLoading}
              disabled={loginMutation.isLoading}
            >
              {t('form:button-label-login')}
            </Button>

            {/* <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
              <hr className="w-full" />
              <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4">
                {t('common:text-or')}
              </span>
            </div> */}

            {/* <div className="text-center text-sm text-body sm:text-base">
              {t('form:text-no-account')}{' '}
              <Link
                href={Routes.register}
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {t('form:link-register-shop-owner')}
              </Link>
            </div> */}
          </>
        )}
      </Form>
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </>
  );
};

export default LoginForm;

{
  /* {errorMsg ? (
          <Alert
            message={t(errorMsg)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMsg('')}
          />
        ) : null} */
}
