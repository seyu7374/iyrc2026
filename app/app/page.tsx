"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";

type Participant = {
  no: number;
  country: string;
  nameKor: string;
  nameEng: string;
  dateOfBirth: string;
  gender: "M" | "F";
  school: string;
  team: number;
};

type Competition = {
  id: string;
  nameKor: string;
  nameEng: string;
  ageGroup: string;
  type: "개인전" | "2vs2" | "팀전(3-5인)";
  participants: Participant[];
};

const SAMPLE_DATA: Competition[] = [
  // 유치부(~8세)
  {
    id: "bowling",
    nameKor: "로봇 볼링",
    nameEng: "Bowling",
    ageGroup: "유치부(~8세)",
    type: "개인전",
    participants: [
      { no: 1, country: "korea", nameKor: "김준호", nameEng: "Kim Jun Ho", dateOfBirth: "2016-05-10", gender: "M", school: "대전 중앙유치원", team: 1 },
      { no: 2, country: "korea", nameKor: "이지은", nameEng: "Lee Ji Eun", dateOfBirth: "2017-03-15", gender: "F", school: "대전 꼬마유치원", team: 2 },
      { no: 3, country: "korea", nameKor: "박준영", nameEng: "Park Jun Young", dateOfBirth: "2016-08-22", gender: "M", school: "서울 삼성유치원", team: 3 },
    ],
  },
  {
    id: "mini-soccer",
    nameKor: "미니 미니 로봇 축구",
    nameEng: "Mini Robot Soccer",
    ageGroup: "유치부(~8세)",
    type: "2vs2",
    participants: [
      { no: 4, country: "korea", nameKor: "박준호", nameEng: "Park Jun Ho", dateOfBirth: "2016-07-20", gender: "M", school: "대전 중앙유치원", team: 1 },
      { no: 5, country: "korea", nameKor: "이수민", nameEng: "Lee Su Min", dateOfBirth: "2017-02-10", gender: "F", school: "대전 중앙유치원", team: 1 },
      { no: 6, country: "korea", nameKor: "김태희", nameEng: "Kim Tae Hee", dateOfBirth: "2016-11-05", gender: "M", school: "대전 꼬마유치원", team: 2 },
      { no: 7, country: "korea", nameKor: "최진아", nameEng: "Choi Jin A", dateOfBirth: "2017-01-20", gender: "F", school: "대전 꼬마유치원", team: 2 },
    ],
  },
  {
    id: "young-innovator",
    nameKor: "영 이노베이터",
    nameEng: "Young Innovator",
    ageGroup: "유치부(~8세)",
    type: "팀전(3-5인)",
    participants: [
      { no: 8, country: "korea", nameKor: "이서준", nameEng: "Lee Seo Jun", dateOfBirth: "2014-10-03", gender: "M", school: "대전 가장초", team: 1 },
      { no: 9, country: "korea", nameKor: "최현준", nameEng: "Choi Hyeon Jun", dateOfBirth: "2013-11-19", gender: "M", school: "대전 성모초", team: 1 },
      { no: 10, country: "korea", nameKor: "홍석준", nameEng: "Hong Seok Jun", dateOfBirth: "2013-04-16", gender: "M", school: "대전 둔천초", team: 1 },
      { no: 11, country: "korea", nameKor: "정연우", nameEng: "Jung Yeon Woo", dateOfBirth: "2015-01-19", gender: "M", school: "대전 성동초", team: 2 },
      { no: 12, country: "korea", nameKor: "최이수", nameEng: "Choi I Su", dateOfBirth: "2013-06-23", gender: "M", school: "대전 삼천초", team: 2 },
    ],
  },
  // 초등부(8-13세)
  {
    id: "rescue",
    nameKor: "리더쉽 구조 로봇",
    nameEng: "Rescue",
    ageGroup: "초등부(8-13)",
    type: "개인전",
    participants: [
      { no: 13, country: "korea", nameKor: "김민준", nameEng: "Kim Min Jun", dateOfBirth: "2010-05-10", gender: "M", school: "대전 중앙초", team: 1 },
      { no: 14, country: "korea", nameKor: "이지은", nameEng: "Lee Ji Eun", dateOfBirth: "2011-03-15", gender: "F", school: "대전 성모초", team: 2 },
      { no: 15, country: "korea", nameKor: "박세진", nameEng: "Park Se Jin", dateOfBirth: "2010-09-28", gender: "M", school: "서울 동대문초", team: 3 },
    ],
  },
  {
    id: "line-trace",
    nameKor: "라인 트레이싱",
    nameEng: "Line Tracing",
    ageGroup: "초등부(8-13)",
    type: "개인전",
    participants: [
      { no: 16, country: "korea", nameKor: "최준영", nameEng: "Choi Jun Young", dateOfBirth: "2010-12-05", gender: "M", school: "대전 신일초", team: 1 },
      { no: 17, country: "korea", nameKor: "이다영", nameEng: "Lee Da Young", dateOfBirth: "2011-07-18", gender: "F", school: "대전 도솔초", team: 2 },
    ],
  },
  {
    id: "drone-race",
    nameKor: "드론 레이싱",
    nameEng: "Drone Racing",
    ageGroup: "초등부(8-13)",
    type: "2vs2",
    participants: [
      { no: 18, country: "korea", nameKor: "한준수", nameEng: "Han Jun Su", dateOfBirth: "2010-04-12", gender: "M", school: "대전 둔산초", team: 1 },
      { no: 19, country: "korea", nameKor: "박소영", nameEng: "Park So Young", dateOfBirth: "2011-06-23", gender: "F", school: "대전 둔산초", team: 1 },
      { no: 20, country: "korea", nameKor: "이혁진", nameEng: "Lee Hyuk Jin", dateOfBirth: "2010-08-14", gender: "M", school: "서울 삼성초", team: 2 },
      { no: 21, country: "korea", nameKor: "김지은", nameEng: "Kim Ji Eun", dateOfBirth: "2011-02-09", gender: "F", school: "서울 삼성초", team: 2 },
    ],
  },
  {
    id: "animal-kingdom",
    nameKor: "동물의 왕국",
    nameEng: "Animal Kingdom",
    ageGroup: "초등부(8-13)",
    type: "팀전(3-5인)",
    participants: [
      { no: 22, country: "korea", nameKor: "김재훈", nameEng: "Kim Jae Hoon", dateOfBirth: "2010-03-20", gender: "M", school: "대전 중앙초", team: 1 },
      { no: 23, country: "korea", nameKor: "이수현", nameEng: "Lee Su Hyun", dateOfBirth: "2010-11-15", gender: "M", school: "대전 중앙초", team: 1 },
      { no: 24, country: "korea", nameKor: "박미정", nameEng: "Park Mi Jung", dateOfBirth: "2011-05-08", gender: "F", school: "대전 중앙초", team: 1 },
      { no: 25, country: "korea", nameKor: "최기호", nameEng: "Choi Ki Ho", dateOfBirth: "2010-09-12", gender: "M", school: "서울 강남초", team: 2 },
      { no: 26, country: "korea", nameKor: "정하영", nameEng: "Jung Ha Young", dateOfBirth: "2011-01-30", gender: "F", school: "서울 강남초", team: 2 },
    ],
  },
  {
    id: "dance",
    nameKor: "로봇 댄싱",
    nameEng: "Dance",
    ageGroup: "초등부(8-13)",
    type: "팀전(3-5인)",
    participants: [
      { no: 27, country: "korea", nameKor: "박수빈", nameEng: "Park Su Bin", dateOfBirth: "2010-02-14", gender: "F", school: "대전 예술초", team: 1 },
      { no: 28, country: "korea", nameKor: "김현지", nameEng: "Kim Hyun Ji", dateOfBirth: "2010-07-22", gender: "F", school: "대전 예술초", team: 1 },
      { no: 29, country: "korea", nameKor: "이준혁", nameEng: "Lee Jun Hyuk", dateOfBirth: "2010-10-05", gender: "M", school: "대전 예술초", team: 1 },
      { no: 30, country: "korea", nameKor: "최다은", nameEng: "Choi Da Eun", dateOfBirth: "2011-04-18", gender: "F", school: "서울 예술초", team: 2 },
      { no: 31, country: "korea", nameKor: "박준우", nameEng: "Park Jun Woo", dateOfBirth: "2010-08-27", gender: "M", school: "서울 예술초", team: 2 },
    ],
  },
  // 중.고등(13-18세)
  {
    id: "engineering",
    nameKor: "엔지니어링 설계",
    nameEng: "Engineering Design",
    ageGroup: "중.고등(13-18)",
    type: "개인전",
    participants: [
      { no: 32, country: "korea", nameKor: "박준석", nameEng: "Park Jun Suk", dateOfBirth: "2008-06-10", gender: "M", school: "대전 과학고", team: 1 },
      { no: 33, country: "korea", nameKor: "김소라", nameEng: "Kim So Ra", dateOfBirth: "2009-02-18", gender: "F", school: "대전 영재고", team: 2 },
      { no: 34, country: "korea", nameKor: "이태용", nameEng: "Lee Tae Yong", dateOfBirth: "2007-11-25", gender: "M", school: "서울 과학고", team: 3 },
    ],
  },
  {
    id: "robot-soccer-hs",
    nameKor: "로봇 축구",
    nameEng: "Robot Soccer HS",
    ageGroup: "중.고등(13-18)",
    type: "2vs2",
    participants: [
      { no: 35, country: "korea", nameKor: "김태영", nameEng: "Kim Tae Young", dateOfBirth: "2008-04-15", gender: "M", school: "대전 과학고", team: 1 },
      { no: 36, country: "korea", nameKor: "이지현", nameEng: "Lee Ji Hyun", dateOfBirth: "2008-06-20", gender: "F", school: "대전 과학고", team: 1 },
      { no: 37, country: "korea", nameKor: "박민수", nameEng: "Park Min Su", dateOfBirth: "2009-03-10", gender: "M", school: "대전 일고", team: 2 },
      { no: 38, country: "korea", nameKor: "최수진", nameEng: "Choi Su Jin", dateOfBirth: "2009-05-25", gender: "F", school: "대전 일고", team: 2 },
    ],
  },
  {
    id: "robot-volleyball",
    nameKor: "로봇 배구",
    nameEng: "Robot Volleyball",
    ageGroup: "중.고등(13-18)",
    type: "2vs2",
    participants: [
      { no: 39, country: "korea", nameKor: "정준호", nameEng: "Jung Jun Ho", dateOfBirth: "2008-09-08", gender: "M", school: "서울 영일고", team: 1 },
      { no: 40, country: "korea", nameKor: "한아름", nameEng: "Han Ah Reum", dateOfBirth: "2008-12-19", gender: "F", school: "서울 영일고", team: 1 },
      { no: 41, country: "korea", nameKor: "이준호", nameEng: "Lee Jun Ho", dateOfBirth: "2009-01-25", gender: "M", school: "인천 대건고", team: 2 },
      { no: 42, country: "korea", nameKor: "박지영", nameEng: "Park Ji Young", dateOfBirth: "2009-03-31", gender: "F", school: "인천 대건고", team: 2 },
    ],
  },
  {
    id: "creative-design",
    nameKor: "창작 디자인",
    nameEng: "Creative Design",
    ageGroup: "중.고등(13-18)",
    type: "팀전(3-5인)",
    participants: [
      { no: 43, country: "korea", nameKor: "김준호", nameEng: "Kim Jun Ho", dateOfBirth: "2008-10-03", gender: "M", school: "대전 가장고", team: 1 },
      { no: 44, country: "korea", nameKor: "이준영", nameEng: "Lee Jun Young", dateOfBirth: "2008-11-19", gender: "M", school: "대전 성모고", team: 1 },
      { no: 45, country: "korea", nameKor: "박민재", nameEng: "Park Min Jae", dateOfBirth: "2008-04-16", gender: "M", school: "대전 둔천고", team: 1 },
      { no: 46, country: "korea", nameKor: "최민영", nameEng: "Choi Min Young", dateOfBirth: "2008-03-15", gender: "M", school: "대전 과학고", team: 2 },
      { no: 47, country: "korea", nameKor: "이은지", nameEng: "Lee Eun Ji", dateOfBirth: "2008-07-22", gender: "F", school: "대전 고등학교", team: 2 },
    ],
  },
  {
    id: "on-the-spot",
    nameKor: "온 더 스팟",
    nameEng: "On The Spot",
    ageGroup: "중.고등(13-18)",
    type: "팀전(3-5인)",
    participants: [
      { no: 48, country: "korea", nameKor: "박지훈", nameEng: "Park Ji Hoon", dateOfBirth: "2007-05-12", gender: "M", school: "서울 과학고", team: 1 },
      { no: 49, country: "korea", nameKor: "김혜진", nameEng: "Kim Hye Jin", dateOfBirth: "2007-08-20", gender: "F", school: "서울 과학고", team: 1 },
      { no: 50, country: "korea", nameKor: "이철준", nameEng: "Lee Chul Jun", dateOfBirth: "2007-06-14", gender: "M", school: "서울 과학고", team: 1 },
      { no: 51, country: "korea", nameKor: "정윤호", nameEng: "Jung Yun Ho", dateOfBirth: "2008-02-28", gender: "M", school: "인천 과학고", team: 2 },
      { no: 52, country: "korea", nameKor: "이서영", nameEng: "Lee Seo Young", dateOfBirth: "2008-09-15", gender: "F", school: "인천 과학고", team: 2 },
    ],
  },
  {
    id: "sprint",
    nameKor: "스프린트",
    nameEng: "Sprint",
    ageGroup: "중.고등(13-18)",
    type: "개인전",
    participants: [
      { no: 53, country: "korea", nameKor: "최건우", nameEng: "Choi Gun Woo", dateOfBirth: "2008-03-21", gender: "M", school: "대전 과학고", team: 1 },
      { no: 54, country: "korea", nameKor: "박수연", nameEng: "Park Su Yeon", dateOfBirth: "2008-07-13", gender: "F", school: "대전 영재고", team: 2 },
    ],
  },
  {
    id: "robot-badminton",
    nameKor: "로봇 배드민턴",
    nameEng: "Robot Badminton",
    ageGroup: "중.고등(13-18)",
    type: "2vs2",
    participants: [
      { no: 55, country: "korea", nameKor: "김영호", nameEng: "Kim Young Ho", dateOfBirth: "2008-05-09", gender: "M", school: "서울 중앙고", team: 1 },
      { no: 56, country: "korea", nameKor: "이혜원", nameEng: "Lee Hye Won", dateOfBirth: "2008-11-17", gender: "F", school: "서울 중앙고", team: 1 },
      { no: 57, country: "korea", nameKor: "박준형", nameEng: "Park Jun Hyung", dateOfBirth: "2009-02-23", gender: "M", school: "인천 남동고", team: 2 },
      { no: 58, country: "korea", nameKor: "최은지", nameEng: "Choi Eun Ji", dateOfBirth: "2009-04-30", gender: "F", school: "인천 남동고", team: 2 },
    ],
  },
  {
    id: "super-structure",
    nameKor: "슈퍼 스트럭처",
    nameEng: "Super Structure",
    ageGroup: "중.고등(13-18)",
    type: "팀전(3-5인)",
    participants: [
      { no: 59, country: "korea", nameKor: "이동휸", nameEng: "Lee Dong Hwan", dateOfBirth: "2008-01-08", gender: "M", school: "광주 과학고", team: 1 },
      { no: 60, country: "korea", nameKor: "한지훈", nameEng: "Han Ji Hoon", dateOfBirth: "2008-03-24", gender: "M", school: "광주 과학고", team: 1 },
      { no: 61, country: "korea", nameKor: "박혜진", nameEng: "Park Hye Jin", dateOfBirth: "2008-09-05", gender: "F", school: "광주 과학고", team: 1 },
      { no: 62, country: "korea", nameKor: "최준혁", nameEng: "Choi Jun Hyuk", dateOfBirth: "2009-04-12", gender: "M", school: "전주 과학고", team: 2 },
      { no: 63, country: "korea", nameKor: "김지은", nameEng: "Kim Ji Eun", dateOfBirth: "2009-07-19", gender: "F", school: "전주 과학고", team: 2 },
    ],
  },
  // 추가 경쟁 (더 많은 종목)
  {
    id: "soccer-elementary",
    nameKor: "로봇 축구 초등",
    nameEng: "Robot Soccer Elementary",
    ageGroup: "초등부(8-13)",
    type: "2vs2",
    participants: [
      { no: 64, country: "korea", nameKor: "이준우", nameEng: "Lee Jun Woo", dateOfBirth: "2010-01-15", gender: "M", school: "대전 신일초", team: 1 },
      { no: 65, country: "korea", nameKor: "박지원", nameEng: "Park Ji Won", dateOfBirth: "2010-05-23", gender: "F", school: "대전 신일초", team: 1 },
      { no: 66, country: "korea", nameKor: "김준호", nameEng: "Kim Jun Ho", dateOfBirth: "2011-02-10", gender: "M", school: "서울 도봉초", team: 2 },
      { no: 67, country: "korea", nameKor: "이나영", nameEng: "Lee Na Young", dateOfBirth: "2011-04-18", gender: "F", school: "서울 도봉초", team: 2 },
    ],
  },
  {
    id: "bio-rescue",
    nameKor: "바이오 하자드 구조",
    nameEng: "Bio-Hazard Rescue",
    ageGroup: "초등부(8-13)",
    type: "팀전(3-5인)",
    participants: [
      { no: 68, country: "korea", nameKor: "박효진", nameEng: "Park Hyo Jin", dateOfBirth: "2010-06-09", gender: "F", school: "대전 둔산초", team: 1 },
      { no: 69, country: "korea", nameKor: "김석준", nameEng: "Kim Seok Jun", dateOfBirth: "2010-09-14", gender: "M", school: "대전 둔산초", team: 1 },
      { no: 70, country: "korea", nameKor: "이준혁", nameEng: "Lee Jun Hyuk", dateOfBirth: "2011-01-22", gender: "M", school: "대전 둔산초", team: 1 },
      { no: 71, country: "korea", nameKor: "최윤진", nameEng: "Choi Yun Jin", dateOfBirth: "2010-11-05", gender: "F", school: "서울 영화초", team: 2 },
      { no: 72, country: "korea", nameKor: "박준영", nameEng: "Park Jun Young", dateOfBirth: "2011-03-16", gender: "M", school: "서울 영화초", team: 2 },
    ],
  },
  {
    id: "wall-climbing",
    nameKor: "벽 타기",
    nameEng: "Wall Climbing",
    ageGroup: "초등부(8-13)",
    type: "개인전",
    participants: [
      { no: 73, country: "korea", nameKor: "이준석", nameEng: "Lee Jun Suk", dateOfBirth: "2011-08-11", gender: "M", school: "대전 신일초", team: 1 },
      { no: 74, country: "korea", nameKor: "한혜민", nameEng: "Han Hye Min", dateOfBirth: "2010-10-27", gender: "F", school: "대전 신일초", team: 2 },
      { no: 75, country: "korea", nameKor: "최준호", nameEng: "Choi Jun Ho", dateOfBirth: "2011-12-03", gender: "M", school: "인천 심곡초", team: 3 },
    ],
  },
  {
    id: "wro-high",
    nameKor: "WRO 고등부",
    nameEng: "WRO High School",
    ageGroup: "중.고등(13-18)",
    type: "팀전(3-5인)",
    participants: [
      { no: 76, country: "korea", nameKor: "정준호", nameEng: "Jung Jun Ho", dateOfBirth: "2007-02-14", gender: "M", school: "대전 과학고", team: 1 },
      { no: 77, country: "korea", nameKor: "이혁진", nameEng: "Lee Hyuk Jin", dateOfBirth: "2007-08-19", gender: "M", school: "대전 과학고", team: 1 },
      { no: 78, country: "korea", nameKor: "박지윤", nameEng: "Park Ji Yoon", dateOfBirth: "2008-05-28", gender: "F", school: "대전 과학고", team: 1 },
      { no: 79, country: "korea", nameKor: "최민지", nameEng: "Choi Min Ji", dateOfBirth: "2007-11-09", gender: "F", school: "서울 과학고", team: 2 },
      { no: 80, country: "korea", nameKor: "김동욱", nameEng: "Kim Dong Wook", dateOfBirth: "2008-07-23", gender: "M", school: "서울 과학고", team: 2 },
    ],
  },
  {
    id: "roborace",
    nameKor: "로보레이스",
    nameEng: "Robo Race",
    ageGroup: "중.고등(13-18)",
    type: "개인전",
    participants: [
      { no: 81, country: "korea", nameKor: "최준영", nameEng: "Choi Jun Young", dateOfBirth: "2008-12-21", gender: "M", school: "대전 대신고", team: 1 },
      { no: 82, country: "korea", nameKor: "이지호", nameEng: "Lee Ji Ho", dateOfBirth: "2009-06-15", gender: "M", school: "서울 명문고", team: 2 },
      { no: 83, country: "korea", nameKor: "박혜진", nameEng: "Park Hye Jin", dateOfBirth: "2008-04-08", gender: "F", school: "인천 과학고", team: 3 },
    ],
  },
  {
    id: "green-energy",
    nameKor: "그린 에너지",
    nameEng: "Green Energy",
    ageGroup: "중.고등(13-18)",
    type: "팀전(3-5인)",
    participants: [
      { no: 84, country: "korea", nameKor: "이준호", nameEng: "Lee Jun Ho", dateOfBirth: "2007-03-20", gender: "M", school: "대전 과학고", team: 1 },
      { no: 85, country: "korea", nameKor: "박수진", nameEng: "Park Su Jin", dateOfBirth: "2007-09-11", gender: "F", school: "대전 과학고", team: 1 },
      { no: 86, country: "korea", nameKor: "김현준", nameEng: "Kim Hyun Jun", dateOfBirth: "2008-02-15", gender: "M", school: "대전 과학고", team: 1 },
      { no: 87, country: "korea", nameKor: "이다솜", nameEng: "Lee Da Som", dateOfBirth: "2007-10-25", gender: "F", school: "서울 과학고", team: 2 },
      { no: 88, country: "korea", nameKor: "최정호", nameEng: "Choi Jung Ho", dateOfBirth: "2008-08-30", gender: "M", school: "서울 과학고", team: 2 },
    ],
  },
];

