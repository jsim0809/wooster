const dynamo = require('dynamodb');
const joi = require('joi');
const secret = require('./secret.keys.js');

dynamo.AWS.config.update({
  accessKeyId: secret.AWS_ACCESS_KEY_ID,
  secretAccessKey: secret.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
})

const Account = dynamo.define('Account', {
  hashKey: 'email',
  timestamps: true,
  schema: {
    email: joi.string(),
    spotify_id: joi.string(),
    songs: {
      
    }
  }
})