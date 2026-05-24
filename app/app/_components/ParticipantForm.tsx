"use client";

import { useState, useEffect } from "react";
import { Participant } from "../page";

interface ParticipantFormProps {
  eventId: string;
  onSubmit: (data: Omit<Participant, "id" | "registeredAt">) => void;
  onCancel: () => void;
  editingParticipant?: Participant;
  isEditing: boolean;
}

interface FormData {
  name: string;
  team: string;
  contact: string;
}

interface Errors {
  name?: string;
  team?: string;
  contact?: string;
}

export default function ParticipantForm({
  eventId,
  onSubmit,
  onCancel,
  editingParticipant,
  isEditing,
}: ParticipantFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    team: "",
    contact: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (editingParticipant) {
      setFormData({
        name: editingParticipant.name,
        team: editingParticipant.team,
        contact: editingParticipant.contact,
      });
      setErrors({});
    } else {
      setFormData({ name: "", team: "", contact: "" });
      setErrors({});
    }
  }, [editingParticipant]);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름은 필수입니다.";
    }
    if (!formData.team.trim()) {
      newErrors.team = "팀은 필수입니다.";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "연락처는 필수입니다.";
    } else if (!/^010-?\d{4}-?\d{4}$|^\d{2,3}-\d{3,4}-\d{4}$/.test(formData.contact)) {
      newErrors.contact = "유효한 연락처 형식이 아닙니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      eventId,
      name: formData.name.trim(),
      team: formData.team.trim(),
      contact: formData.contact.trim(),
    });

    setFormData({ name: "", team: "", contact: "" });
  };

  const handleCancel = () => {
    setFormData({ name: "", team: "", contact: "" });
    setErrors({});
    onCancel();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        {isEditing ? "참가자 수정" : "참가자 등록"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            이름
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="참가자 이름"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors ${
              errors.name
                ? "border-red-500 dark:border-red-500"
                : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500"
            } focus:outline-none`}
          />
          {errors.name && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            팀
          </label>
          <input
            type="text"
            value={formData.team}
            onChange={(e) =>
              setFormData({ ...formData, team: e.target.value })
            }
            placeholder="팀 이름"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors ${
              errors.team
                ? "border-red-500 dark:border-red-500"
                : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500"
            } focus:outline-none`}
          />
          {errors.team && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.team}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            연락처
          </label>
          <input
            type="tel"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            placeholder="010-1234-5678"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors ${
              errors.contact
                ? "border-red-500 dark:border-red-500"
                : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500"
            } focus:outline-none`}
          />
          {errors.contact && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.contact}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {isEditing ? "수정" : "등록"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-white font-semibold py-2 rounded-lg transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
