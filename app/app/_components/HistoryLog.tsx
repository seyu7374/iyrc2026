import { HistoryEntry } from "../page";

interface HistoryLogProps {
  entries: HistoryEntry[];
}

export default function HistoryLog({ entries }: HistoryLogProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "등록":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "수정":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "삭제":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          변경 이력
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          최근 변경 사항을 기록합니다 (최대 10건)
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
          <p>아직 변경 이력이 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getActionColor(
                    entry.action
                  )}`}
                >
                  {entry.action}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white font-medium break-words">
                    {entry.participantName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1 flex-wrap">
                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">
                      {entry.eventName}
                    </span>
                    <span className="text-xs">{entry.at}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
