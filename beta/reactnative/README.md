# React Native implementation
targetSdkVersion 33
compileSdkVersion 33
minSdkVersion 21

![open locker flow](./open-locker-flow.png "flow")

## Install 

npm i @iboxen/react-native-sdk@1.0.2-beta.0

## Sample app

```tsx
import iBoxen from '@iboxen/react-native-sdk';
import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  Platform,
  PermissionsAndroid
} from 'react-native';

const TOKEN = "" // JWT
const ENV = "staging" // "production" | "staging"

iBoxen.init(TOKEN, { env: ENV, serviceId: "<REQUIRED SERVICE ID>" })

import PAYLOADS from '../PAYLOADS' // from your backend

function App(): JSX.Element {
  const [locker, setLocker] = useState()

  useEffect(() => {
    Platform.OS === 'android' &&
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN!,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT!,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION!,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION!,
      ]);

    iBoxen.initBluetooth()

    setLocker(iBoxen.getLocker(PAYLOADS))
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <Button
          onPress={() => locker.open()}
          title="open"
          color="#841584"
        />
        <Button
          onPress={() => locker.isDoorClosed()}
          title="isDoorClosed"
          color="#841584"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;

```

---

### Generic functions

Initiate iBoxen SDK

`iBoxen.init(JWT, { env: <environment>, serviceId: <supplied service id> })`

<br/>
Initiate iBoxen Bluetooth, required to be able to interact with the bluetooth-functionality. Performs Bluetooth state checks and permissions checks.

`Primise<boolean> void iBoxen.initBluetooth()`

<br/>

Get nearby peripherals

`Promise<String[]> iBoxen.getPeripherals()`

<br/>

Connect to peripheral

`Promise<boolean> iBoxen.connect(String: peripheralName)`

<br/>

Disconnect from all peripherals

`Primise iBoxen.disconnect()`

<br/>
Get locker instance from payloads

`const locker = iBoxen.getLocker(payloads)`

<br/>
Open locker

`Promise locker.open()`

<br/>
Detect if all doors are closed

`Promise<boolean> locker.isDoorClosed()`

__

### v3 lockers specific functions
The v3 locker is equipped with hardware that can detect WHICH doors are open/closed, unlike v2 which only can see that ANY is open/closed.

<br/>
Detect if this specific parcel payload door is closed

`Promise<boolean> locker.isDoorClosed()`
```js
await locker.isDoorClosed() // true
```

<br/>
Detect which doors of v3 locker is open

`Promise<Array[]> locker.getOpenDoors()`

Example:
```js
await locker.getOpenDoors() // [1, 3, 25]
```


### Mocking
Currently the SDK supports mocking the response of a v3 locker with functions `isDoorClosed()` & `getOpenDoors()`
```
IBOXEN_SDK_MOCK_SDK_RESPONSES = 1 // Signifies that we are mocking responses
IBOXEN_SDK_MOCKED_OPEN_DOORS = 2,5,6  // The mocked door state of the locker
IBOXEN_SDK_MOCKED_OPEN_DOORS_DELAY = 1000 // The delay before we send the payload back
IBOXEN_SDK_MOCK_V3_CARD = 1  // Enables us to run these mocks against a v1 or v2 card as if it were a v3 card
```


### Errors
All SDK-interaction promises can throw the following errors:

- "[iBoxenSDK] Bluetooth is not enabled"
- "[iBoxenSDK] SDK bluetooth is not initialized" (iBoxen.initBluetooth needs to be called)
- "[iBoxenSDK] Missing required permissions: android.permission.BLUETOOTH_SCAN, android.permission.BLUETOOTH_CONNECT"
