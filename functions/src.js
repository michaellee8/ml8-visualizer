const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const mockDb = {
  nodes: {
    root: {
      text: "Most used websites"
    },
    I5zla: {
      text: "Google"
    },
    sx4zC: {
      text: "Facebook"
    },
    KhzwL: {
      text: "Instagram"
    },
    c0WUm: {
      text: "Gmail"
    },
    q7eRP: {
      text: "Google Docs"
    },
    "4UiSw": {
      text: "Google Drive"
    },
    "6NXhx": {
      text: "Pages"
    },
    sNSqM: {
      text: "Groups"
    },
    "1cCoR": {
      text: "Likes"
    },
    OcejU: {
      text: "Filters"
    },
    "4H0it": {
      text: "Tags"
    },
    "8UKzM": {
      text: "IG Shops"
    }
  },
  connections: {
    "7AU6e": {
      type: "primary",
      src: "root",
      des: "I5zla"
    },
    dZ5TM: {
      type: "primary",
      src: "root",
      des: "sx4zC"
    },
    "620BG": {
      type: "primary",
      src: "root",
      des: "KhzwL"
    },
    "3XZFs": {
      type: "primary",
      src: "I5zla",
      des: "c0WUm"
    },
    I27UK: {
      type: "primary",
      src: "I5zla",
      des: "q7eRP"
    },
    "0xzvO": {
      type: "primary",
      src: "I5zla",
      des: "4UiSw"
    },
    bPsn7: {
      type: "primary",
      src: "sx4zC",
      des: "6NXhx"
    },
    "59r1P": {
      type: "primary",
      src: "sx4zC",
      des: "sNSqM"
    },
    yTm8z: {
      type: "primary",
      src: "sx4zC",
      des: "1cCoR"
    },
    VlAlr: {
      type: "primary",
      src: "KhzwL",
      des: "OcejU"
    },
    D1m2w: {
      type: "primary",
      src: "KhzwL",
      des: "4H0it"
    },
    Se8aQ: {
      type: "primary",
      src: "KhzwL",
      des: "8UKzM"
    }
  }
};

const removeEmpty = obj => {
  Object.keys(obj).forEach(
    key =>
      (obj[key] && typeof obj[key] === "object" && removeEmpty(obj[key])) ||
      (obj[key] === undefined && delete obj[key])
  );
  return obj;
};

exports.onUserCreate = functions.auth.user().onCreate(event => {
  const db = admin.firestore();
  var batch = db.batch();
  batch.set(db.collection("users").doc(event.data.uid), {
    acccountData: removeEmpty({
      email: event.data.email,
      photoUrl: event.data.photoURL,
      uid: event.data.uid
    })
  });
  Object.keys(mockDb.nodes).map((key, index) =>
    batch.set(
      db
        .collection("users")
        .doc(event.data.uid)
        .collection("nodes")
        .doc(key),
      mockDb.nodes[key]
    )
  );
  Object.keys(mockDb.connections).map((key, index) =>
    batch.set(
      db
        .collection("users")
        .doc(event.data.uid)
        .collection("connections")
        .doc(key),
      { ...mockDb.connections[key], stamp: Date.now() + 10 * index }
    )
  );
  return batch
    .commit()
    .then(`Created user ${event.data.uid}`)
    .catch(err =>
      console.error(`Error occured when creating ${event.data.uid}` + err)
    );
});
exports.onUserDelete = functions.auth.user().onDelete(event => {
  const db = admin.firestore();
  return db
    .collection("users")
    .doc(event.data.uid)
    .delete()
    .then(() => console.log(`Deleted user ${event.data.uid}`))
    .catch(err =>
      console.error(`Error occured when deleting ${event.data.uid}` + err)
    );
});
