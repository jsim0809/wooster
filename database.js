const AWS = require('aws-sdk');
const secret = require('./secret.keys.js');
const moment = require('moment-timezone');

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
module.exports.createUserSkeleton = (spotify_user_id, email, country, callback) => {
  var params = {
    TableName: "Wooster",
    Item: {
      "spotify_user_id": spotify_user_id,
      "email": email,
      "country": country,
      "created_at": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    UpdateExpression: "SET #email = :new_email, #last_modified = :last_modified",
    ExpressionAttributeNames: {
      "#email": "email",
      "#last_modified": "last_modified",
    },
    ExpressionAttributeValues: {
      ":new_email": email,
      ":last_modified": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    UpdateExpression: "SET #songs.#track_id = :new_track, #last_modified = :last_modified",
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#last_modified": "last_modified",
    },
    ExpressionAttributeValues: {
      ":new_track": {
        "artists": track_artists,
        "name": track_name,
        "plays": {},
        "woos": [],
        "benches": [],
      },
      ":last_modified": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    UpdateExpression: "SET #songs.#track_id.#plays.#start_time = :duration, #last_modified = :last_modified",
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#plays": "plays",
      "#start_time": start_time,
      "#last_modified": "last_modified",
    },
    ExpressionAttributeValues: {
      ":duration": duration,
      ":last_modified": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    UpdateExpression: "SET #songs.#track_id.#liked = :new_status, #last_modified = :last_modified",
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#liked": "liked",
      "#last_modified": "last_modified",
    },
    ExpressionAttributeValues: {
      ":new_status": true,
      ":last_modified": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    UpdateExpression: "SET #songs.#track_id.#liked = :new_status, #last_modified = :last_modified",
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#liked": "liked",
      "#last_modified": "last_modified",
    },
    ExpressionAttributeValues: {
      ":new_status": false,
      ":last_modified": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    UpdateExpression: "SET #songs.#track_id.#woos = list_append(#songs.#track_id.#woos, :woo_time), #last_modified = :last_modified",
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#woos": "woos",
      "#last_modified": "last_modified",
    },
    ExpressionAttributeValues: {
      ":woo_time": [woo_time],
      ":last_modified": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    UpdateExpression: "SET #songs.#track_id.#benches = list_append(#songs.#track_id.#benches, :bench_time), #last_modified = :last_modified",
    ExpressionAttributeNames: {
      "#songs": "songs",
      "#track_id": track_id,
      "#benches": "benches",
      "#last_modified": "last_modified",
    },
    ExpressionAttributeValues: {
      ":bench_time": [bench_time],
      ":last_modified": moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
