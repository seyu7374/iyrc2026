"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur z-50">
        <nav className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">🏆 대회 점수</div>
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition">
              기능
            </Link>
            <Link href="#benefits" className="text-sm text-gray-400 hover:text-white transition">
              이점
            </Link>
            <Link
              href="/app"
              className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition"
            >
              시작하기
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* 히어로 섹션 */}
        <section className="py-40 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8 inline-block">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                🏆 로봇 대회 점수 관리
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              심사 점수를 자동으로
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                집계하고 순위까지 정리
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              IYRC 등 로봇 대회에서 각 종목별 심사위원이 입력한 점수를 자동으로 수집·집계·순위 산출합니다. 엑셀 작업은 이제 끝내세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/app"
                className="bg-white text-black px-8 py-4 rounded font-semibold hover:bg-gray-100 transition text-lg"
              >
                무료로 시작하기
              </Link>
              <button className="border border-gray-600 text-white px-8 py-4 rounded font-semibold hover:border-gray-400 hover:bg-gray-900/50 transition text-lg">
                데모 보기
              </button>
            </div>
          </div>
        </section>

        {/* 문제 제시 섹션 */}
        <section className="py-32 px-8 bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                지금 이런 일을 하고 계신가요?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* 문제 1 */}
              <div className="bg-gray-900/50 border border-gray-800 p-8 rounded text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="font-semibold mb-3">수작업</h3>
                <p className="text-sm text-gray-400">
                  심사위원이 제출한 점수를 엑셀에 일일이 입력
                </p>
              </div>

              {/* 문제 2 */}
              <div className="bg-gray-900/50 border border-gray-800 p-8 rounded text-center">
                <div className="text-4xl mb-4">🔢</div>
                <h3 className="font-semibold mb-3">수동 집계</h3>
                <p className="text-sm text-gray-400">
                  종목별, 팀별로 점수를 직접 합산
                </p>
              </div>

              {/* 문제 3 */}
              <div className="bg-gray-900/50 border border-gray-800 p-8 rounded text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="font-semibold mb-3">오류 가능성</h3>
                <p className="text-sm text-gray-400">
                  계산 실수, 중복 입력으로 재검산 필요
                </p>
              </div>

              {/* 문제 4 */}
              <div className="bg-gray-900/50 border border-gray-800 p-8 rounded text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-semibold mb-3">시간 낭비</h3>
                <p className="text-sm text-gray-400">
                  모든 과정이 오래 걸려 결과 발표 지연
                </p>
              </div>

              {/* 문제 5 */}
              <div className="bg-gray-900/50 border border-gray-800 p-8 rounded text-center">
                <div className="text-4xl mb-4">😰</div>
                <h3 className="font-semibold mb-3">신뢰 문제</h3>
                <p className="text-sm text-gray-400">
                  수동 작업으로 인한 공정성 논란
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 솔루션 섹션 */}
        <section className="py-32 px-8 bg-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              자동으로 정리되는 프로세스
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 py-12">
              {/* 단계 1 */}
              <div className="flex-1">
                <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">심사위원 입력</h3>
                <p className="text-gray-400 text-sm">
                  온라인에서 점수 입력
                </p>
              </div>

              <div className="text-3xl text-gray-600 hidden md:block">→</div>

              {/* 단계 2 */}
              <div className="flex-1">
                <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">자동 집계</h3>
                <p className="text-gray-400 text-sm">
                  클라우드에서 실시간 수집
                </p>
              </div>

              <div className="text-3xl text-gray-600 hidden md:block">→</div>

              {/* 단계 3 */}
              <div className="flex-1">
                <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">순위 산출</h3>
                <p className="text-gray-400 text-sm">
                  자동으로 순위 결정
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded">
                <div className="text-2xl mb-3">✓</div>
                <h3 className="font-semibold mb-2">오류 제거</h3>
                <p className="text-sm text-gray-400">
                  계산 실수 제거, 자동 검증
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">시간 단축</h3>
                <p className="text-sm text-gray-400">
                  몇 시간이 몇 초로
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded">
                <div className="text-2xl mb-3">🔍</div>
                <h3 className="font-semibold mb-2">공정성 보장</h3>
                <p className="text-sm text-gray-400">
                  모든 과정이 기록, 투명함
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 기능 섹션 */}
        <section id="features" className="py-32 px-8 bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                3가지 핵심 기능
              </h2>
              <p className="text-lg text-gray-400">
                대회 운영을 자동화하는 필수 기능들
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 기능 1 */}
              <div className="bg-gray-900/50 border border-gray-800 p-10 rounded hover:border-gray-700 transition group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">📥</div>
                <h3 className="text-2xl font-bold mb-4">자동 집계</h3>
                <p className="text-gray-400 leading-relaxed">
                  각 종목별 심사위원이 입력한 점수를 자동으로 수집하고 합산합니다.
                </p>
              </div>

              {/* 기능 2 */}
              <div className="bg-gray-900/50 border border-gray-800 p-10 rounded hover:border-gray-700 transition group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">🏅</div>
                <h3 className="text-2xl font-bold mb-4">순위 산출</h3>
                <p className="text-gray-400 leading-relaxed">
                  집계된 점수를 기반으로 실시간으로 순위를 자동 산출합니다.
                </p>
              </div>

              {/* 기능 3 */}
              <div className="bg-gray-900/50 border border-gray-800 p-10 rounded hover:border-gray-700 transition group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">⚡</div>
                <h3 className="text-2xl font-bold mb-4">실시간 반영</h3>
                <p className="text-gray-400 leading-relaxed">
                  점수 입력 시 즉시 최종 순위에 반영됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 운영진의 이점 섹션 */}
        <section id="benefits" className="py-32 px-8 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* 왼쪽: 텍스트 */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  운영진이 얻는 이점
                </h2>

                <ul className="space-y-8">
                  <li className="flex items-start gap-4">
                    <span className="text-3xl mt-1">⏱️</span>
                    <div>
                      <h4 className="font-bold text-lg mb-2">작업 시간 90% 단축</h4>
                      <p className="text-gray-400">
                        점수 집계 작업을 몇 시간에서 몇 초로 단축합니다.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <span className="text-3xl mt-1">🎯</span>
                    <div>
                      <h4 className="font-bold text-lg mb-2">오류 완전 차단</h4>
                      <p className="text-gray-400">
                        자동 검증으로 계산 실수를 완전히 제거합니다.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <span className="text-3xl mt-1">📊</span>
                    <div>
                      <h4 className="font-bold text-lg mb-2">실시간 결과</h4>
                      <p className="text-gray-400">
                        심사가 진행되는 동안 순위를 즉시 확인할 수 있습니다.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <span className="text-3xl mt-1">🔍</span>
                    <div>
                      <h4 className="font-bold text-lg mb-2">투명성 보장</h4>
                      <p className="text-gray-400">
                        심사 과정이 모두 기록되어 공정성을 입증할 수 있습니다.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 오른쪽: 플레이스홀더 */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-12 border border-gray-800 h-auto min-h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-gray-400">
                    대회 점수 관리 시스템<br/>
                    <span className="text-sm">클라우드 기반으로 어디서든 접근</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-32 px-8 bg-gray-950">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              이번 대회부터 시작하세요
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-6">
              별도 설치 없이 가입 후 즉시 사용할 수 있습니다
            </p>
            <p className="text-gray-500 mb-12">
              첫 대회는 무료입니다
            </p>
            <Link
              href="/app"
              className="inline-block bg-white text-black px-10 py-4 rounded font-semibold hover:bg-gray-100 transition text-lg"
            >
              무료로 시작하기 →
            </Link>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="border-t border-gray-800 py-16 px-8 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
              <div>
                <h4 className="font-semibold mb-4 text-sm">제품</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">소개</a></li>
                  <li><a href="#" className="hover:text-white transition">기능</a></li>
                  <li><a href="#" className="hover:text-white transition">가격</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm">지원</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">도움말</a></li>
                  <li><a href="#" className="hover:text-white transition">문의</a></li>
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm">회사</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">블로그</a></li>
                  <li><a href="#" className="hover:text-white transition">채용</a></li>
                  <li><a href="#" className="hover:text-white transition">뉴스</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm">법률</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">개인정보</a></li>
                  <li><a href="#" className="hover:text-white transition">이용약관</a></li>
                  <li><a href="#" className="hover:text-white transition">쿠키</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
              <p>© 2026 로봇 대회 점수 관리. 모든 권리 보유.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
