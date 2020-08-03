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

// Update the user's email address.
module.exports.updateEmail = (spotify_user_id, email, callback) => {
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET email = ${email}`,
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
    UpdateExpression: `SET songs.${track_id}.plays.${start_time} = ${duration}`,
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
  const wooPath = `songs.${track_id}.woos`;
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET ${wooPath} = list_append(if_not_exists(${wooPath}, []), [${woo_time}])`,
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
  const benchPath = `songs.${track_id}.benches`;
  const params = {
    TableName: "Wooster",
    Key: {
      "spotify_user_id": spotify_user_id,
    },
    UpdateExpression: `SET ${benchPath} = list_append(if_not_exists(${benchPath}, []), [${bench_time}])`,
  };

  docClient.update(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};
