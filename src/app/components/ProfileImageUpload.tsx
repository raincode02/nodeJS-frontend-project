"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, User, Upload, X } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import ImageCropModal from "./ImageCropModal";
import axios from "@/infrastructure/axios";
import { showToast } from "@/lib/toast";
import { getErrorStatus } from "@/lib/errorHandler";
import Image from "next/image";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  onUploadComplete: (imageUrl: string) => void;
  onDelete?: () => void;
}

export default function ProfileImageUpload({
  currentImage,
  onUploadComplete,
  onDelete,
}: ProfileImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(
    currentImage || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropModal = useModal();

  useEffect(() => {
    setDisplayImage(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        showToast.error("이미지 파일만 업로드 가능합니다.");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error("파일 크기는 5MB 이하여야 합니다.");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        cropModal.openModal();
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage: Blob) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("images", croppedImage, "profile.jpg");

      const res = await axios.post("/api/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = res.data.urls[0];
      setDisplayImage(imageUrl);
      onUploadComplete(imageUrl);
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
      } else {
        showToast.error("이미지 업로드에 실패했습니다.");
      }
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageSrc(null);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    fileInputRef.current?.click();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setDisplayImage(null);

    if (onDelete) {
      await onDelete();
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModalClose = () => {
    cropModal.closeModal();
    setImageSrc(null);
    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="relative inline-block">
        {/* 프로필 이미지 */}
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer group"
          onClick={handleClick}
        >
          {displayImage ? (
            <Image
              src={displayImage}
              alt="Profile"
              fill
              className="object-cover"
              sizes="128px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
          )}

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <Camera size={32} className="text-white" />
            )}
          </div>
        </div>

        {/* 카메라 버튼 */}
        <button
          onClick={handleClick}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          title="프로필 이미지 변경"
        >
          <Upload size={16} />
        </button>

        {/* 삭제 버튼 - displayImage가 있을 때만 표시 */}
        {displayImage && onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-0 right-0 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
            title="프로필 이미지 삭제"
          >
            <X size={16} />
          </button>
        )}

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 크롭 모달 */}
      {imageSrc && (
        <ImageCropModal
          isOpen={cropModal.isOpen}
          onClose={handleModalClose}
          imageSrc={imageSrc}
          onComplete={handleCropComplete}
        />
      )}
    </>
  );
}