export default function AppPage() {
  const [selectedCompId, setSelectedCompId] = useState<string>("bowling");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isScoringMode, setIsScoringMode] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [competitions, setCompetitions] = useState<Competition[]>(SAMPLE_DATA);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const selectedComp = competitions.find((c) => c.id === selectedCompId);
  const filteredParticipants = selectedComp?.participants.filter(
    (p) =>
      p.nameKor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameEng.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.school.includes(searchTerm)
  ) || [];

  const handleScoreChange = (teamNo: number, score: string) => {
    const numScore = parseFloat(score);
    if (!isNaN(numScore) && numScore >= 0) {
      setScores((prev) => ({ ...prev, [teamNo]: numScore }));
    } else if (score === "") {
      setScores((prev) => {
        const newScores = { ...prev };
        delete newScores[teamNo];
        return newScores;
      });
    }
  };

  const getTeamScore = (teamNo: number) => {
    return scores[teamNo] ?? "";
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!selectedComp) {
          setUploadMessage("종목을 선택해주세요.");
          return;
        }

        const newParticipants: Participant[] = jsonData.map((row: any, idx: number) => {
          // 동적 헤더 감지 (한글 또는 영문)
          const getField = (korName: string, engName: string) => {
            return row[korName] || row[engName] || "";
          };

          // 팀 정보 추출: 여러 컬럼에서 팀/조 정보를 찾음
          let teamInfo = "";
          Object.keys(row).forEach((key) => {
            if (
              (row[key] && String(row[key]).includes("TEAM")) ||
              (row[key] && String(row[key]).match(/^[A-D]$/))
            ) {
              teamInfo = String(row[key]).trim();
            }
          });

          // 팀 번호 파싱
          let teamNo = 1;
          if (teamInfo.includes("TEAM A") || teamInfo === "A")
            teamNo = 1;
          else if (teamInfo.includes("TEAM B") || teamInfo === "B")
            teamNo = 2;
          else if (teamInfo.includes("TEAM C") || teamInfo === "C")
            teamNo = 3;
          else if (teamInfo.includes("TEAM D") || teamInfo === "D")
            teamNo = 4;
          else teamNo = parseInt(teamInfo) || idx + 1;

          return {
            no: parseInt(
              row["No."] || row["번호"] || row["序号"] || idx + 1
            ),
            country:
              row["Country"] ||
              row["国家"] ||
              row["국가"] ||
              "korea",
            nameKor:
              row["Passport name"] ||
              row["护照名称"] ||
              row["이름"] ||
              "",
            nameEng: "",
            dateOfBirth:
              row["Date of Birth(yymmdd)"] ||
              row["出生年月日"] ||
              row["생년월일"] ||
              "",
            gender: (
              row["Gender M/F"] ||
              row["性别"] ||
              row["성별"] ||
              "M"
            ).toUpperCase() as "M" | "F",
            school: row["School"] || row["学校"] || row["학교"] || "",
            team: teamNo,
          };
        });

        const updatedComps = competitions.map((comp) =>
          comp.id === selectedCompId
            ? { ...comp, participants: newParticipants }
            : comp
        );
        setCompetitions(updatedComps);
        setUploadMessage(
          `✅ ${newParticipants.length}명이 입력되었습니다.`
        );
        setScores({});
        setTimeout(() => setUploadMessage(""), 3000);
      } catch (error) {
        console.error("Excel upload error:", error);
        setUploadMessage(
          "❌ 파일을 읽을 수 없습니다. 형식을 확인해주세요."
        );
        setTimeout(() => setUploadMessage(""), 3000);
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };

  // 팀전인 경우 팀별로 그룹핑
  const groupedByTeam = selectedComp?.type !== "개인전"
    ? Array.from({ length: Math.max(...filteredParticipants.map((p) => p.team)) }, (_, i) => {
        const teamMembers = filteredParticipants.filter((p) => p.team === i + 1);
        return { teamNo: i + 1, members: teamMembers };
      }).filter((g) => g.members.length > 0)
    : null;

  // 정렬 로직
  const sortedParticipants = isScoringMode && selectedComp?.type === "개인전"
    ? [...filteredParticipants].sort((a, b) => {
        const scoreA = scores[a.team] ?? 0;
        const scoreB = scores[b.team] ?? 0;
        return scoreB - scoreA;
      })
    : filteredParticipants;

  const sortedTeams = isScoringMode && selectedComp?.type !== "개인전" && groupedByTeam
    ? [...groupedByTeam].sort((a, b) => {
        const scoreA = scores[a.teamNo] ?? 0;
        const scoreB = scores[b.teamNo] ?? 0;
        return scoreB - scoreA;
      })
    : groupedByTeam;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-black/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white hover:text-gray-300 transition">
            ← 돌아가기
          </Link>

          {/* 심사 모드 토글 */}
          <button
            onClick={() => setIsScoringMode(!isScoringMode)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isScoringMode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {isScoringMode ? "🎯 심사 모드 ON" : "📋 심사 모드 OFF"}
          </button>
        </div>
      </header>

      <main>
        {/* 페이지 제목 */}
        <section className="py-8 px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">대회 참가자 리스트</h1>
            <p className="text-gray-400">
              2025 IYRC Korea - {isScoringMode ? "점수 입력 중" : "종목별 참가자 현황"}
            </p>
          </div>
        </section>

        {/* 종목 선택 */}
        <section className="py-8 px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
              종목 선택
            </h2>
            <div className="flex flex-wrap gap-3">
              {SAMPLE_DATA.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => {
                    setSelectedCompId(comp.id);
                    setScores({});
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedCompId === comp.id
                      ? "bg-white text-black"
                      : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                  }`}
                  title={`${comp.type}`}
                >
                  {comp.nameKor}
                  <span className="ml-2 text-sm opacity-75">
                    ({selectedComp?.id === comp.id ? `${filteredParticipants.length}명` : `${comp.participants.length}명`})
                  </span>
                </button>
              ))}
            </div>
            {selectedComp && (
              <div className="mt-4 text-sm text-gray-400">
                <span className="bg-gray-900/50 px-3 py-1 rounded">
                  {selectedComp.nameEng} • {selectedComp.ageGroup} • {selectedComp.type}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 엑셀 업로드 */}
        <section className="py-6 px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
              참가자 정보 엑셀 업로드
            </h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors">
                <span className="text-sm">📁 파일 선택</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500">
                엑셀 형식: 번호 | 이름(한글) | 이름(영문) | 생년월일 | 성별 | 학교 | 조/팀
              </span>
            </div>
            {uploadMessage && (
              <div className={`mt-2 text-sm ${uploadMessage.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                {uploadMessage}
              </div>
            )}
          </div>
        </section>

        {/* 검색 */}
        <section className="py-6 px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <input
              type="text"
              placeholder="이름, 영문이름, 학교로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
            />
          </div>
        </section>

        {/* 참가자 리스트 테이블 */}
        <section className="py-8 px-8">
          <div className="max-w-7xl mx-auto">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  {searchTerm
                    ? "검색 결과가 없습니다."
                    : "참가자 정보가 없습니다."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {selectedComp?.type === "개인전" ? (
                  // 개인전 테이블
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        {isScoringMode && (
                          <th className="px-6 py-4 text-center font-semibold text-gray-300 w-12">
                            순위
                          </th>
                        )}
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          No.
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          이름 (한글)
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          영문이름
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          생년월일
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          성별
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          학교
                        </th>
                        {isScoringMode && (
                          <th className="px-6 py-4 text-center font-semibold text-gray-300">
                            점수
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedParticipants.map((p, idx) => (
                        <tr
                          key={p.no}
                          className={`border-b border-gray-800 ${
                            idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900/50"
                          } ${
                            isScoringMode && scores[p.team]
                              ? "bg-green-950/30"
                              : ""
                          } hover:bg-gray-900 transition-colors`}
                        >
                          {isScoringMode && (
                            <td className="px-6 py-4 text-center font-bold text-yellow-400">
                              {scores[p.team] ? idx + 1 : "-"}
                            </td>
                          )}
                          <td className="px-6 py-4 text-white font-medium">
                            {p.no}
                          </td>
                          <td className="px-6 py-4 text-white">
                            {p.nameKor}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {p.nameEng}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {p.dateOfBirth}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {p.gender === "M" ? "남" : "여"}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {p.school}
                          </td>
                          {isScoringMode && (
                            <td className="px-6 py-4 text-center">
                              <input
                                type="number"
                                placeholder="점수"
                                value={getTeamScore(p.team)}
                                onChange={(e) =>
                                  handleScoreChange(p.team, e.target.value)
                                }
                                min="0"
                                step="0.5"
                                className="w-20 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-center focus:border-green-500 focus:outline-none"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  // 팀전 테이블
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        {isScoringMode && (
                          <th className="px-6 py-4 text-center font-semibold text-gray-300 w-12">
                            순위
                          </th>
                        )}
                        <th className="px-6 py-4 text-center font-semibold text-gray-300">
                          조
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          팀원 (명)
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          학교
                        </th>
                        {isScoringMode && (
                          <th className="px-6 py-4 text-center font-semibold text-gray-300">
                            팀 점수
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams?.map((group, idx) => (
                        <tr
                          key={group.teamNo}
                          className={`border-b border-gray-800 ${
                            idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900/50"
                          } ${
                            isScoringMode && scores[group.teamNo]
                              ? "bg-green-950/30"
                              : ""
                          } hover:bg-gray-900 transition-colors`}
                        >
                          {isScoringMode && (
                            <td className="px-6 py-4 text-center font-bold text-yellow-400">
                              {scores[group.teamNo] ? idx + 1 : "-"}
                            </td>
                          )}
                          <td className="px-6 py-4 text-center font-bold">
                            <span className="inline-block bg-white text-black px-4 py-2 rounded font-semibold">
                              {group.teamNo}조
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {group.members.map((m) => m.nameKor).join(", ")} ({group.members.length}명)
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {group.members.map((m) => m.school).join(" / ")}
                          </td>
                          {isScoringMode && (
                            <td className="px-6 py-4 text-center">
                              <input
                                type="number"
                                placeholder="팀 점수"
                                value={getTeamScore(group.teamNo)}
                                onChange={(e) =>
                                  handleScoreChange(group.teamNo, e.target.value)
                                }
                                min="0"
                                step="0.5"
                                className="w-20 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-center focus:border-green-500 focus:outline-none"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* 요약 정보 */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded">
                      <p className="text-gray-400 text-sm mb-1">전체 참가자</p>
                      <p className="text-2xl font-bold text-white">
                        {filteredParticipants.length}명
                      </p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded">
                      <p className="text-gray-400 text-sm mb-1">남학생</p>
                      <p className="text-2xl font-bold text-white">
                        {filteredParticipants.filter((p) => p.gender === "M")
                          .length}명
                      </p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded">
                      <p className="text-gray-400 text-sm mb-1">여학생</p>
                      <p className="text-2xl font-bold text-white">
                        {filteredParticipants.filter((p) => p.gender === "F")
                          .length}명
                      </p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded">
                      <p className="text-gray-400 text-sm mb-1">
                        {isScoringMode
                          ? selectedComp?.type === "개인전"
                            ? "점수 입력 완료"
                            : "팀 점수 입력 완료"
                          : "팀/조 수"
                      }</p>
                      <p className="text-2xl font-bold text-white">
                        {isScoringMode
                          ? selectedComp?.type === "개인전"
                            ? Object.keys(scores).length
                            : sortedTeams?.filter((g) => scores[g.teamNo])
                                .length || 0
                          : selectedComp?.type === "개인전"
                          ? filteredParticipants.length
                          : sortedTeams?.length || 0}
                        {isScoringMode && selectedComp?.type === "개인전" ? "명" : selectedComp?.type === "개인전" ? "명" : "팀"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 최종 순위 */}
        {isScoringMode && (
          <section className="py-8 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">🏆 최종 순위</h2>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition-colors"
                >
                  🖨️ 인쇄
                </button>
              </div>

              {selectedComp?.type === "개인전" ? (
                // 개인전 순위
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">순위</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">이름</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">학교</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-300">점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedParticipants
                        .filter((p) => scores[p.team])
                        .map((p, idx) => (
                          <tr key={p.no} className="border-b border-gray-800 bg-gray-900/30 hover:bg-gray-900">
                            <td className="px-6 py-4 font-bold">
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}위`}
                            </td>
                            <td className="px-6 py-4 text-white font-medium">{p.nameKor}</td>
                            <td className="px-6 py-4 text-gray-400 text-xs">{p.school}</td>
                            <td className="px-6 py-4 text-right text-white font-bold">{scores[p.team]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // 팀전 순위
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">순위</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">팀/조</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">인원</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-300">점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams
                        ?.filter((g) => scores[g.teamNo])
                        .map((group, idx) => (
                          <tr key={group.teamNo} className="border-b border-gray-800 bg-gray-900/30 hover:bg-gray-900">
                            <td className="px-6 py-4 font-bold">
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}위`}
                            </td>
                            <td className="px-6 py-4 text-white font-medium">{group.teamNo}조</td>
                            <td className="px-6 py-4 text-gray-400">{group.members.length}명</td>
                            <td className="px-6 py-4 text-right text-white font-bold">{scores[group.teamNo]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(selectedComp?.type === "개인전"
                ? sortedParticipants.filter((p) => scores[p.team]).length === 0
                : sortedTeams?.filter((g) => scores[g.teamNo]).length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  <p>점수가 입력된 참가자가 없습니다.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-800 py-12 px-8 mt-16 bg-gray-950">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2026 로봇 대회 점수 관리. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
