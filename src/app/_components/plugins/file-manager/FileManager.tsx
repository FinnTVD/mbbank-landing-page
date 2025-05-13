/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef, useEffect } from "react";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  parentId?: string;
}

const initialFiles: FileItem[] = [
  {
    id: "folder-1",
    name: "images",
    type: "folder",
    children: [
      {
        id: "file-1",
        name: "/background-okhub.jpg",
        type: "file",
        parentId: "folder-1",
      },
    ],
  },
  {
    id: "file-2",
    name: "/mbbank/Logo_MB_new.png",
    type: "file",
  },
];

interface FileManagerProps {
  onFileSelect?: (file: FileItem) => void;
}

export default function FileManager({ onFileSelect }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
    "folder-1": true, // Mặc định mở folder images
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [showNewItemForm, setShowNewItemForm] = useState<{
    parentId?: string;
    type: "file" | "folder";
  } | null>(null);
  const [newItemType, setNewItemType] = useState<"file" | "folder">("file");
  const [draggedItem, setDraggedItem] = useState<FileItem | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus vào input khi bắt đầu edit
  useEffect(() => {
    if (editingItem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingItem]);

  // Tạo ID ngẫu nhiên cho item mới
  const generateId = (type: "file" | "folder") => {
    return `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Mở/đóng folder
  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Bắt đầu chỉnh sửa tên item
  const startEditing = (itemId: string, name: string) => {
    setEditingItem(itemId);
    setNewItemName(name);
  };

  // Lưu tên mới sau khi chỉnh sửa
  const saveItemName = () => {
    if (!editingItem || !newItemName.trim()) {
      setEditingItem(null);
      return;
    }

    const updateItemName = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === editingItem) {
          return { ...item, name: newItemName.trim() };
        }
        if (item.children) {
          return {
            ...item,
            children: updateItemName(item.children),
          };
        }
        return item;
      });
    };

    setFiles(updateItemName(files));
    setEditingItem(null);
  };

  // Xử lý khi nhấn Enter hoặc Escape trong input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveItemName();
    } else if (e.key === "Escape") {
      setEditingItem(null);
    }
  };

  // Hiển thị form tạo item mới
  const showAddItemForm = (
    parentId?: string,
    type: "file" | "folder" = "file"
  ) => {
    setShowNewItemForm({ parentId, type });
    setNewItemType(type);
    setNewItemName("");
  };

  // Thêm item mới (file hoặc folder)
  const addNewItem = () => {
    if (!newItemName.trim() || !showNewItemForm) {
      setShowNewItemForm(null);
      return;
    }

    const newItem: FileItem = {
      id: generateId(newItemType),
      name: newItemName.trim(),
      type: newItemType,
      parentId: showNewItemForm.parentId,
      ...(newItemType === "folder" ? { children: [] } : {}),
    };

    // Nếu không có parentId, thêm vào cấp cao nhất
    if (!showNewItemForm.parentId) {
      setFiles([...files, newItem]);
      setShowNewItemForm(null);
      return;
    }

    // Thêm vào folder cha
    const addToParent = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === showNewItemForm.parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: addToParent(item.children),
          };
        }
        return item;
      });
    };

    setFiles(addToParent(files));
    // Mở folder cha khi thêm item mới
    if (showNewItemForm.parentId) {
      setExpandedFolders((prev) => ({
        ...prev,
        [showNewItemForm.parentId!]: true,
      }));
    }
    setShowNewItemForm(null);
  };

  // Xóa item
  const deleteItem = (itemId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục này?")) {
      return;
    }

    const removeItem = (items: FileItem[]): FileItem[] => {
      return items.filter((item) => {
        if (item.id === itemId) {
          return false;
        }
        if (item.children) {
          item.children = removeItem(item.children);
        }
        return true;
      });
    };

    setFiles(removeItem(files));
  };

  // Bắt đầu kéo item
  const handleDragStart = (item: FileItem) => {
    setDraggedItem(item);
  };

  // Xử lý khi kéo qua một folder
  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (
      draggedItem &&
      draggedItem.id !== folderId &&
      draggedItem.parentId !== folderId
    ) {
      setDropTarget(folderId);
    }
  };

  // Xử lý khi kéo ra khỏi một folder
  const handleDragLeave = () => {
    setDropTarget(null);
  };

  // Xử lý khi thả item vào một folder
  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Không cho phép kéo folder vào chính nó hoặc vào con của nó
    if (draggedItem.id === targetFolderId) {
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    // Kiểm tra xem target có phải là con của dragged item không (nếu dragged item là folder)
    const isChildOf = (childId: string, parentId: string): boolean => {
      const findItem = (items: FileItem[], id: string): FileItem | null => {
        for (const item of items) {
          if (item.id === id) return item;
          if (item.children) {
            const found = findItem(item.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const parent = findItem(files, parentId);
      if (!parent || !parent.children) return false;

      for (const child of parent.children) {
        if (child.id === childId) return true;
        if (child.type === "folder" && child.children) {
          if (isChildOf(childId, child.id)) return true;
        }
      }
      return false;
    };

    if (
      draggedItem.type === "folder" &&
      isChildOf(targetFolderId, draggedItem.id)
    ) {
      alert("Không thể di chuyển folder vào thư mục con của nó!");
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    // Xóa item từ vị trí cũ
    const removeFromOld = (items: FileItem[]): FileItem[] => {
      return items.filter((item) => {
        if (item.id === draggedItem.id) {
          return false;
        }
        if (item.children) {
          item.children = removeFromOld(item.children);
        }
        return true;
      });
    };

    // Thêm vào folder mới
    const addToNew = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === targetFolderId) {
          const updatedDraggedItem = {
            ...draggedItem,
            parentId: targetFolderId,
          };
          return {
            ...item,
            children: [...(item.children || []), updatedDraggedItem],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: addToNew(item.children),
          };
        }
        return item;
      });
    };

    let newFiles = removeFromOld([...files]);
    newFiles = addToNew(newFiles);

    setFiles(newFiles);
    setDraggedItem(null);
    setDropTarget(null);

    // Mở folder đích sau khi di chuyển
    setExpandedFolders((prev) => ({
      ...prev,
      [targetFolderId]: true,
    }));
  };

  // Render một item (file hoặc folder)
  const renderItem = (item: FileItem, level = 0) => {
    const isExpanded = expandedFolders[item.id] || false;
    const isEditing = editingItem === item.id;
    const isDragTarget = dropTarget === item.id;

    return (
      <li
        key={item.id}
        className={`pl-${level * 4} ${isDragTarget ? "bg-blue-100" : ""}`}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <div className="flex items-center py-1">
          {item.type === "folder" ? (
            <span
              className="cursor-pointer mr-1"
              onClick={() => toggleFolder(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              {isExpanded ? "📂" : "📁"}
            </span>
          ) : (
            <span className="mr-1">📄</span>
          )}

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={saveItemName}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 px-1 py-0.5 text-sm"
            />
          ) : (
            <span
              className="flex-grow"
              draggable={true}
              onDragStart={() => handleDragStart(item)}
            >
              {item.name}
            </span>
          )}

          <div className="flex space-x-1 ml-2">
            {item.type === "file" && onFileSelect && (
              <button
                onClick={() => onFileSelect(item)}
                className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Chọn
              </button>
            )}

            {item.type === "folder" && (
              <button
                onClick={() => showAddItemForm(item.id, "file")}
                className="px-2 py-0.5 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                + File
              </button>
            )}

            {item.type === "folder" && (
              <button
                onClick={() => showAddItemForm(item.id, "folder")}
                className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
              >
                + Folder
              </button>
            )}

            <button
              onClick={() => startEditing(item.id, item.name)}
              className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              Sửa
            </button>

            <button
              onClick={() => deleteItem(item.id)}
              className="px-2 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
        </div>

        {item.type === "folder" && item.children && isExpanded && (
          <ul className="ml-4 border-l border-gray-200">
            {item.children.map((child) => renderItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">File Manager</h3>
        <div className="space-x-2">
          <button
            onClick={() => showAddItemForm(undefined, "file")}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Thêm File
          </button>
          <button
            onClick={() => showAddItemForm(undefined, "folder")}
            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
          >
            Thêm Folder
          </button>
        </div>
      </div>

      {showNewItemForm && (
        <div className="mb-4 p-3 border border-gray-200 rounded">
          <div className="flex items-center space-x-2 mb-2">
            <label className="text-sm font-medium">Loại:</label>
            <select
              value={newItemType}
              onChange={(e) =>
                setNewItemType(e.target.value as "file" | "folder")
              }
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Tên ${
                newItemType === "file" ? "file" : "folder"
              } mới`}
              className="flex-grow border border-gray-300 rounded px-2 py-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addNewItem()}
            />
            <button
              onClick={addNewItem}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Thêm
            </button>
            <button
              onClick={() => setShowNewItemForm(null)}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <ul className="border border-gray-200 rounded p-2 max-h-80 overflow-y-auto">
        {files.length === 0 ? (
          <li className="text-gray-500 italic">
            Không có file hoặc folder nào.
          </li>
        ) : (
          files.map((item) => renderItem(item))
        )}
      </ul>
    </>
  );
}
