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
module.exports.getFullUserData = (spotify_user_id, callback) => {
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

// Create the skeleton of a new user's data object.
module.exports.createUserSkeleton = (spotify_user_id, email, callback) => {
  var params = {
    TableName: "Wooster",
    Item: {
      "spotify_user_id": spotify_user_id,
      "email": email,
      "songs": {},
    },
    ConditionExpression: "attribute_not_exists(spotify_user_id)",
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
    UpdateExpression: `SET #email = :new_email`,
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":new_email": email,
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

// Create the skeleton of a new song.
module.exports.createSongSkeleton = (spotify_user_id, track_id, track_artists, track_name, callback) => {
  var params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    ConditionExpression: "attribute_not_exists(#songs.#track_id)",
    UpdateExpression: `SET #songs.#track_id = :new_track`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
    },
    ExpressionAttributeValues: {
      ":new_track": {
        "artists": track_artists,
        "name": track_name,
        "plays": {},
        "woos": [],
        "benches": [],
      },
    },
  };

  docClient.update(params, function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

// When the user finishes playing a song
// (listened to the end, skipped forward, benched/disliked, or hit repeat),
// we will record the start_time and duration of the just-played song.
module.exports.logPlaytime = (spotify_user_id, track_id, start_time, duration, callback) => {
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

// When the user likes a song, update the 'liked' field.
module.exports.like = (spotify_user_id, track_id, callback) => {
  var params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET #songs.#track_id.#liked = :new_status`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#liked": "liked",
    },
    ExpressionAttributeValues: {
      ":new_status": true,
    },
  };

  docClient.update(params, function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

// When the user dislikes a song, update the 'liked' field.
module.exports.dislike = (spotify_user_id, track_id, callback) => {
  var params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET #songs.#track_id.#liked = :new_status`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#liked": "liked",
    },
    ExpressionAttributeValues: {
      ":new_status": false,
    },
  };

  docClient.update(params, function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

// When the user woos a song,
// record a timestamp.
module.exports.woo = (spotify_user_id, track_id, woo_time, callback) => {
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET #songs.#track_id.#woos = list_append(#songs.#track_id.#woos, :woo_time)`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#woos": "woos",
    },
    ExpressionAttributeValues: {
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
    UpdateExpression: `SET #songs.#track_id.#benches = list_append(#songs.#track_id.#benches, :bench_time)`,
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#benches": "benches",
    },
    ExpressionAttributeValues: {
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
