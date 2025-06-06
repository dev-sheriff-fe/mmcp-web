import { Settings, SettingsInput, SettingsOptionsInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from '@/data/client/http-client';
import settingsJson from '@/data/jsons/settings.json';

export const settingsClient = {
  ...crudFactory<Settings, any, SettingsOptionsInput>(API_ENDPOINTS.SETTINGS),
  all({ language }: { language: string }) {
    return Promise.resolve<any>(settingsJson);
  },
  update: ({ ...data }: SettingsInput) => {
    return HttpClient.post<Settings>(API_ENDPOINTS.SETTINGS, { ...data });
  },
};
