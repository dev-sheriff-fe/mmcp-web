import { SelectOption } from '@/types';
import axiosInstance from '@/utils/fetch-function';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

const useGetLookup = (categoryCode: string) => {
  const { data: lookupData } = useQuery<AxiosResponse<SelectOption[]>>(
    [categoryCode],
    () =>
      axiosInstance.request({
        url: 'lookupdata/getdatabycategorycode/' + categoryCode,
        method: 'GET',
        params: {
          entityCode: 'ETZ',
        },
      })
  );
  const lookupList: SelectOption[] | undefined = lookupData?.data ?? [];
  return lookupList;
};

export default useGetLookup;
