## ปัญหาที่เกิด

มีการกำหนดให้ใช้ฟรีได้แค่ 500 เมดเสจถ้าต้องการส่ง line กลุ่ม
เราส่งข้อความ 1 ข้อความและภาพ 3 ภาพ นับเป็น 4 ข้อความต่อการส่ง 1 ครั้ง
ส่ง 1 วัน 32 ข้อความ
ส่ง 31 วัน 992 ข้อความ

## วิธีแก้

จะสร้างบอทขึ้นมาอีก 1 ตัว จะได้มี 2 ตัว และจะได้ส่ง 1000 ข้อความโดย
ให้บอทตัวที่ 1 ส่งข้อความวันที่ 1-15
บอทตัวที่ 2 ส่งข้อความวันที่ 16-30
และช่วง 00.00 - 9.00 บอท 1 รายงานของวันที่ 31
และช่วง 12.00 - 21.00 บอท 2 รายงานของวันที่ 31
