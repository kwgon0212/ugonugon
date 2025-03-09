import express, { Response, Request } from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/cert", (req: Request, res: Response) => {
  const { email: userEmail } = req.body;
  const randomCode = Math.floor(1000 + Math.random() * 9000);

  if (!userEmail) {
    return res.status(400).json({ message: "이메일 주소를 입력하세요." });
  }

  const transporter = nodemailer.createTransport({
    service: "naver",
    host: "smtp.naver.com",
    secure: false,
    port: 465,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: userEmail,
    subject: "[페이러너] 인증번호 전송 건",
    html: `
    <table
    width="720"
    border="0"
    cellpadding="0"
    cellspacing="0"
    style="margin:0 auto"
  >
    <tbody>
      <tr>
        <td style="background:#fff">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td
                  style="padding: 0px 10px;font-size:1px;line-height:1px;border-bottom:0.5px #0B798B solid"
                >
                  <span>PayRunner</span>
              </tr>
            </tbody>
          </table>

          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td style="width:40px"></td>
                <td style="padding:20px 0">
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="font:30px Malgun Gothic;letter-spacing:-1px;color:#0B798B;"
                        >
                          <span>[페이러너] 인증번호를 안내해 드려요</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="padding:10px 0px;font:16px/26px Malgun Gothic;color:#767676"
                        >
                          안녕하세요
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="font:16px/26px Malgun Gothic;color:#767676"
                        >
                          페이러너 회원가입을 위해 이메일 인증이 필요해요<br />아래
                          인증 번호를 입력해주세요<br />
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                              <tr>
                                <td style="display:block;"></td>
                              </tr>
                            </tbody>
                          </table>

                          <table border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                              <tr>
                                <td style="display:block;height:10px"></td>
                              </tr>
                            </tbody>
                          </table>
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            style="width:100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="background:#0B798B;font-size:1px;line-height:1px;height:1px"
                                ></td>
                              </tr>
                            </tbody>
                          </table>
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            style="width:100%;table-layout:fixed;border-bottom:1px #0B798B solid"
                          >
                            <colgroup>
                              <col width="18%" />
                              <col />
                              <col width="18%" />
                              <col />
                            </colgroup>
                            <tbody>
                              <tr>
                                <th
                                  style="padding:8px 0;font:bold 14px/20px Malgun Gothic;letter-spacing:-1px;color:#fff;text-align:center;background:#0B798B;"
                                >
                                  이메일
                                </th>
                                <td
                                  style="padding:8px 10px;font:14px/20px Malgun Gothic;color:#4b5964;border-left:1px #e0e0e0 solid;border-top:1px #e0e0e0 solid"
                                >
                                  ${userEmail}
                                </td>
                              </tr>
                              <tr>
                                <th
                                  style="padding:8px 0;font:bold 14px/20px Malgun Gothic;letter-spacing:-1px;color:#fff;text-align:center;background:#0B798B;"
                                >
                                  인증 번호
                                </th>
                                <td
                                  colspan="3"
                                  style="padding:8px 10px;font:14px/20px Malgun Gothic;color:#4b5964;border-left:1px #e0e0e0 solid;border-top:1px #e0e0e0 solid"
                                >
                                  ${randomCode}
                                </td>
                              </tr>
                              <tr>
                                <th
                                  style="padding:8px 0;font:bold 14px/20px Malgun Gothic;letter-spacing:-1px;color:#fff;text-align:center;background:#0B798B;"
                                >
                                  요청 시간
                                </th>
                                <td
                                  colspan="3"
                                  style="padding:8px 10px;font:14px/20px Malgun Gothic;color:#4b5964;border-left:1px #e0e0e0 solid;border-top:1px #e0e0e0 solid"
                                >
                                  ${new Date().toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style="width:40px"></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      transporter.close();
      return res.status(500).send(err);
    } else {
      console.log("email sent : " + info.response);
      transporter.close();
      return res.status(200).json({ code: randomCode });
    }
  });
});

export default router;
