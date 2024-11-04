const express = require('express');
const bodyParser = require('body-parser');
const line = require('@line/bot-sdk');
const cron = require('node-cron');
const axios = require('axios');
const puppeteer = require("puppeteer");
const app = express();

// กำหนดค่า LINE Bot
const config = {
    channelAccessToken: 'YlQsOdAPVZDZ9ZzjfJJZ+ZsUGy8PfTrI54tAWpuolw/CbT1dRr2lMsI+OFqGn4fLkE0UHLPBQxmIEuAKtno5oycoaRAYwVIM81pheR5QieXzKOI2lLxtgoDk6FkMCV1nqor2Xv766uGjqjlvljv6GwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'ec5dd65b9cb56ed5b24a0a54ef9a94fb'
};

// สร้างตัวแปรวันที่ปัจจุบัน
const currentDate = new Date();

// แยกวัน เดือน ปี
const day = currentDate.getDate();         // วันที่ (1 - 31)
const month = currentDate.getMonth() + 1;  // เดือน (1 - 12), +1 เพราะ getMonth() เริ่มจาก 0
const year = currentDate.getFullYear();    // ปี (เช่น 2024)
const datetime = `${day}/${month}/${year}`;
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

function broadcastScheduledMessage(message) {
    return axios.post(
        'https://api.line.me/v2/bot/message/broadcast',
        {
            messages: [
                {
                    type: 'text',
                    text: message,
                },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${config.channelAccessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );
}

cron.schedule('* * * * *', async () => {
    const datetime2 = ` ${datetime}/18.00น.`;
    const hyung = ` \nของ พี่หยง \n156.232.105.0/25 (vlan 565) \nbandwith : ปกติ(251M) \n156.232.105.128/25 (vlan 568) \n\n`;
    const nikky = ` ของ นิกกี้ \n156.232.106.0/25 (vlan 566) \nbandwith : ปกติ(432M) \n154.209.146.0/25 (vlan 567) \nbandwith : ปกติ(432M)\n156.232.106.128/25 (vlan 569)\nbandwith : ปกติ(432M)\n154.209.146.128/25 (vlan 570)\nbandwith : ปกติ(432M)\n\n`;
    const sumBW = `รวม BW User = 1.74 G`;
    const message = datetime2 + hyung + nikky + sumBW;
    const tokenAPI = '45f594f035722650e4423d4c5019a6b99e0bb498e374b41b89fd479d7ed092e0'
    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }

    try {
        await (async () => {
            const browser = await puppeteer.launch({
                defaultViewport: {
                    width: 1280,
                    height: 3300,
                },
            });

            const page = await browser.newPage();

            // ไปยังหน้าเข้าสู่ระบบ
            await page.goto("http://zabbix.cabletv.co.th/zabbix/index.php");

            // กรอกชื่อผู้ใช้และรหัสผ่าน
            await page.type("#name", "LL67565"); // แก้ไขเป็นชื่อผู้ใช้จริง
            await page.type("#password", "Admin@67565"); // แก้ไขเป็นรหัสผ่านจริง

            // คลิกปุ่มล็อคอิน
            await page.click("#enter");

            // รอให้หน้าใหม่โหลดเสร็จ
            await page.waitForNavigation();

            // ไปยังหน้าที่ต้องการแคปหน้าจอหลังจากล็อคอินแล้ว
            await page.goto("http://zabbix.cabletv.co.th/zabbix/zabbix.php?action=dashboard.view&dashboardid=388");

            // รอ 7 วินาทีก่อนแคปหน้าจอ
            await delay(4000);

            // แคปหน้าจอ
            await page.screenshot({ path: "zabbix-dashboard.png" });

            await browser.close();
        })();


        broadcastScheduledMessage(message)
            .then(() => console.log('ส่งข้อความ Broadcast สำเร็จที่เวลา 10:26 น.'))
            .catch((error) => console.error('เกิดข้อผิดพลาด:', error));
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
    }

});


// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
