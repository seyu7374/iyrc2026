import { Participant } from "../page";

interface ParticipantTableProps {
  participants: Participant[];
  eventName: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
}

export default function ParticipantTable({
  participants,
  eventName,
  onEdit,
  onDelete,
  editingId,
}: ParticipantTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {eventName} 참가자 목록
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          총 {participants.length}명
        </p>
      </div>

      {participants.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
          <p>아직 등록된 참가자가 없습니다.</p>
          <p className="text-sm mt-2">우측 폼에서 참가자를 추가해주세요.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700 text-left text-sm font-semibold text-slate-900 dark:text-white">
              <tr>
                <th className="px-6 py-3">이름</th>
                <th className="px-6 py-3">팀</th>
                <th className="px-6 py-3">연락처</th>
                <th className="px-6 py-3">등록일</th>
                <th className="px-6 py-3 text-center">작업</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`border-t border-slate-200 dark:border-slate-700 ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-slate-800"
                      : "bg-slate-50 dark:bg-slate-700/50"
                  } ${editingId === p.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <td className="px-6 py-4 text-slate-900 dark:text-white">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {p.team}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {p.contact}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-sm">
                    {p.registeredAt}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(p.id)}
                      className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium mr-3"
                    >
                      편집
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`${p.name}을(를) 삭제하시겠습니까?`)) {
                          onDelete(p.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 dark:hover:text-red-400 font-medium"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
