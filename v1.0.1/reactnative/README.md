
# React Native implementation

![open locker flow](./open-locker-flow.png "flow")


```tsx
import iBoxen, { Parcel } from "@iboxen/react-native-sdk";

const TOKEN = "" // JWT
const ENV = "production" // "production" | "staging"

// instantiate a new iboxen object
const iBoxenInterface = new iBoxen(TOKEN, ENV) 

const App = () => {
  const [parcel, setParcel] = useState<Parcel>(null)

  useEffect(() => {
    // get parcel
    const parcelPayload = await iBoxenInterface.getPayload("1Z8E444V0497700608")

    // load it
    const parcelPayload = iBoxenInterface.loadParcelData(parcelData)
  }, [])

  return (
    <View key={parcelData._id}>
      <Text>{parcelData.parcelId}</Text>
      <Button title="Open locker" onPress={parcelData.openLocker} />
      <Button title="Sense door closed" onPress={parcelData.isDoorClosed} />
      <Button title="Set status collected" onPress={parcelData.setCollected} />
    </View>
  )
}
```
---
&nbsp;

`iBoxen new iBoxen(jwt token, environment)`

Constructing a new iBoxen consumer object used for interacting with iBoxen system.

`void initBluetooth()`

Initiate Bluetooth

`Promise iBoxen.loadParcelData(payload)`

Load parcel payload

`Promise parcel.openLocker()`

Open the parcel's locker


`Promise parcel.isDoorClosed()`

Check if the parcel's locker door has been closed

`Promise parcel.setCollected()`

Set parcel as collected, deleting the user's digital key

&nbsp;
