require('dotenv').config();
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueUrl = process.env.SQS_TEST;


const subscribeSQS = function() {
  sqs.receiveMessage({
    QueueUrl: queueUrl,
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      if (data.Messages) {
        const params = {
          QueueUrl: queueUrl,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        };
        sqs.deleteMessage(params, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log('[DELETE]: ', data);
          }
        });
      }      
    }
  });
}


const consumer = Consumer.create({
  queueUrl,
  handleMessage: async(message) => {
    console.log(message);

    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    };
    sqs.deleteMessage(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log('[DELETE]: ', data);
      }
    });
  }
});

consumer.on('error', (err)=>{
  console.log(err.message);
});

module.exports = consumer;
