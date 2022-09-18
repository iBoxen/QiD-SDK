type CurrentStatus =
  | 'created'
  | 'on-way'
  | 'in-box'
  | 'marked-for-return'
  | 'collected'
  | 'driver-picked-up'
  | 'deviation';

type Parcel = {
  _id: string;
  parcelId: string;
  currentStatus: CurrentStatus;
};

export type { Parcel };
