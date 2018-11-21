import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.newOrderGasNorth = functions.firestore
    .document('orderGas/Norte/pedidos/{pedidoID}')
    .onCreate(async event =>{
        const dataOrder = event.data();
        console.log(JSON.stringify(dataOrder))
        // Notification content
        const payload = {
            notification: {
                title: 'Nuevo Pedido',
                body: `Tienes un nuevo Pedido`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        }

        // ref to the device collection for the user
        const db = admin.firestore()
        const distribuitorRef = db.collection('distributor').where('zone', "==",dataOrder.zone)

        const devicesRef = db.collection('devices')

        const devices = await devicesRef.get();
        const distribuitor = await distribuitorRef.get();

        const tokens = [];

        // send a notification to each device token
        distribuitor.forEach(distr => {
            devices.forEach(dev =>{
                if(distr.id == dev.data().userId){
                    const token = dev.data().token;
                    tokens.push(token)
                }
            })
        })

        return admin.messaging().sendToDevice(tokens, payload)
});