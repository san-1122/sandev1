const express = require('express');
const bodyParser = require('body-parser');
const line = require('@line/bot-sdk');
const cron = require('node-cron');
const axios = require('axios');
const puppeteer = require("puppeteer");
const app = express();
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const Tesseract = require('tesseract.js');
// กำหนดค่า LINE Bot
const config = {
    channelAccessToken: 'YlQsOdAPVZDZ9ZzjfJJZ+ZsUGy8PfTrI54tAWpuolw/CbT1dRr2lMsI+OFqGn4fLkE0UHLPBQxmIEuAKtno5oycoaRAYwVIM81pheR5QieXzKOI2lLxtgoDk6FkMCV1nqor2Xv766uGjqjlvljv6GwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'ec5dd65b9cb56ed5b24a0a54ef9a94fb'
};

// กําหนดค่า Cloudinary เพื่อเชื่อมต่อ cloudinary
cloudinary.config({
    cloud_name: 'dnfcx8tdk',
    api_key: '354162211182455',
    api_secret: 'KI6Thg_n3ora-Iy2SSMsSieNVtQ' // Click 'View API Keys' above to copy your API secret
});

// สร้างตัวแปรวันที่ปัจจุบัน
const currentDate = new Date();

// แยกวัน เดือน ปี
const day = currentDate.getDate();         // วันที่ (1 - 31)
const month = currentDate.getMonth() + 1;  // เดือน (1 - 12), +1 เพราะ getMonth() เริ่มจาก 0
const year = currentDate.getFullYear();    // ปี (เช่น 2024)
const time = currentDate.getHours();
const timeminit = currentDate.getMinutes();
const datetime = `${day}/${month}/${year} / ${time}.${timeminit} น.`;
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

