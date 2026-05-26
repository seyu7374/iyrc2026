"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  type: "개인전" | "2vs2" | "3vs3" | "팀전(3-5인)";
  participants: Participant[];
};

export default function CompetitionDetailPage() {
  const params = useParams();
  const compId = params.id as string;

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isScoringMode, setIsScoringMode] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [uploadMessage, setUploadMessage] = useState<string>("");

  // localStorage에서 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem("iyrc-competitions");
    if (saved) {
      try {
        const comps = JSON.parse(saved);
        setCompetitions(comps);
        const comp = comps.find((c: Competition) => c.id === compId);
        if (comp) {
          setSelectedComp(comp);
        }
      } catch {
        console.error("데이터 로드 실패");
      }
    }
  }, [compId]);

  if (!selectedComp) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">종목을 찾을 수 없습니다.</p>
          <Link href="/app" className="text-blue-400 hover:text-blue-300">
            종목 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const filteredParticipants = selectedComp.participants.filter(
    (p) =>
      p.nameKor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameEng.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.school.includes(searchTerm)
  );

  const groupedByTeam =
    selectedComp.type !== "개인전"
      ? Array.from(
          { length: Math.max(...filteredParticipants.map((p) => p.team)) },
          (_, i) => {
            const teamMembers = filteredParticipants.filter((p) => p.team === i + 1);
            return { teamNo: i + 1, members: teamMembers };
          }
        ).filter((g) => g.members.length > 0)
      : null;

  const sortedParticipants =
    isScoringMode && selectedComp.type === "개인전"
      ? [...filteredParticipants].sort((a, b) => {
          const scoreA = scores[a.team] ?? 0;
          const scoreB = scores[b.team] ?? 0;
          return scoreB - scoreA;
        })
      : filteredParticipants;

  const sortedTeams =
    isScoringMode && selectedComp.type !== "개인전" && groupedByTeam
      ? [...groupedByTeam].sort((a, b) => {
          const scoreA = scores[a.teamNo] ?? 0;
          const scoreB = scores[b.teamNo] ?? 0;
          return scoreB - scoreA;
        })
      : groupedByTeam;

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

  // 동점 처리: 같은 점수면 같은 순위 반환
  const getRank = (score: number, allScores: number[]) => {
    const uniqueScores = [...new Set(allScores)].sort((a, b) => b - a);
    return uniqueScores.indexOf(score) + 1;
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

        const wsData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!wsData || wsData.length < 2) {
          setUploadMessage("❌ 엑셀 파일이 비어있습니다.");
          setTimeout(() => setUploadMessage(""), 3000);
          return;
        }

        const dataRows = wsData.slice(1);

        // Game No. 기반 팀 매핑 (고유한 Game No. = 고유한 팀)
        const gameNoTeamMap: Record<string, number> = {};
        let nextTeamNo = 1;

        const newParticipants: Participant[] = dataRows
          .filter((row: any) => row && row.length > 0)
          .map((row: any, idx: number) => {
            const no = parseInt(row[0]) || idx + 1;
            const country = String(row[1] || "korea");
            const nameEng = String(row[2] || "");
            const dateOfBirth = String(row[3] || "");
            const genderRaw = String(row[4] || "M");
            const school = String(row[5] || "");
            const gameNo = String(row[6] || "").trim(); // 정확한 Game No. 값

            // 같은 Game No.는 같은 팀으로 자동 할당
            if (!gameNoTeamMap[gameNo]) {
              gameNoTeamMap[gameNo] = nextTeamNo++;
            }
            const teamNo = gameNoTeamMap[gameNo];

            return {
              no,
              country,
              nameKor: "",
              nameEng,
              dateOfBirth,
              gender: genderRaw.toUpperCase().includes("F") ? "F" : "M",
              school,
              team: teamNo,
            };
          });

        const updatedComps = competitions.map((comp) =>
          comp.id === compId
            ? { ...comp, participants: newParticipants }
            : comp
        );
        setCompetitions(updatedComps);
        setSelectedComp(updatedComps.find((c) => c.id === compId) || null);
        localStorage.setItem("iyrc-competitions", JSON.stringify(updatedComps));

        setUploadMessage(`✅ ${newParticipants.length}명이 입력되었습니다.`);
        setScores({});
        setTimeout(() => setUploadMessage(""), 3000);
      } catch (error) {
        console.error("Excel upload error:", error);
        setUploadMessage("❌ 파일을 읽을 수 없습니다. 형식을 확인해주세요.");
        setTimeout(() => setUploadMessage(""), 3000);
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };

  const validateScoresWithAI = async () => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setUploadMessage("❌ AI API 키가 설정되지 않았습니다.");
      setTimeout(() => setUploadMessage(""), 3000);
      return;
    }

    const scoredParticipants = filteredParticipants.filter((p) => scores[p.team]);
    if (scoredParticipants.length === 0) {
      setUploadMessage("❌ 점수가 입력된 참가자가 없습니다.");
      setTimeout(() => setUploadMessage(""), 3000);
      return;
    }

    const allScores = scoredParticipants.map((p) => scores[p.team]);
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const stdDev = Math.sqrt(
      allScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) /
        allScores.length
    );

    const anomalies = scoredParticipants.filter((p) => {
      const score = scores[p.team];
      return Math.abs(score - avgScore) > stdDev * 2;
    });

    if (anomalies.length === 0) {
      setUploadMessage("✅ 모든 점수가 정상입니다.");
    } else {
      setUploadMessage(
        `⚠️ ${anomalies.length}명의 이상값 감지: ${anomalies.map((p) => p.nameEng).join(", ")}`
      );
    }
    setTimeout(() => setUploadMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-black/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/app" className="text-lg font-semibold text-white hover:text-gray-300 transition">
            ← 뒤로가기
          </Link>

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
            <h1 className="text-4xl font-bold mb-2">{selectedComp.nameEng}</h1>
            <p className="text-gray-400">
              {selectedComp.ageGroup} • {selectedComp.type} • {isScoringMode ? "점수 입력 중" : "참가자 현황"}
            </p>
          </div>
        </section>


        {/* 엑셀 업로드 (Phase 2) */}
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
                형식: No. | Country | Passport name | DOB | Gender | School | Game No.(팀 구분)
              </span>
            </div>
          </div>
        </section>

        {/* 검색 및 AI 검증 */}
        <section className="py-6 px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex gap-3">
            <input
              type="text"
              placeholder="이름, 영문이름, 학교로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
            />
            {isScoringMode && (
              <button
                onClick={validateScoresWithAI}
                className="px-4 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
              >
                🤖 AI 검증
              </button>
            )}
          </div>
          {uploadMessage && (
            <div className={`mt-3 text-sm max-w-7xl mx-auto ${uploadMessage.includes("✅") || uploadMessage.includes("⚠️") ? (uploadMessage.includes("✅") ? "text-green-400" : "text-yellow-400") : "text-red-400"}`}>
              {uploadMessage}
            </div>
          )}
        </section>

        {/* 참가자 리스트 테이블 */}
        <section className="py-8 px-8">
          <div className="max-w-7xl mx-auto">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  {searchTerm ? "검색 결과가 없습니다." : "참가자 정보가 없습니다."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {selectedComp.type === "개인전" ? (
                  // 개인전 테이블
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        {isScoringMode && (
                          <th className="px-6 py-4 text-center font-semibold text-gray-300 w-12">
                            순위
                          </th>
                        )}
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">No.</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">이름</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">
                          생년월일
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">성별</th>
                        {isScoringMode && (
                          <th className="px-6 py-4 text-center font-semibold text-gray-300">점수</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedParticipants.map((p, idx) => {
                        const scoredParticipants = sortedParticipants.filter(
                          (x) => scores[x.team]
                        );
                        const allScores = scoredParticipants.map((x) => scores[x.team]);
                        const rank = scores[p.team]
                          ? getRank(scores[p.team], allScores)
                          : null;

                        return (
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
                                {rank
                                  ? rank === 1
                                    ? "🥇"
                                    : rank === 2
                                    ? "🥈"
                                    : rank === 3
                                    ? "🥉"
                                    : `${rank}위`
                                  : "-"}
                              </td>
                            )}
                            <td className="px-6 py-4 text-white font-medium">
                              {p.no}
                            </td>
                            <td className="px-6 py-4 text-white">
                              {p.nameEng}
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {p.dateOfBirth}
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {p.gender === "M" ? "남" : "여"}
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
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  // 팀전 테이블
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">조</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">인원</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-300">팀원</th>
                        {isScoringMode && (
                          <th className="px-6 py-4 text-center font-semibold text-gray-300">
                            점수
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByTeam?.map((group) => (
                        <tr
                          key={group.teamNo}
                          className="border-b border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-colors"
                        >
                          <td className="px-6 py-4 text-white font-medium">
                            {group.teamNo}조
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {group.members.length}명
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {group.members
                              .map((m) => m.nameEng)
                              .join(", ")}
                          </td>
                          {isScoringMode && (
                            <td className="px-6 py-4 text-center">
                              <input
                                type="number"
                                placeholder="점수"
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
              </div>
            )}
          </div>
        </section>

        {/* 최종 순위 */}
        {isScoringMode && (
          <section className="py-8 px-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl font-bold mb-6">최종 순위</h2>
              {selectedComp.type === "개인전" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">순위</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-300">이름</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-300">점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const scored = sortedParticipants.filter((p) => scores[p.team]);
                        const allScores = scored.map((x) => scores[x.team]);
                        return scored.map((p) => {
                          const rank = getRank(scores[p.team], allScores);
                          return (
                            <tr
                              key={p.no}
                              className="border-b border-gray-800 bg-gray-900/30 hover:bg-gray-900"
                            >
                              <td className="px-6 py-4 font-bold">
                                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}위`}
                              </td>
                            <td className="px-6 py-4 text-white font-medium">
                              {p.nameEng}
                            </td>
                            <td className="px-6 py-4 text-right text-white font-bold">
                              {scores[p.team]}
                            </td>
                          </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              ) : (
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
                      {(() => {
                        const scored = sortedTeams?.filter((g) => scores[g.teamNo]) || [];
                        const allScores = scored.map((x) => scores[x.teamNo]);
                        return scored.map((group) => {
                          const rank = getRank(scores[group.teamNo], allScores);
                          return (
                            <tr
                              key={group.teamNo}
                              className="border-b border-gray-800 bg-gray-900/30 hover:bg-gray-900"
                            >
                              <td className="px-6 py-4 font-bold">
                                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}위`}
                              </td>
                            <td className="px-6 py-4 text-white font-medium">
                              {group.teamNo}조
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {group.members.length}명
                            </td>
                            <td className="px-6 py-4 text-right text-white font-bold">
                              {scores[group.teamNo]}
                            </td>
                          </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}

              {(selectedComp.type === "개인전"
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
