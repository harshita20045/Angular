import { InjectionToken } from '@angular/core';

export interface AppConfig {
  appName: string;
  version: string;
  apiEndpoint: string;
  enableTelemetry: boolean;
  currency: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: () => ({
    appName: 'Pulse Enterprise Suite',
    version: '2.4.0',
    apiEndpoint: 'https://api.pulse-enterprise.internal/v1',
    enableTelemetry: true,
    currency: 'USD'
  })
});