function broadcastScheduledMessage(message, uploadResult11, uploadResult12, uploadResult13) {
    return axios.post(
        'https://api.line.me/v2/bot/message/broadcast',
        {
            messages: [
                {
                    type: 'text',
                    text: message,
                }, {
                    type: "image",
                    originalContentUrl: uploadResult11,
                    previewImageUrl: uploadResult11
                }, {
                    type: "image",
                    originalContentUrl: uploadResult12,
                    previewImageUrl: uploadResult12
                }, {
                    type: "image",
                    originalContentUrl: uploadResult13,
                    previewImageUrl: uploadResult13
                }
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

// cron.schedule('0 0,3,6,9,12,15,18,21 * * *', async () => {
cron.schedule('* * * * *', async () => {

    const email = "LL67565";
    const password = "Admin@67565";
    const image1 = './croppedM1.jpg';
    const image2 = './croppedM2.jpg';
    const image3 = './croppedM3.jpg';
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
                    height: 3000,
                },
            });

            const page = await browser.newPage();

            // ไปยังหน้าเข้าสู่ระบบ
            await page.goto("http://zabbix.cabletv.co.th/zabbix/index.php");

            // กรอกชื่อผู้ใช้และรหัสผ่าน
            await page.type("#name", email); // แก้ไขเป็นชื่อผู้ใช้จริง
            await page.type("#password", password); // แก้ไขเป็นรหัสผ่านจริง

            // คลิกปุ่มล็อคอิน
            await page.click("#enter");

            // รอให้หน้าใหม่โหลดเสร็จ
            await page.waitForNavigation();

            // ไปยังหน้าที่ต้องการแคปหน้าจอหลังจากล็อคอินแล้ว
            await page.goto("http://zabbix.cabletv.co.th/zabbix/zabbix.php?action=dashboard.view&dashboardid=388");

            // รอ 7 วินาทีก่อนแคปหน้าจอ
            await delay(2000);

            // แคปหน้าจอ
            await page.screenshot({ path: "zabbix-dashboard.png" });
            sharp('zabbix-dashboard.png')
                .extract({ width: 1200, height: 950, left: 50, top: 300 })
                .toFile('croppedM1.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 1200, height: 700, left: 50, top: 1250 })
                .toFile('croppedM2.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 1200, height: 1050, left: 50, top: 1950 })
                .toFile('croppedM3.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 90, height: 15, left: 769, top: 730 })
                .toFile('text1.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 90, height: 15, left: 780, top: 1150 })
                .toFile('text2.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 90, height: 15, left: 769, top: 1500 })
                .toFile('text3.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 90, height: 15, left: 780, top: 1850 })
                .toFile('text4.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 90, height: 15, left: 769, top: 2200 })
                .toFile('text5.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 90, height: 15, left: 780, top: 2550 })
                .toFile('text6.jpg')
            sharp('zabbix-dashboard.png')
                .extract({ width: 90, height: 15, left: 605, top: 2915 })
                .toFile('text7.jpg')
                .then(() => {
                    console.log('ภาพคอปและบันทึกสำเร็จ!');
                })
                .catch(err => {
                    console.error('เกิดข้อผิดพลาด:', err);
                });



            await browser.close();
        })();
        const uploadResult1 = await cloudinary.uploader
            .upload(
                image1, {
                public_id: 'shoes1',
            }
            )
            .catch((error) => {
                console.log(error);
            });
        const uploadResult2 = await cloudinary.uploader
            .upload(
                image2, {
                public_id: 'shoes2',
            }
            )
            .catch((error) => {
                console.log(error);
            });
        const uploadResult3 = await cloudinary.uploader
            .upload(
                image3, {
                public_id: 'shoes3',
            }
            )
            .catch((error) => {
                console.log(error);
            });
        console.log("san22", uploadResult1.secure_url);
        // console.log(uploadResult2.url);
        // console.log(uploadResult3.url);
        const imageFiles = [
            'text1.jpg',
            'text2.jpg',
            'text3.jpg',
            'text4.jpg',
            'text5.jpg',
            'text6.jpg',
            'text7.jpg'
        ];
        Promise.all(
            imageFiles.map((imageFile, index) =>
                Tesseract.recognize(
                    imageFile,
                    'eng',
                    {
                        logger: m => console.log(`กำลังแปลงภาพที่ ${index + 1}: ${imageFile}`)
                    }
                ).then(({ data: { text } }) => text)
            )
        ).then(texts => {
            // รวมข้อความทั้งหมดในตัวแปรเดียว
            const allTexts = texts.join('\n');
            console.log("ข้อความที่ได้จากภาพทั้งหมด:");
            console.log(allTexts);
            const datetime2 = ` ${datetime}`;
            const hyung = ` \nของ พี่หยง \n156.232.105.0/25 (vlan 565) \nbandwith :ปกติ ${texts[0]} 156.232.105.128/25 (vlan 568) \nbandwith :ปกติ ${texts[1]} \n`;
            const nikky = ` ของ นิกกี้ \n156.232.106.0/25 (vlan 566) \nbandwith :ปกติ ${texts[2]} 154.209.146.0/25 (vlan 567) \nbandwith :ปกติ ${texts[3]}156.232.106.128/25 (vlan 569)\nbandwith :ปกติ ${texts[4]}154.209.146.128/25 (vlan 570)\nbandwith :ปกติ ${texts[5]}\n`;
            const sumBW = `รวม BW User = ${texts[6]}`;
            const message = datetime2 + hyung + nikky + sumBW;
            const uploadResult11 = uploadResult1.secure_url;
            const uploadResult12 = uploadResult2.secure_url;
            const uploadResult13 = uploadResult3.secure_url;
            broadcastScheduledMessage(message, uploadResult11, uploadResult12, uploadResult13)
                .then(() => console.log('ส่งข้อความ Broadcast สำเร็จ'))
                .catch((error) => console.error('เกิดข้อผิดพลาด:', error));
        }).catch(error => {
            console.error("เกิดข้อผิดพลาด:", error);
        });

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
    }

});


// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
