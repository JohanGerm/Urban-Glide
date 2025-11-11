const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

// Set global options
setGlobalOptions({ maxInstances: 10, region: 'us-central1' });

// Initialize Firebase Admin SDK (lazy)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Haversine distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Trigger when a new ride is created (searching status)
exports.onRideCreated = onDocumentCreated('rides/{rideId}', async (event) => {
  const snap = event.data;
  const ride = snap.data();
  const rideId = event.params.rideId;

  // Only proceed if ride is in searching status
  if (ride.status !== 'searching') {
    return null;
  }

  const pickupLat = ride.pickupLocation.latitude;
  const pickupLng = ride.pickupLocation.longitude;

  try {
    // Query available and verified drivers
    const driversSnapshot = await admin.firestore().collection('drivers')
      .where('isAvailable', '==', true)
      .where('isVerified', '==', true)
      .get();

    const nearbyDrivers = [];

    // Filter drivers within 5km radius
    driversSnapshot.forEach((doc) => {
      const driver = doc.data();
      if (driver.currentLocation && driver.currentLocation.latitude) {
        const distance = calculateDistance(
          pickupLat,
          pickupLng,
          driver.currentLocation.latitude,
          driver.currentLocation.longitude
        );

        // 5km = 5000 meters
        if (distance <= 5000) {
          nearbyDrivers.push({
            id: doc.id,
            name: driver.name,
            fcmToken: driver.fcmToken,
            distance: distance
          });
        }
      }
    });

    // Send notification to nearby drivers
    const notifications = nearbyDrivers.map(async (driver) => {
      if (driver.fcmToken) {
        const message = {
          notification: {
            title: 'New Ride Request',
            body: `Pickup: ${ride.pickupLocation.address || 'Nearby'} | Fare: R${ride.fare.toFixed(2)}`
          },
          data: {
            type: 'new_ride',
            rideId: rideId,
            passengerId: ride.passengerId,
            fare: ride.fare.toString(),
            pickupAddress: ride.pickupLocation.address || '',
            distance: driver.distance.toString()
          },
          token: driver.fcmToken
        };

        try {
          await admin.messaging().send(message);
          console.log(`Notification sent to driver ${driver.id}`);
        } catch (error) {
          console.error(`Error sending to driver ${driver.id}:`, error);
        }
      }
    });

    await Promise.all(notifications);
    console.log(`Notified ${nearbyDrivers.length} drivers for ride ${rideId}`);

    return null;
  } catch (error) {
    console.error('Error in onRideCreated:', error);
    return null;
  }
});

// Trigger when ride status changes to 'accepted'
exports.onRideAccepted = onDocumentUpdated('rides/{rideId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  // Check if status changed from searching to accepted
  if (before.status === 'searching' && after.status === 'accepted') {
    const rideId = event.params.rideId;

    try {
      // Get passenger FCM token
      const passengerDoc = await admin.firestore()
        .collection('passengers')
        .doc(after.passengerId)
        .get();

      const passengerToken = passengerDoc.data()?.fcmToken;

      if (passengerToken) {
        const message = {
          notification: {
            title: 'Driver Accepted Your Ride',
            body: `${after.driverName} is on the way! Vehicle: ${after.vehicleNumber}`
          },
          data: {
            type: 'ride_accepted',
            rideId: rideId,
            driverId: after.driverId,
            driverName: after.driverName,
            vehicleNumber: after.vehicleNumber
          },
          token: passengerToken
        };

        await admin.messaging().send(message);
        console.log(`Passenger notified for ride ${rideId}`);
      }

      return null;
    } catch (error) {
      console.error('Error in onRideAccepted:', error);
      return null;
    }
  }

  return null;
});

// Trigger when driver arrives at pickup (status: pickup)
exports.onDriverArrived = onDocumentUpdated('rides/{rideId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  // Check if status changed to pickup
  if (before.status !== 'pickup' && after.status === 'pickup') {
    const rideId = event.params.rideId;

    try {
      // Get passenger FCM token
      const passengerDoc = await admin.firestore()
        .collection('passengers')
        .doc(after.passengerId)
        .get();

      const passengerToken = passengerDoc.data()?.fcmToken;

      if (passengerToken) {
        const message = {
          notification: {
            title: 'Driver Has Arrived',
            body: `${after.driverName} is waiting at the pickup location`
          },
          data: {
            type: 'driver_arrived',
            rideId: rideId,
            driverId: after.driverId
          },
          token: passengerToken
        };

        await admin.messaging().send(message);
        console.log(`Passenger notified of driver arrival for ride ${rideId}`);
      }

      return null;
    } catch (error) {
      console.error('Error in onDriverArrived:', error);
      return null;
    }
  }

  return null;
});

// Trigger when ride is completed
exports.onRideCompleted = onDocumentUpdated('rides/{rideId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  // Check if status changed to completed
  if (before.status !== 'completed' && after.status === 'completed') {
    const rideId = event.params.rideId;

    try {
      // Notify passenger
      const passengerDoc = await admin.firestore()
        .collection('passengers')
        .doc(after.passengerId)
        .get();

      const passengerToken = passengerDoc.data()?.fcmToken;

      if (passengerToken) {
        const passengerMessage = {
          notification: {
            title: 'Ride Completed',
            body: `Total fare: R${after.fare.toFixed(2)}. Please rate your driver!`
          },
          data: {
            type: 'ride_completed',
            rideId: rideId,
            fare: after.fare.toString()
          },
          token: passengerToken
        };

        await admin.messaging().send(passengerMessage);
      }

      // Notify driver
      const driverDoc = await admin.firestore()
        .collection('drivers')
        .doc(after.driverId)
        .get();

      const driverToken = driverDoc.data()?.fcmToken;

      if (driverToken) {
        const driverMessage = {
          notification: {
            title: 'Ride Completed',
            body: `You earned R${after.fare.toFixed(2)} from this ride`
          },
          data: {
            type: 'ride_completed',
            rideId: rideId,
            earnings: after.fare.toString()
          },
          token: driverToken
        };

        await admin.messaging().send(driverMessage);
      }

      console.log(`Both parties notified for completed ride ${rideId}`);
      return null;
    } catch (error) {
      console.error('Error in onRideCompleted:', error);
      return null;
    }
  }

  return null;
});
