package com.nearbymod;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import android.util.Log;

import android.Manifest;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.nearby.connection.Strategy;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import android.widget.Toast;
import android.content.Context;
import java.time.LocalTime;
import java.time.Duration;

public class NearbyModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final String SERVICE_ID = "com.nearbymod.SERVICE_ID";
    private final Strategy STRATEGY = Strategy.P2P_STAR;
    private final List<String> mDiscoveredEndpoints = new ArrayList<>();
    private Callback discoveryCallback;

    // DEFINING THE TWO VARIABLES TO CAPTURE THE DIFFERENT TIMES.
    private LocalTime currentTimeFound;
    private LocalTime currentTimeAcceptConnection;

    NearbyModule(ReactApplicationContext context) {

        super(context);
        this.reactContext = context;
    }
    @Override
    public String getName() {
        return "NearbyModule";
    }
    @ReactMethod
    public void createNearbyEvent(String name, String location) {
        Log.d("NearybModule", "Create event called with name: " + name
                + " and location: " + location);
    }

    @ReactMethod
    public void getDiscoveredEndpoints(Callback callback) {
         WritableArray endpointsArray = Arguments.createArray();
         for (String endpoint : mDiscoveredEndpoints) {
            endpointsArray.pushString(endpoint);
        }
        callback.invoke("Testing discovered Endpoints !");
    }


    @ReactMethod
    public void startDiscovering(Callback callback) {
        this.discoveryCallback = callback;
        DiscoveryOptions discoveryOptions = new DiscoveryOptions.Builder().setStrategy(STRATEGY).build();
        ConnectionsClient connectionsClient = Nearby.getConnectionsClient(reactContext);
        connectionsClient.startDiscovery(SERVICE_ID, endpointDiscoveryCallback, discoveryOptions)
                .addOnSuccessListener(unused -> {
                    Toast.makeText(reactContext, "Started discovering!", Toast.LENGTH_SHORT).show();
                    // Log.d("NearbyModule", "Discovery started successfully!");
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(reactContext, "Failed!"+e.getMessage(), Toast.LENGTH_SHORT).show();
                    // Log.e("NearbyModule", "Failed to start discovery: " + e.getMessage());
                });
    }

    private final EndpointDiscoveryCallback endpointDiscoveryCallback =
            new EndpointDiscoveryCallback() {
                @Override
                public void onEndpointFound(String endpointId, DiscoveredEndpointInfo info) {
                    // A new endpoint was found.
                    // Declaring the currentTimeFound variable.
                    currentTimeFound = LocalTime.now();
                    String toastMessage = "Endpoint found: " + endpointId + info + LocalTime.now().toString();
                    Toast.makeText(reactContext, toastMessage, Toast.LENGTH_SHORT).show();
                    Log.d("NearbyModule", "Endpoint found: " + endpointId);
                    mDiscoveredEndpoints.add(endpointId);
                    stopDiscovering();
                    discoveryCallback.invoke("endpoint found");
                    // Nearby.getConnectionsClient(reactContext)
                    //         .requestConnection(getLocalUserName(), endpointId, DconnectionLifecycleCallback)
                    //         .addOnSuccessListener(
                    //                 (Void unused) -> {
                    //                     // We successfully requested a connection. Now both sides
                    //                     // must accept before the connection is established.
                    //                     Toast.makeText(reactContext, "Connection request !", Toast.LENGTH_SHORT).show();
                    //                 })
                    //         .addOnFailureListener(
                    //                 (Exception e) -> {
                    //                     Toast.makeText(reactContext, "Connection request failed !"+e.getMessage(), Toast.LENGTH_SHORT).show();
                    //                     // Nearby Connections failed to request the connection.
                    //                 });
                }

                @Override
                public void onEndpointLost(String endpointId) {
                    // A previously discovered endpoint has gone away.
                    Toast.makeText(reactContext, "Endpoint lost !", Toast.LENGTH_SHORT).show();
                    Log.d("NearbyModule", "Endpoint lost: " + endpointId);
                    Nearby.getConnectionsClient(reactContext).disconnectFromEndpoint(endpointId);
                } 
            };
            @ReactMethod
            public void startAdvertising() {
                AdvertisingOptions advertisingOptions = new AdvertisingOptions.Builder().setStrategy(STRATEGY).build();
                Nearby.getConnectionsClient(reactContext)
                        .startAdvertising(getLocalUserName(), SERVICE_ID, AconnectionLifecycleCallback, advertisingOptions)
                        .addOnSuccessListener(
                                (Void unused) -> {
                                    // We're advertising!
                                    Toast.makeText(reactContext, "Started advertising!", Toast.LENGTH_SHORT).show();
                                    Log.d("NearbyModule", "Advertising started successfully!");
                                })
                        .addOnFailureListener(
                                (Exception e) -> {
                                    // We were unable to start advertising.
                                    Toast.makeText(reactContext, "Advertising Failed !"+e.getMessage(), Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Failed to start advertising: " + e.getMessage());
                                });
            }
            @ReactMethod
            public void stopDiscovering() {
                Nearby.getConnectionsClient(reactContext).stopDiscovery();
                Toast.makeText(reactContext, "Stoped Discovering !", Toast.LENGTH_SHORT).show();
            }
            @ReactMethod
            public void stopAdvertising() {
                Nearby.getConnectionsClient(reactContext).stopAdvertising();
                Toast.makeText(reactContext, "Stoped Advertising !", Toast.LENGTH_SHORT).show();
            }
            @ReactMethod
            public void connectToEndpoint(String endpointId) {
                Nearby.getConnectionsClient(reactContext)
                        .requestConnection(getLocalUserName(), endpointId, AconnectionLifecycleCallback)
                        .addOnSuccessListener(
                                (Void unused) -> {
                                    // We successfully requested a connection. Now both sides
                                    // must accept before the connection is established.
                                    Toast.makeText(reactContext, "Connection request !", Toast.LENGTH_SHORT).show();
                                })
                        .addOnFailureListener(
                                (Exception e) -> {
                                    Toast.makeText(reactContext, "Connection request failed !", Toast.LENGTH_SHORT).show();
                                    // Nearby Connections failed to request the connection.
                                });
            }

    // advertising callback
            private final ConnectionLifecycleCallback AconnectionLifecycleCallback =
                    new ConnectionLifecycleCallback() {
                        @Override
                        public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
                            // Automatically accept the connection on both sides.
                            
                            Nearby.getConnectionsClient(reactContext).acceptConnection(endpointId, payloadCallback);

                        }
        
                        @Override
                        public void onConnectionResult(String endpointId, ConnectionResolution result) {
                            //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                            switch (result.getStatus().getStatusCode()) {
                                case ConnectionsStatusCodes.STATUS_OK:
                                    // We're connected! Can now start sending and receiving data.
                                    // Returning the callback to the js with the two variables.
                                    currentTimeAcceptConnection = LocalTime.now();
                                    Duration duration = Duration.between(currentTimeFound, currentTimeAcceptConnection);
                                    long diffInSeconds = duration.toMillis();
                                    String diff = currentTimeFound.toString() + ',' + currentTimeAcceptConnection.toString()+','+ diffInSeconds;

                                    if (discoveryCallback != null) {
                                        discoveryCallback.invoke(diff);
                                    }
                                     Toast.makeText(reactContext, "Request Accepted !" + LocalTime.now().toString(), Toast.LENGTH_SHORT).show();
                                     Log.d("NearbyModule", "Connected to endpoint: " + endpointId + " at " + LocalTime.now().toString());
                                    //SENDING DATA BETWEEN DEVICES
                                    //Payload bytesPayload = Payload.fromBytes(new byte[] {0xa, 0xb, 0xc, 0xd});
                                    // Nearby.getConnectionsClient(reactContext).sendPayload(endpointId, bytesPayload);
                                    break;
                                case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                                    // The connection was rejected by one or both sides.
                                    Toast.makeText(reactContext, "Request rejected !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection rejected by endpoint: " + endpointId);
                                    break;
                                case ConnectionsStatusCodes.STATUS_ERROR:
                                    // The connection broke before it was able to be accepted.
                                    Toast.makeText(reactContext, "Connection failed for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection failed for endpoint: " + endpointId);
                                    break;
                                default:
                                    // Unknown status code
                                    Toast.makeText(reactContext, "Unknown connection status for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Unknown connection status for endpoint: " + endpointId);
                                    break;
                            }
                        }
        
                        @Override
                        public void onDisconnected(String endpointId) {
                            // We've been disconnected from this endpoint. No more data can be sent or received.
                            Toast.makeText(reactContext, "Disconnected from endpoint !", Toast.LENGTH_SHORT).show();
                            Log.d("NearbyModule", "Disconnected from endpoint: " + endpointId);
                        }
                    };
                // advertising callback
            private final ConnectionLifecycleCallback DconnectionLifecycleCallback =
                    new ConnectionLifecycleCallback() {
                        @Override
                        public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
                            // Automatically accept the connection on both sides.
                            discoveryCallback.invoke("Connection initiated By Discoverer!");
                            // Nearby.getConnectionsClient(reactContext).acceptConnection(endpointId, payloadCallback);

                        }
        
                        @Override
                        public void onConnectionResult(String endpointId, ConnectionResolution result) {
                            //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                            switch (result.getStatus().getStatusCode()) {
                                case ConnectionsStatusCodes.STATUS_OK:
                                    // We're connected! Can now start sending and receiving data.
                                    // Returning the callback to the js with the two variables.
                                    currentTimeAcceptConnection = LocalTime.now();
                                    Duration duration = Duration.between(currentTimeFound, currentTimeAcceptConnection);
                                    long diffInSeconds = duration.toMillis();
                                    String diff = currentTimeFound.toString() + ',' + currentTimeAcceptConnection.toString()+','+ diffInSeconds;

                                    if (discoveryCallback != null) {
                                        discoveryCallback.invoke(diff);
                                    }
                                     Toast.makeText(reactContext, "Request Accepted !" + LocalTime.now().toString(), Toast.LENGTH_SHORT).show();
                                     Log.d("NearbyModule", "Connected to endpoint: " + endpointId + " at " + LocalTime.now().toString());
                                    //SENDING DATA BETWEEN DEVICES
                                    //Payload bytesPayload = Payload.fromBytes(new byte[] {0xa, 0xb, 0xc, 0xd});
                                    // Nearby.getConnectionsClient(reactContext).sendPayload(endpointId, bytesPayload);
                                    break;
                                case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                                    // The connection was rejected by one or both sides.
                                    Toast.makeText(reactContext, "Request rejected !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection rejected by endpoint: " + endpointId);
                                    break;
                                case ConnectionsStatusCodes.STATUS_ERROR:
                                    // The connection broke before it was able to be accepted.
                                    Toast.makeText(reactContext, "Connection failed for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Connection failed for endpoint: " + endpointId);
                                    break;
                                default:
                                    // Unknown status code
                                    Toast.makeText(reactContext, "Unknown connection status for endpoint !", Toast.LENGTH_SHORT).show();
                                    Log.e("NearbyModule", "Unknown connection status for endpoint: " + endpointId);
                                    break;
                            }
                        }
        
                        @Override
                        public void onDisconnected(String endpointId) {
                            // We've been disconnected from this endpoint. No more data can be sent or received.
                            Toast.makeText(reactContext, "Disconnected from endpoint !", Toast.LENGTH_SHORT).show();
                            Log.d("NearbyModule", "Disconnected from endpoint: " + endpointId);
                        }
                    };

        
            private final PayloadCallback payloadCallback = new PayloadCallback() {
                @Override
                public void onPayloadReceived(String endpointId, Payload payload) {
                    if (payload.getType() == Payload.Type.BYTES) {
                        byte[] receivedBytes = payload.asBytes();
                        String toastMessage = "New message received: " + receivedBytes;
                        Toast.makeText(reactContext, toastMessage, Toast.LENGTH_SHORT).show();
                    }
                    // A new payload has been received.
                    Log.d("NearbyModule", "Payload received from endpoint: " + endpointId);
                }
        
                @Override
                public void onPayloadTransferUpdate(String endpointId, PayloadTransferUpdate update) {
                    // The status of the payload transfer has been updated.
                    Log.d("NearbyModule", "Payload transfer update for endpoint: " + endpointId);
                }
            };

            private String getLocalUserName() {
                // You can implement your logic to get the local user's name here.
                return "LocalUser";
            }
}
