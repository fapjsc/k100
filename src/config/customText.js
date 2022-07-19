import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid';

export const customText = {
  Message: `親愛的會員您好，我是 88u.asia 客服，請問有什麼需要為您服務的嗎？ 關於會員升等請輸入"1" 關於操作說明請輸入"2" 關於其他問題請輸"3"`,
  Message_Role: 2,
  Message_Type: 1,
  SysDate: dayjs().format('YYYY.MM.DD HH:mm:ss') ,
  SysID: uuidv4(),
};

