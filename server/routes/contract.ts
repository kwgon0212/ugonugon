import express, { Response, Request } from "express";
import puppeteer from "puppeteer";

const router = express.Router();

/**
 * @swagger
 * /api/contract:
 *   post:
 *     summary: 근로계약서 PDF 생성 API
 *     tags: [Contract - 근로계약서]
 *     description: 근로계약서를 PDF로 생성하여 다운로드할 수 있습니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 description: 근로자 정보
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "김철수"
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                         example: "서울특별시 강남구 테헤란로 123"
 *                       detail:
 *                         type: string
 *                         example: "101동 202호"
 *                   phone:
 *                     type: string
 *                     example: "01012345678"
 *                   _id:
 *                     type: string
 *                     example: "650f8e8e8f8e8f8e8f8e8f8e"
 *               post:
 *                 type: object
 *                 description: 공고 정보
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "편의점 아르바이트"
 *                   workDetail:
 *                     type: string
 *                     example: "매장 관리 및 고객 응대"
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                         example: "서울특별시 강남구 테헤란로 123"
 *                       detail:
 *                         type: string
 *                         example: "101동 202호"
 *                   pay:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "시급"
 *                       value:
 *                         type: integer
 *                         example: 10000
 *                   period:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-16T09:00:00.000Z"
 *                       end:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-16T18:00:00.000Z"
 *                   hour:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-16T09:00:00.000Z"
 *                       end:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-16T18:00:00.000Z"
 *                   restTime:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-16T12:00:00.000Z"
 *                       end:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-16T13:00:00.000Z"
 *               employer:
 *                 type: object
 *                 description: 고용주 정보
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "홍길동"
 *                   phone:
 *                     type: string
 *                     example: "0212345678"
 *                   _id:
 *                     type: string
 *                     example: "650f8e8e8f8e8f8e8f8e8f8e"
 *     responses:
 *       200:
 *         description: 성공적으로 PDF 생성 완료
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: 요청이 올바르지 않은 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 데이터가 누락되었습니다."
 *       500:
 *         description: 서버 내부 오류로 PDF 생성 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "PDF 생성 실패"
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { user, post, employer } = req.body;
    const periodStart = {
      year: new Date(post.period.start).getFullYear(),
      month: new Date(post.period.start).getMonth() + 1,
      day: new Date(post.period.start).getDate(),
    };

    const periodEnd = {
      year: new Date(post.period.end).getFullYear(),
      month: new Date(post.period.end).getMonth() + 1,
      day: new Date(post.period.end).getDate(),
    };

    const workTime = {
      start: {
        hour: new Date(post.hour.start).getHours(),
        minute: new Date(post.hour.start).getMinutes(),
      },
      end: {
        hour: new Date(post.hour.end).getHours(),
        minute: new Date(post.hour.end).getMinutes(),
      },
    };

    const restTime = {
      start: {
        hour: new Date(post.restTime.start).getHours(),
        minute: new Date(post.restTime.start).getMinutes(),
      },
      end: {
        hour: new Date(post.restTime.end).getHours(),
        minute: new Date(post.restTime.end).getMinutes(),
      },
    };

    // <p>5. 근무일/휴일 : 매주 ${"date"}일(또는 매일단위)근무, 주휴일 매주 ${"day"}요일</p>
    // <p>- 임금지급일 : 매월(매주 또는 매일) 일(휴일의 경우는 전일 지급)</p>
    // <p>(사업자번호 : ${"사업자번호"})</p>

    const now = new Date();

    const htmlContent = `<!DOCTYPE html>
            <html lang="ko">
              <head>
                <title>표준근로계약서</title>
                <style>
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                  p,h1 { margin: 0; }
                  .wrapper {
                    width: 794px;
                    height: 1120px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    border: 2px solid black;
                    padding: 40px;
                    box-sizing: border-box;
                    background: white;
                  }
                  .wrap {
                    display: flex;
                    width: 100%;
                    flex-direction: column;
                    align-items: start;
                    gap: 20px;
                  }
                </style>
              </head>
              <body>
                <div class="wrapper">
                  <h1 style="border: 1px solid lightgray; padding: 0 100px">표준근로계약서</h1>
                  <p style="padding: 50px 0; font-size: 20px">
                    <span style="padding: 0 20px; border-bottom: 1px solid black">${
                      employer.name
                    }</span>(이하 "갑"이라 함)과(와) <span style="padding: 0 20px; border-bottom: 1px solid black">${
      user.name
    }</span>(이하 "을"이라 함)은 다음과
                    같이 근로계약을 체결한다.
                  </p>
                  <div class="wrap" style="font-size: 18px">
                    <p>1. 근로계약기간 : ${periodStart.year}년 ${
      periodStart.month
    }월 ${periodStart.day}일 ~ ${periodEnd.year}년 ${periodEnd.month}월 ${
      periodEnd.day
    }일</p>
                    <p>2. 근 무 장 소 : ${post.address.street} ${
      post.address.detail ? post.address.detail : ""
    }</p>
                    <p>3. 업무의 내용 : ${post.workDetail}</p>
                    <p>4. 근 로 시 간 : ${workTime.start.hour}시 ${
      workTime.start.minute
    }분부터 ${workTime.end.hour}시 ${workTime.end.minute}분까지 (휴게시간: ${
      restTime.start.hour
    }시 ${restTime.start.minute}분 ~ ${restTime.end.hour}시 ${
      restTime.end.minute
    }분)</p>
                    <p>5. 임 금</p>
                    <div style="padding: 0 20px;display: flex;flex-direction: column;gap: 10px;">
                      <p>- ${
                        post.pay.type
                      } : ${post.pay.value.toLocaleString()}원</p>
                      <p>- 지급방법 : 예금통장에 입금</p>
                    </div>
                    <p>6. 기 타</p>
                    <div style="padding: 0 20px;display: flex;flex-direction: column;gap: 10px;">
                      <p>- 이 계약에 정함이 없는 사항은 근로기준법에 의함</p>
                    </div>
                    <p style="width: 100%;text-align: center;padding: 40px 0;font-size: 20px;">
                      ${now.getFullYear()}년 ${
      now.getMonth() + 1
    }월 ${now.getDate()}일
                    </p>
                    <div style="width: 100%;padding: 20px 0;display: flex;flex-direction: column;gap: 10px;">
                      <div style="display: flex; justify-content: space-between">
                        <p>(갑) 사업명 : ${post.title}</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>주 소 : ${post.address.street} ${
      post.address.detail ? post.address.detail : ""
    }</p>
                        <p>(사무실연락처 : ${employer.phone.replace(
                          /^(\d{3})(\d{4})(\d{4})$/,
                          "$1-$2-$3"
                        )})</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>대 표 자 : ${employer.name}</p>
                        <p style="position: relative">(서명)
                          <img src="https://storage.googleapis.com/payrunner-d2f70.firebasestorage.app/signature/${employer._id.toString()}.webp" width="300px" height="100px" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);opacity: 0.7;mix-blend-mode: multiply;object-fit: contain;"/>
                        </p>
                      </div>
                    </div>
                    <div style="width: 100%;padding: 20px 0;display: flex;flex-direction: column;gap: 10px;">
                      <div style="display: flex; justify-content: space-between">
                        <p>(을) 주 소 : ${user.address.street} ${
      user.address.detail ? user.address.detail : ""
    }</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>연 락 처 : ${user.phone.replace(
                          /^(\d{3})(\d{4})(\d{4})$/,
                          "$1-$2-$3"
                        )}</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>성 명 : ${user.name}</p>
                        <p style="position: relative">(서명)
                          <img src="https://storage.googleapis.com/payrunner-d2f70.firebasestorage.app/signature/${user._id.toString()}.webp" width="300px" height="100px" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);opacity: 0.7;mix-blend-mode: multiply;object-fit: contain;"/>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
      `;

    // fs.writeFileSync("output.html", htmlContent, "utf8");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // await page.pdf({ path: "test.pdf", format: "A4", printBackground: true });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      width: "210mm",
      height: "297mm",
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=contract.pdf");
    res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    res.status(500).json({ error: "PDF 생성 실패" });
  }
});

export default router;
