"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X } from "lucide-react";
import axios from "@/infrastructure/axios";
import { showToast } from "@/lib/toast";
import { getErrorStatus } from "@/lib/errorHandler";
import Image from "next/image";

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export default function ImageUpload({
  onUploadComplete,
  maxImages = 5,
  existingImages = [],
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드
  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // 파일 개수 체크
    if (images.length + fileArray.length > maxImages) {
      showToast.error(`최대 ${maxImages}개까지 업로드 가능합니다.`);
      return;
    }

    // 파일 형식 체크
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = fileArray.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      showToast.error("JPG, PNG, WEBP 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 체크 (5MB)
    const oversizedFiles = fileArray.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      showToast.error("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post("/api/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newImages = [...images, ...res.data.urls];
      setImages(newImages);
      onUploadComplete(newImages);

      showToast.success(`${fileArray.length}개 이미지 업로드 완료!`);
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
      } else {
        showToast.error("이미지 업로드에 실패했습니다.");
      }
    } finally {
      setUploading(false);
    }
  };

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  // 드래그 앤 드롭
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, maxImages]
  );

  // 이미지 삭제
  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUploadComplete(newImages);
  };

  // 파일 선택 다이얼로그 열기
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload size={32} className="text-blue-600" />
            )}
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {uploading ? "업로드 중..." : "클릭하거나 파일을 드래그하세요"}
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WEBP (최대 5MB, {maxImages}개)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              현재 {images.length}/{maxImages}개
            </p>
          </div>
        </div>
      </div>

      {/* 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <Image
                src={image}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                onError={() => {
                  console.error("미리보기 이미지 로드 실패:", {
                    url: image,
                    origin: window.location.origin,
                    apiUrl: process.env.NEXT_PUBLIC_API_URL,
                  });
                }}
                sizes="200px"
              />

              {/* 삭제 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={16} />
              </button>

              {/* 순서 표시 */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
