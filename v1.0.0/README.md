# 1.0.0

### Binaries
- [android-release.aar](./android-release.aar)
- [iOS](./ios)

### Installation
- ReactNative: npm install "TBA package name"

## Examples
### React Native

Example code:
```tsx
import iBoxen, { Parcel } from "@iboxen/react-native-sdk";

const TOKEN = "" // JWT
const ENV = "production" // "production" | "staging"

// instantiate a new consumer object
const iBoxenConsumer = new iBoxen.Consumer(TOKEN, ENV) 

const App = () => {
  const [parcels, setParcels] = useState<Parcel[]>([])
  
  useEffect(() => {
    // get parcels for consumer
    iBoxenConsumer.getParcels().then(setParcels)
  }, [])

  return parcels.map(parcel => (
    <View key={parcel._id}>
      <Text>{parcel.parcelId}</Text>
      <Button title="Open locker" onPress={parcel.openLocker} />
    </View>
  ))
}
```
---
&nbsp;

`Consumer new iBoxen.Consumer(jwt token, environment)`

Constructing a new iBoxen consumer object used for interacting with iBoxen system.

`void initBluetooth()`

Initiate Bluetooth


`Promise getParcels()`

Get parcels for this iBoxen.Consumer

`Promise parcel.openLocker()`

Open the parcel's locker


`Promise parcel.isDoorClosed()`

Check if the parcel's locker door has been closed

&nbsp;

---
&nbsp;

### Android requirements
Requires the app to have the following permissions in manifest & allowed by user:

```xml   
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

Also location services enabled. Example Java code:
```java
public Boolean locationServicesEnabled() {
    LocationManager locationManager = (LocationManager) ctx.getSystemService(Context.LOCATION_SERVICE);

    Boolean enabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);

    return enabled;
}
```

Example check if Android Bluetooth is enabled:

```java
public Boolen bluetoothEnabled() {
    BluetoothAdapter mBluetoothAdapter;
    BluetoothManager mBluetoothManager = (BluetoothManager) ctx.getSystemService(ctx.BLUETOOTH_SERVICE);

    mBluetoothAdapter = (BluetoothAdapter) mBluetoothManager.getAdapter();

    return mBluetoothAdapter.isEnabled();
}
```

### iOS requirements 

### Version changes & compatibility