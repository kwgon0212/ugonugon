import express, { Response, Request } from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    // const { name, contact, position, salary, company, workPeriod } = req.body;

    const userId = "67cfd0e3c7cd52ffd3d7e2fc";
    const authorId = "67cfd0e3c7cd52ffd3d7e2fc";

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
                    <span style="padding: 0 20px; border-bottom: 1px solid black">${"고용주"}</span>(이하 "갑"이라 함)과(와) <span style="padding: 0 20px; border-bottom: 1px solid black">${"근로자"}</span>(이하 "을"이라 함)은 다음과
                    같이 근로계약을 체결한다.
                  </p>
                  <div class="wrap" style="font-size: 18px">
                    <p>1. 근로계약기간 : ${"year"}년 ${"month"}월 ${"date"}일 ~ 기간의 정함이 없음</p>
                    <p>2. 근 무 장 소 : ${"address"}</p>
                    <p>3. 업무의 내용 : ${"workDetail"}</p>
                    <p>4. 근 로 시 간 : ${"hour"}시 ${"min"}분부터 ${"hour"}시 ${"min"}분까지 (휴게시간: ${"hour"}시 ${"min"}분 ~ ${"hour"}시 ${"min"}분)</p>
                    <p>5. 근무일/휴일 : 매주 ${"date"}일(또는 매일단위)근무, 주휴일 매주 ${"day"}요일</p>
                    <p>6. 임 금</p>
                    <div style="padding: 0 20px;display: flex;flex-direction: column;gap: 10px;">
                      <p>- 임금지급일 : 매월(매주 또는 매일) 일(휴일의 경우는 전일 지급)</p>
                      <p>- 시간(일, 월)급 : ${10000}원</p>
                      <p>- 지급방법 : 예금통장에 입금</p>
                    </div>
                    <p>7. 기 타</p>
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
                        <p>(갑) 사업체명 : ${"사업체명"}</p>
                        <p>(사업자번호 : ${"사업자번호"})</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>주 소 : ${"사업체주소"}</p>
                        <p>(사무실연락처 : ${"사무실연락처"})</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>대 표 자 : ${"대표자명"}</p>
                        <p style="position: relative">(서명)
                          <img src="https://storage.googleapis.com/payrunner-d2f70.firebasestorage.app/signature/${authorId}.webp" width="300px" height="100px" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);opacity: 0.7;mix-blend-mode: multiply;object-fit: contain;"/>
                        </p>
                      </div>
                    </div>
                    <div style="width: 100%;padding: 20px 0;display: flex;flex-direction: column;gap: 10px;">
                      <div style="display: flex; justify-content: space-between">
                        <p>(을) 주 소 : ${"주소"}</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>연 락 처 : ${"연락처"}</p>
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <p>성 명 : ${"성명"}</p>
                        <p style="position: relative">(서명)
                          <img src="https://storage.googleapis.com/payrunner-d2f70.firebasestorage.app/signature/${userId}.webp" width="300px" height="100px" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);opacity: 0.7;mix-blend-mode: multiply;object-fit: contain;"/>
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
