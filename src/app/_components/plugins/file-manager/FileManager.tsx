"use client";
import React, { useState } from "react";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

const initialFiles: FileItem[] = [
  {
    name: "images",
    type: "folder",
    children: [{ name: "/background-okhub.jpg", type: "file" }],
  },
  { name: "/mbbank/Logo_MB_new.png", type: "file" },
];

interface FileManagerProps {
  onFileSelect?: (file: FileItem) => void;
}

export default function FileManager({ onFileSelect }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);

  // Thêm các hàm xử lý thêm/xóa/đổi tên file, folder ở đây

  return (
    <div>
      <h3>File Manager</h3>
      <ul>
        {files.map((item, idx) => (
          <li key={idx}>
            {item.type === "folder" ? "📁" : "📄"} {item.name}
            {item.type === "file" && onFileSelect && (
              <button
                style={{ marginLeft: 8 }}
                onClick={() => onFileSelect(item)}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Chọn
              </button>
            )}
            {/* Nếu là folder, hiển thị children */}
            {item.type === "folder" && item.children && (
              <ul>
                {item.children.map((child, cidx) => (
                  <li key={cidx}>
                    {child.type === "folder" ? "📁" : "📄"} {child.name}
                    {child.type === "file" && onFileSelect && (
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => onFileSelect(child)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Chọn
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
