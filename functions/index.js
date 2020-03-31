const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setDisplayName = functions.https.onCall(({ username, uid }, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'You are not allowed to do this operation');
  return admin.auth().updateUser(uid, {
    displayName: username,
  }).catch((error) => {
    throw new functions.https.HttpsError('unknown', error);
  })
});

exports.deleteTodos = functions.auth.user().onDelete(async (user) => {
  try {
    const todos = await admin.firestore().collection('todos').where('owner', '==', user.uid).get();
    const batch = admin.firestore().batch()
    todos.forEach((todo) => batch.delete(todo.ref));
    return batch.commit();
  } catch (err) {
    throw new functions.https.HttpsError('unknown', 'There is a problem to delete your todos from database');
  }
});