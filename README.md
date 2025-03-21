# 📌 근로관리 올인원 플랫폼

> 근로 공고 등록부터 전자 근로계약서 작성, 출퇴근 관리, 자동 임금 정산까지, 근로자의 권익 보호와 고용주의 업무 편의를 위한 올인원 근로관리 솔루션입니다.

![PayRunner](https://raw.githubusercontent.com/kwgon0212/PayRunner/refs/heads/main/public/logo.png)

---

## ✨ 프로젝트 소개

최근 근로계약서 미작성으로 인한 임금 체불 및 출퇴근 시간 관리 불투명 등으로 사회적 문제가 되고 있습니다. 본 프로젝트는 이러한 문제를 해결하고자 전자 근로계약서 기반으로 투명하고 신뢰할 수 있는 근로환경을 제공하는 것을 목적으로 합니다.

---

## 🚀 핵심 기능

- ✅ **근로 공고 관리**

  - 고용주가 편리하게 공고 등록 및 관리 가능

- ✅ **전자 근로계약서 작성**

  - 토스 전자 계약 API를 활용하여 법적 효력을 갖춘 전자 계약

- 📍 **위치 기반 출퇴근 인증**

  - GPS 기반 위치 인증을 통해 근로자와 고용주 모두에게 신뢰성 있는 출퇴근 기록 제공

- 💰 **임금 자동 정산**

  - 출퇴근 기록 기반 자동 임금 산출 및 관리 기능 제공

- 💬 **실시간 채팅 기능**
  - 실시간 채팅 기능을 통해 근로자와 고용주 간 빠른 소통

---

## 📌 상세 기능

| 기능                   | 상세 설명                                                           |
| ---------------------- | ------------------------------------------------------------------- |
| 근로 공고 등록 및 관리 | 다양한 근로 조건을 설정하여 구체적인 근로 공고 게시 및 관리         |
| 전자 근로계약서        | 토스 API 기반으로 신뢰성 있는 계약서 작성 및 관리                   |
| 출퇴근 관리            | GPS 기반 정확한 출퇴근 시간 기록 및 위치 인증 제공                  |
| 임금 자동 정산         | 출퇴근 기록을 토대로 자동으로 임금을 정산하여 빠르게 임금 지급 관리 |
| 실시간 채팅 시스템     | 근로 중 발생할 수 있는 문제 해결을 위한 고용주-근로자 소통 지원     |

---

## ⚙️ 기술 스택
### 아키텍쳐
![image](https://github.com/user-attachments/assets/413efbdf-c6bf-4b0a-ac88-8c16496dfc4d)

### Frontend

- React.js
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- firebase

### API & Tools

- Toss 전자 계약 API
- Kakao Maps API
- NH오픈플랫폼 개발자센터 API

---

## 📁 데이터베이스 구조

- Users
- Posts
- Attendance
- Resumes
- Banks
- Messages
- Chatrooms

### ERD 다이어그램

![erd](https://github.com/user-attachments/assets/7f6ecb2e-cad4-4111-a1fb-a4932682ffd7)

---

## 📅 프로젝트 로드맵

| 일정 | 내용                     | 상태    |
| ---- | ------------------------ | ------- |
|      | 프로젝트 기획 및 설계    | ✅ 완료 |
|      | DB 및 API 설계           | ✅ 완료 |
|      | 프론트엔드 & 백엔드 개발 | ✅ 완료 |
|      | 로컬 서버 구동 | ✅ 완료 |

---

## 🤝 팀원 소개

| 이름 | 역할 | GitHub |
| ---- | ---- | ------ |
| 김우곤(팀장) | 디자인 및 개발 총괄<br/>페이지 통합 | https://github.com/kwgon0212 |
| 박해원 | Kakao Map API 연동<br/>채팅 및 고용 관련 페이지 담당| https://github.com/haewonee |
| 이유진 | GPS 연동<br/>공고 관련 페이지 담당 | https://github.com/Yu-Jin9 |
| 이종혁 | 금융 API 연동<br/>유저 관련 페이지 담당 | https://github.com/wonder1ng |

---

## 🛠️ 설치 및 실행 방법

```bash
# 프로젝트 클론
$ git clone https://github.com/kwgon0212/PayRunner.git

# 프론트엔드 실행 & 백엔드 실행
$ npm i
$ npm run dev
```

## [발표 자료 링크 클릭](https://docs.google.com/presentation/d/15zcYyquQTVGIw74k3QwHhwMYnJdxq3p0/)
※ 공유 문서 문제로 동영상 재생은 로딩 시간이 필요할 수 있습니다.
