const express = require('express');
const bodyParser = require('body-parser');
const line = require('@line/bot-sdk');
const cron = require('node-cron');
const axios = require('axios');

const app = express();

// กำหนดค่า LINE Bot
const config = {
    channelAccessToken: 'YlQsOdAPVZDZ9ZzjfJJZ+ZsUGy8PfTrI54tAWpuolw/CbT1dRr2lMsI+OFqGn4fLkE0UHLPBQxmIEuAKtno5oycoaRAYwVIM81pheR5QieXzKOI2lLxtgoDk6FkMCV1nqor2Xv766uGjqjlvljv6GwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'ec5dd65b9cb56ed5b24a0a54ef9a94fb'
};

const client = new line.Client(config);

// Middleware สำหรับ parsing body ของ request
app.use(bodyParser.json());

// Webhook สำหรับรับข้อความจาก LINE
app.post('/webhook', (req, res) => {
    const events = req.body.events;
    Promise.all(events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// ฟังก์ชันสำหรับจัดการ event
function handleEvent(event) {
    if (event.type === 'message' && event.message.type === 'text') {
        const echo = { type: 'text', text: event.message.text };
        return client.replyMessage(event.replyToken, echo);
    }
    return Promise.resolve(null);
}

cron.schedule('49 22 * * *', () => {
    const message = 'นี่คือข้อความแจ้งเตือน\nตามเวลาที่กำหนด (10:26 น.)';
    broadcastScheduledMessage(message)
        .then(() => console.log('ส่งข้อความ Broadcast สำเร็จที่เวลา 10:26 น.'))
        .catch((error) => console.error('เกิดข้อผิดพลาด:', error));
});

cron.schedule('50 22 * * *', () => {
    const message = 'ของ พี่หยง\nตามเวลาที่กำหนด (10:35 น.)';
    broadcastScheduledMessage(message)
        .then(() => console.log('ส่งข้อความ Broadcast สำเร็จที่เวลา 10:35 น.'))
        .catch((error) => console.error('เกิดข้อผิดพลาด:', error));
});
// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
