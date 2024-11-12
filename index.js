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

cron.schedule('* * * * *', async () => {
    const datetime2 = ` ${datetime}`;
    const hyung = ` \nของ พี่หยง \n156.232.105.0/25 (vlan 565) \nbandwith : ปกติ(251M) \n156.232.105.128/25 (vlan 568) \n\n`;
    const nikky = ` ของ นิกกี้ \n156.232.106.0/25 (vlan 566) \nbandwith : ปกติ(432M) \n154.209.146.0/25 (vlan 567) \nbandwith : ปกติ(432M)\n156.232.106.128/25 (vlan 569)\nbandwith : ปกติ(432M)\n154.209.146.128/25 (vlan 570)\nbandwith : ปกติ(432M)\n\n`;
    const sumBW = `รวม BW User = 1.74 G`;
    const message = datetime2 + hyung + nikky + sumBW;
    const email = "LL67565";
    const password = "Admin@67565";
    const image1 = './croppedM1.jpg';
    const image2 = './croppedM2.jpg';
    const image3 = './croppedM3.jpg';
    const moniter1 = 'text1.jpg';
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
            await delay(4000);

            // แคปหน้าจอ
            await page.screenshot({ path: "zabbix-dashboard.png" });
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 1200, height: 950, left: 50, top: 300 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('croppedM1.jpg') // บันทึกเป็นไฟล์ใหม่ชื่อ cropped.jpg
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 1200, height: 700, left: 50, top: 1250 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('croppedM2.jpg') // บันทึกเป็นไฟล์ใหม่ชื่อ cropped.jpg
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 1200, height: 1050, left: 50, top: 1950 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('croppedM3.jpg') // บันทึกเป็นไฟล์ใหม่ชื่อ cropped.jpg
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 90, height: 15, left: 769, top: 730 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('text1.jpg')
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 90, height: 15, left: 780, top: 1150 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('text2.jpg')
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 90, height: 15, left: 769, top: 1500 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('text3.jpg')
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 90, height: 15, left: 780, top: 1850 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('text4.jpg')
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 90, height: 15, left: 769, top: 2200 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('text5.jpg')
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 90, height: 15, left: 780, top: 2550 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
                .toFile('text6.jpg')
            sharp('zabbix-dashboard.png') // ไฟล์ภาพต้นฉบับ
                .extract({ width: 90, height: 15, left: 605, top: 2915 }) // กำหนดขนาดและตำแหน่งที่ต้องการครอบ
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
        imageFiles.forEach((imageFile, index) => {
            Tesseract.recognize(
                imageFile, // ใช้ชื่อไฟล์แต่ละตัวจากลูป
                'eng', // ภาษา
                {
                    logger: m => console.log(`กำลังแปลงภาพที่ ${index + 1}: ${imageFile}`) // แสดงสถานะการประมวลผล
                }
            ).then(({ data: { text } }) => {
                console.log(`ข้อความที่ตรวจพบในภาพ ${imageFile}:`);
                console.log(text); // แสดงผลข้อความที่ดึงออกมาจากภาพ
            }).catch(error => {
                console.error(`เกิดข้อผิดพลาดกับภาพ ${imageFile}:`, error); // จัดการข้อผิดพลาด
            });
        });
        const uploadResult11 = uploadResult1.secure_url;
        const uploadResult12 = uploadResult2.secure_url;
        const uploadResult13 = uploadResult3.secure_url;
        broadcastScheduledMessage(message, uploadResult11, uploadResult12, uploadResult13)
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
