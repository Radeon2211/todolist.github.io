const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// exports.createUser = functions.https.onCall(({ email, password, username }) => {
//   return admin.auth().createUser({
//     email,
//     password,
//     displayName: username,
//   }).catch((error) => {
//     console.log(error);
//     throw new functions.https.HttpsError('unknown', error);
//   })
// });

exports.setDisplayName = functions.https.onCall(({ username, uid }, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'You are not allowed to do this operation');
  return admin.auth().updateUser(uid, {
    displayName: username,
  }).catch((error) => {
    throw new functions.https.HttpsError('unknown', error);
  })
});