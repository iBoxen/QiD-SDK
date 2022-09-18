import { NativeModules, Platform } from 'react-native';
import { CONSUMER_API_PRODUCTION_URL, CONSUMER_API_STAGING_URL } from '@env';

import Api from './Api';
import type { Parcel, Payload } from './types';
import { DoorNotClosedError, InvalidParcel } from './errors';

const LINKING_ERROR =
  "The package 'react-native-iboxen-sdk' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const iBoxenSDK = NativeModules.iBoxenSDK
  ? NativeModules.iBoxenSDK
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );
class Consumer {
  public static apiBaseUrls = {
    production: CONSUMER_API_PRODUCTION_URL,
    staging: CONSUMER_API_STAGING_URL,
    demo: '',
  };

  public env: keyof typeof Consumer.apiBaseUrls;
  public parcels?: Parcel[];

  private api: Api;
  private payloads?: {
    [_id: string]: Payload;
  };

  constructor(
    token: string,
    env: keyof typeof Consumer.apiBaseUrls = 'staging'
  ) {
    this.env = env;
    this.api = new Api(Consumer.apiBaseUrls[env], {
      headers: { authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOnsiX2lkIjoiNjFlMTdiZjAzY2I4YzcwNWVhY2FmM2UxIiwicGhvbmUiOiIrNDY3NjI3Mjk5MTMifX0.kSPjVTMl2Ld6mm0wxSwKfaIPFa9vQVYqReju2-pSy_Y' },
    });
  }

  async getParcels() {
    this.parcels = await this.api.get<Parcel[]>('/v1/parcels');

    const inLockerParcels = this.parcels
      .filter((parcel) => ['in-box'].includes(parcel.currentStatus))
      .map(({ _id }) => _id);
    if (inLockerParcels.length) {
      const payloads = await this.api.get<Payload[]>(
        `/v1/payloads?parcelIds=${inLockerParcels.join(',')}`
      );
      this.payloads = payloads.reduce(
        (v, payload) => ({ ...v, [payload.parcelId]: payload }),
        {}
      );
    }

    return this.parcels;
  }

  getLocation(locationId: string) {
    return this.api.get(`/v1/locations/${locationId}`);
  }

  getLocationImages(locationId: string) {
    return this.api.get(`/v1/locations/${locationId}/images`);
  }

  // NATIVE

  async openLocker({ parcelId }: Pick<Parcel, 'parcelId'>) {
    const parcel = this.parcels?.find((p) => p.parcelId === parcelId);
    const payload = parcel && this.payloads?.[parcel._id];
    if (!payload || !parcel) {
      throw new InvalidParcel();
    }

    if (new Date() > payload.validUntil) {
      throw new InvalidParcel('Stale parcel data');
    }

    try {
      console.log('Sending payload', payload.payload);
      const hashResponse = await this.sendPayload(payload.payload);
      console.log('Hash response: ', hashResponse);

      if (parcel.currentStatus !== 'collected') {
        await this.api.put(`/v1/parcels/${parcel.parcelId}`, { hashResponse });
        parcel.currentStatus = 'collected';

        const FIVE_MINUTES_IN_MS = 300000;
        payload.validUntil = new Date(Date.now() + FIVE_MINUTES_IN_MS);

        if (payload.batteryPayload) {
          const batteryResponse = await this.sendPayload(
            payload.batteryPayload.payload
          );
          const voltage =
            parseInt(batteryResponse.substring(64, 100), 16) / 1000;
          await this.api.put(
            `/v1/controllers/${payload.controllerId}/voltage`,
            {
              voltage,
            }
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async initBluetooth() {
    if (this.env === 'demo') {
      return;
    }
    if (Platform.OS === 'android') {
      iBoxenSDK.initBluetooth();
    }
  }

  async sendPayload(payload: string): Promise<string> {
    if (this.env === 'demo') {
      return 'hash';
    }

    // Sentry.setTag('controllerId', payload.split('.')[0]);

    const hash = await iBoxenSDK.sendPayload(payload);

    return hash;
  }

  async getPeripherals(): Promise<string[]> {
    if (this.env === 'demo') {
      // TODO: Add mocked peripheral.
      return [];
    }

    const peripherals = await iBoxenSDK.getPeripherals();

    return peripherals.filter(
      (p: string) => p.length === 8 && p === p.replace(/\W/g, '')
    );
  }

  isDoorClosed(senseDoorOpen: string, hash: string) {
    const boardIsInverted = senseDoorOpen === '00';
    const lastBytes = hash.slice(-2);

    const doorClosed = boardIsInverted
      ? lastBytes !== '01'
      : lastBytes === '01';

    if (!doorClosed) {
      throw new DoorNotClosedError();
    }
  }
}

export { Consumer };
