"use client";

import Modal from "./Modal";
import { AlertTriangle, Trash2, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  type = "danger",
  loading = false,
}: ConfirmModalProps) {
  const icons = {
    danger: <Trash2 size={48} className="text-red-500" />,
    warning: <AlertTriangle size={48} className="text-yellow-500" />,
    info: <Info size={48} className="text-blue-500" />,
  };

  const buttonColors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">{icons[type]}</div>

        {/* 제목 */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* 메시지 */}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={loading}
            className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors disabled:opacity-50 ${buttonColors[type]}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>처리 중...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
