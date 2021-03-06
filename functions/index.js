"use strict";

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

var mockDb = {
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

var removeEmpty = function removeEmpty(obj) {
  Object.keys(obj).forEach(function(key) {
    return (
      (obj[key] && _typeof(obj[key]) === "object" && removeEmpty(obj[key])) ||
      (obj[key] === undefined && delete obj[key])
    );
  });
  return obj;
};

exports.onUserCreate = functions.auth.user().onCreate(function(event) {
  var db = admin.firestore();
  var batch = db.batch();
  batch.set(db.collection("users").doc(event.data.uid), {
    acccountData: removeEmpty({
      email: event.data.email,
      photoUrl: event.data.photoURL,
      uid: event.data.uid
    })
  });
  Object.keys(mockDb.nodes).map(function(key, index) {
    return batch.set(
      db
        .collection("users")
        .doc(event.data.uid)
        .collection("nodes")
        .doc(key),
      mockDb.nodes[key]
    );
  });
  Object.keys(mockDb.connections).map(function(key, index) {
    return batch.set(
      db
        .collection("users")
        .doc(event.data.uid)
        .collection("connections")
        .doc(key),
      _extends({}, mockDb.connections[key], { stamp: Date.now() + 10 * index })
    );
  });
  return batch
    .commit()
    .then("Created user " + event.data.uid)
    .catch(function(err) {
      return console.error(
        "Error occured when creating " + event.data.uid + err
      );
    });
});
exports.onUserDelete = functions.auth.user().onDelete(function(event) {
  var db = admin.firestore();
  return db
    .collection("users")
    .doc(event.data.uid)
    .delete()
    .then(function() {
      return console.log("Deleted user " + event.data.uid);
    })
    .catch(function(err) {
      return console.error(
        "Error occured when deleting " + event.data.uid + err
      );
    });
});
