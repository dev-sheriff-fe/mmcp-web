// import { Merchant } from '@/types';

// import * as yup from 'yup';

// export const MerchantValidationSchema = yup.object().shape({
//   name: yup.string().required('form:error-name-required'),
//   type: yup.string().required('form:error-type-required'),
//   amount: yup.mixed().when('type', {
//     is: (value: string) => value !== merchant.Free,
//     then: yup
//       .number()
//       .typeError('form:error-amount-must-number')
//       .positive('form:error-amount-must-positive')
//       .required('form:error-amount-required'),
//   }),
// });
