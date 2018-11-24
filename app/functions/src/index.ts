import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.orderIsAccepted = functions.firestore
    .document('orderGas/Norte/pedidos/{pedidoID}')
    .onUpdate(async event =>{
        const dataOrderbefore = event.before.data();
        const dataOrderAfter = event.after.data();

        const db = admin.firestore()

        const distriRef = db.collection('users')

        const distri = await distriRef.get();

        var distriname = ""

        distri.forEach(result =>{
            if(result.id == dataOrderAfter.acceptedBy){
                distriname += (result.data().lastname != "")? result.data().name+" "+result.data().lastname : result.data().name
            }
        })

        // Notification content
        const payload = {
            notification: {
                title: `Pedido Aceptado`,
                body: `Tu pedido fue aceptado por ${distriname}`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        }

        const devicesRef = db.collection('devices').where("","==",dataOrderAfter.userUid)

        const devices = await devicesRef.get();

        const tokens = [];

        // send a notification to each device token
        devices.forEach(result => {
            const token = result.data().token;
            tokens.push(token)
        })

        return admin.messaging().sendToDevice(tokens, payload)
    })

exports.newOrderGasNorth = functions.firestore
    .document('orderGas/Norte/pedidos/{pedidoID}')
    .onCreate(async event =>{
        const dataOrder = event.data();
        console.log(JSON.stringify(dataOrder))

        // ref to the device collection for the user
        const db = admin.firestore()
        //db.settings({ timestampsInSnapshots: true })

        const userRef = db.collection('users')

        const user = await userRef.get();

        var username = ""

        user.forEach(result =>{
            if(result.id == dataOrder.userUid){
                username += (result.data().lastname != "")? result.data().name+" "+result.data().lastname : result.data().name
            }
        })

        console.log(username)
        // Notification content
        const payload = {
            notification: {
                title: `Nuevo Pedido de Gas en Sector ${dataOrder.zone}`,
                body: `Tienes un nuevo Pedido de ${username}`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        }

        
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
