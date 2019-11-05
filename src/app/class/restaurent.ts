export class Restaurant {
    id: number;
    name: string;
address: RestaurantAddress;
images: [];

}

export interface RestaurantAddress {
address: string;
pincode: number;
state: string;
city: string;
distic: string;
locality: string;
landMark: string;
country: string;
}

// {
//     "project_info": {
//       "project_number": "379506527122",
//       "firebase_url": "https://crab-1.firebaseio.com",
//       "project_id": "crab-1",
//       "storage_bucket": "crab-1.appspot.com"
//     },
//     "client": [
//       {
//         "client_info": {
//           "mobilesdk_app_id": "1:379506527122:android:51f681fc97ebe5ae26cf4b",
//           "android_client_info": {
//             "package_name": "com.flowfreak.crab"
//           }
//         },
//         "oauth_client": [
//           {
//             "client_id": "379506527122-8422prqimp8oivaisofr1s71127t6743.apps.googleusercontent.com",
//             "client_type": 1,
//             "android_info": {
//               "package_name": "com.flowfreak.crab",
//               "certificate_hash": "e31b25e7c59ecc980956b029a8890eebf1a79267"
//             }
//           },
//           {
//             "client_id": "379506527122-78g12ih6ad9onnl4v5ho1vb56469b2mb.apps.googleusercontent.com",
//             "client_type": 3
//           }
//         ],
//         "api_key": [
//           {
//             "current_key": "AIzaSyDMpkpbh69YmG2jPrFNmkP7pSHMnXndBXI"
//           }
//         ],
//         "services": {
//           "appinvite_service": {
//             "other_platform_oauth_client": [
//               {
//                 "client_id": "379506527122-78g12ih6ad9onnl4v5ho1vb56469b2mb.apps.googleusercontent.com",
//                 "client_type": 3
//               }
//             ]
//           }
//         }
//       }
//     ],
//     "configuration_version": "1"
//   }