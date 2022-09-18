type Payload = {
  payload: string;
  validUntil: Date;
  port: number;
  mark: string;
  parcelId: string;
  controllerId: string;
  batteryPayload?: { payload: string };
};

export type { Payload };
