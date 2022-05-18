require('dotenv').config();
const AWS = require('aws-sdk');
const router = require('express').Router();

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });


const params = {
  MessageAttributes: {
    'Title': {
      DataType: 'String',
      StringValue: 'Test SQS Message'
    },
    'Author': {
      DataType: 'String',
      StringValue: 'Israel CM'
    }
  },
  // MessageBody: '{"data": "test"}',
  MessageDeduplicationId: "Test",
  MessageGroupId: "Group1",
  QueueUrl: process.env.SQS_TEST,
};


router.post('/', (req, res)=>{
  params.MessageBody = JSON.stringify(req.body);
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      console.log('[ID]: ', data.MessageId);
      console.log(data);
      res.send({id: data.MessageId});
    }
  });
});

module.exports = router;
