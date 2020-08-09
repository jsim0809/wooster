const AWS = require('aws-sdk');
const secret = require('./secret.keys.js');

AWS.config.update({
  accessKeyId: secret.AWS_ACCESS_KEY_ID,
  secretAccessKey: secret.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
  endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
  correctClockSkew: true,
});

const docClient = new AWS.DynamoDB.DocumentClient();

// Grab the entire user object.
module.exports.getData = (spotify_user_id, callback) => {
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
  };

  docClient.get(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// Create the skeleton of a user's data object
module.exports.createSkeleton = (spotify_user_id, callback) => {
  var params = {
    TableName: "Wooster",
    Item: {
      "spotify_user_id": spotify_user_id,
      "email": '',
      "liked_songs": {},
      "disliked_songs": {},
    },
  };
  docClient.put(params, function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

// Update the user's email address.
module.exports.updateEmail = (spotify_user_id, email, callback) => {
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET #email = :email`,
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  docClient.update(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// When the user finishes playing a song
// (listened to the end, skipped forward, benched/disliked, or hit repeat),
// we will record the start_time and end_time of the just-played song.
module.exports.recordSongPlayTime = (spotify_user_id, track_id, start_time, duration, callback) => {
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET #songs.#track_id.#plays.#start_time = :duration`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#plays": "plays",
      "#start_time": start_time,
    },
    ExpressionAttributeValues: {
      ":duration": duration,
    },
  };

  docClient.update(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// When the user woos a song,
// record a timestamp.
module.exports.woo = (spotify_user_id, track_id, woo_time, callback) => {
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET #songs.#track_id.#woos = list_append(if_not_exists(#songs.#track_id.#woos, :empty_list), :woo_time)`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#woos": "woos",
    },
    ExpressionAttributeValues: {
      ":empty_list": [],
      ":woo_time": [woo_time],
    },
  };

  docClient.update(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// When the user benches a song,
// record a timestamp.
module.exports.bench = (spotify_user_id, track_id, bench_time, callback) => {
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET #songs.#track_id.#benches = list_append(if_not_exists(#songs.#track_id.#benches, :empty_list), :bench_time)`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#benches": "benches",
    },
    ExpressionAttributeValues: {
      ":empty_list": [],
      ":bench_time": [bench_time],
    },
  };

  docClient.update(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};
