import { NativeModules, Platform } from 'react-native';

import Api from './Api';

const LINKING_ERROR =
  "The package 'react-native-iboxen-sdk' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const IboxenSdk = NativeModules.IboxenSdk
  ? NativeModules.IboxenSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

class Driver {
  public static apiBaseUrls = { production: '', staging: '', demo: '' };

  private api: Api;

  constructor(
    token: string,
    env: keyof typeof Driver.apiBaseUrls = 'production'
  ) {
    this.api = new Api(Driver.apiBaseUrls[env], {
      headers: { authorization: `Bearer ${token}` },
    });
  }

  createUser(phone: string) {
    return this.api.post('/auth/login', { phone });
  }

  getParcel(parcelId: string) {
    return this.api.get(`/parcels/${parcelId}`, {});
  }

  static multiply(a: number, b: number): Promise<number> {
    return IboxenSdk.multiply(a, b);
  }
}

export { Driver };
