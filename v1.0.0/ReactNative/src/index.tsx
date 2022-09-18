import { Consumer } from './Consumer';
import { Driver } from './Driver';

class iBoxen {
  public static Driver = Driver;
  public static Consumer = Consumer;
}

export default iBoxen;
export type { Parcel } from './types';
