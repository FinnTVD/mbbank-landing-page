/* eslint-disable @typescript-eslint/no-explicit-any */
export const panelOptsButtons = [
  {
    id: "open-templates",
    className: "fa fa-file-o",
    command: "open-templates",
    attributes: { title: "Chọn mẫu trang" },
  },
  {
    id: "save-version",
    className: "fa fa-floppy-o",
    command: "show-save-dialog",
    attributes: { title: "Lưu phiên bản (thủ công)" },
  },
  {
    id: "view-versions",
    className: "fa fa-list",
    command: "show-versions-list",
    attributes: { title: "Xem danh sách phiên bản đã lưu" },
  },
  {
    id: "view-edit-history",
    className: "fa fa-history",
    command: "show-edit-history",
    attributes: { title: "Xem lịch sử chỉnh sửa" },
  },
  {
    id: 'open-file-manager',
    className: 'fa fa-folder-open',
    command: 'open-file-manager',
    attributes: { title: 'File Manager' }
  }
]

export interface SavedVersion {
  id: string;
  name: string;
  date: string;
  html: string;
  css: string;
  type: "page" | "template"; // Thêm trường type
  thumbnail?: string; // Thêm optional thumbnail
}

export interface HistoryItem {
  id: string;
  action: string;
  timestamp: string;
  html: string;
  css: string;
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getChangedAttributeKeys(changed: any, previous: any) {
  const result = [];

  const newAttrs = changed?.attributes || {};
  const oldAttrs = previous?.attributes || {};

  for (const key in newAttrs) {
    if (newAttrs[key] !== oldAttrs[key]) {
      result.push(key);
    }
  }

  return result;
}
