"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Competition = {
  id: string;
  nameKor: string;
  nameEng: string;
  ageGroup: string;
  type: "개인전" | "2vs2" | "3vs3" | "팀전(3-5인)";
  participants: any[];
};

export default function AppPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showAddCompModal, setShowAddCompModal] = useState<boolean>(false);
  const [newCompForm, setNewCompForm] = useState({
    nameKor: "",
    nameEng: "",
    ageGroup: "초등부(8-13)",
    type: "개인전" as "개인전" | "2vs2" | "3vs3" | "팀전(3-5인)",
  });
  const [uploadMessage, setUploadMessage] = useState("");

  // localStorage 로드/저장
  useEffect(() => {
    const saved = localStorage.getItem("iyrc-competitions");
    if (saved) {
      try {
        setCompetitions(JSON.parse(saved));
      } catch {
        console.error("localStorage 데이터 로드 실패");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("iyrc-competitions", JSON.stringify(competitions));
  }, [competitions]);

  const handleAddCompetition = () => {
    if (!newCompForm.nameKor.trim() || !newCompForm.nameEng.trim()) {
      setUploadMessage("❌ 한글명과 영문명을 입력하세요.");
      setTimeout(() => setUploadMessage(""), 3000);
      return;
    }

    const newComp: Competition = {
      id: `custom-${Date.now()}`,
      nameKor: newCompForm.nameKor,
      nameEng: newCompForm.nameEng,
      ageGroup: newCompForm.ageGroup,
      type: newCompForm.type,
      participants: [],
    };

    const updated = [...competitions, newComp];
    setCompetitions(updated);
    setShowAddCompModal(false);
    setNewCompForm({
      nameKor: "",
      nameEng: "",
      ageGroup: "초등부(8-13)",
      type: "개인전",
    });
    setUploadMessage("✅ 종목이 추가되었습니다.");
    setTimeout(() => setUploadMessage(""), 3000);
  };

  const handleDeleteCompetition = (id: string) => {
    if (window.confirm("이 종목을 삭제하시겠습니까?")) {
      setCompetitions(competitions.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-black/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white hover:text-gray-300 transition">
            ← 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">종목 관리</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main>
        {/* 페이지 제목 */}
        <section className="py-8 px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-2">대회 종목</h2>
            <p className="text-gray-400">
              2025 IYRC Korea - 종목을 선택하여 참가자를 관리하세요.
            </p>
          </div>
        </section>

        {/* 종목 추가 */}
        <section className="py-6 px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setShowAddCompModal(true)}
              className="px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              + 종목 추가
            </button>
            {uploadMessage && (
              <div className={`text-sm ${uploadMessage.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                {uploadMessage}
              </div>
            )}
          </div>
        </section>

        {/* 종목 목록 */}
        <section className="py-8 px-8">
          <div className="max-w-7xl mx-auto">
            {competitions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">아직 종목이 없습니다.</p>
                <button
                  onClick={() => setShowAddCompModal(true)}
                  className="px-6 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  새로운 종목 추가
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {competitions.map((comp) => (
                  <div
                    key={comp.id}
                    className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {comp.nameEng}
                        </h3>
                        <div className="flex gap-3 text-sm text-gray-400">
                          <span>{comp.ageGroup}</span>
                          <span>•</span>
                          <span>{comp.type}</span>
                          <span>•</span>
                          <span>{comp.participants.length}명</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/app/${comp.id}`}
                          className="px-4 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          관리
                        </Link>
                        <button
                          onClick={() => handleDeleteCompetition(comp.id)}
                          className="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 종목 추가 모달 */}
      {showAddCompModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-6">종목 추가</h3>

            <div className="space-y-4">
              {/* 한글명 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  종목명 (한글) *
                </label>
                <input
                  type="text"
                  placeholder="예: 로봇 축구"
                  value={newCompForm.nameKor}
                  onChange={(e) =>
                    setNewCompForm({ ...newCompForm, nameKor: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* 영문명 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  종목명 (영문) *
                </label>
                <input
                  type="text"
                  placeholder="예: Robot Soccer"
                  value={newCompForm.nameEng}
                  onChange={(e) =>
                    setNewCompForm({ ...newCompForm, nameEng: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* 나이그룹 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  나이 그룹
                </label>
                <select
                  value={newCompForm.ageGroup}
                  onChange={(e) =>
                    setNewCompForm({ ...newCompForm, ageGroup: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="유치부(~8세)">유치부(~8세)</option>
                  <option value="초등부(8-13)">초등부(8-13)</option>
                  <option value="중.고등(13-18)">중.고등(13-18)</option>
                </select>
              </div>

              {/* 대회 타입 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  대회 타입
                </label>
                <select
                  value={newCompForm.type}
                  onChange={(e) =>
                    setNewCompForm({
                      ...newCompForm,
                      type: e.target.value as "개인전" | "2vs2" | "3vs3" | "팀전(3-5인)",
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="개인전">개인전</option>
                  <option value="2vs2">2vs2</option>
                  <option value="3vs3">3vs3</option>
                  <option value="팀전(3-5인)">팀전(3-5인)</option>
                </select>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddCompetition}
                className="flex-1 px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setShowAddCompModal(false);
                  setNewCompForm({
                    nameKor: "",
                    nameEng: "",
                    ageGroup: "초등부(8-13)",
                    type: "개인전",
                  });
                }}
                className="flex-1 px-4 py-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="border-t border-gray-800 py-12 px-8 mt-16 bg-gray-950">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2026 로봇 대회 점수 관리. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
