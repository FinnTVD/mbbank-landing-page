/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
const templatesPlugin = (editor: any) => {
  const templates = [
    {
      id: "template1",
      name: "Trang chủ",
      html: "<div class='hero'>Trang chủ</div>",
      css: "div { color: red; font-size: 20px; }",
    },
    // Thêm các template khác nếu cần...
  ];

  // Lệnh "open-custom-templates" để chèn template vào GrapesJS
  editor.Commands.add("open-custom-templates", {
    run(editor: any) {
      const template = templates[0]; // Chọn template đầu tiên
      editor.setComponents(template.html); // Thiết lập HTML
      editor.setStyle(template.css); // Thiết lập CSS
    },
  });

  // Thêm nút vào thanh công cụ để mở template
  editor.Panels.addButton("options", {
    id: "open-custom-templates",
    className: "fa fa-file-code-o",
    command: "open-custom-templates",
    attributes: { title: "Chọn template tùy chỉnh" },
  });

  // Cấu hình plugin template manager trong GrapesJS
  editor.on("load", () => {
    editor.plugins.add("grapesjs-template-manager", {
      templates: templates.map(template => ({
        id: template.id,
        name: template.name,
        html: template.html,
        css: template.css,
        thumbnail: "/path-to-thumbnail-image.jpg", // Nếu có ảnh thumbnail
      })),
      modalTitle: "Chọn template tùy chỉnh",
      importBtnText: "Sử dụng mẫu này",
      addBtnText: "Thêm mẫu mới",
      editBtnText: "Chỉnh sửa",
      deleteBtnText: "Xóa",
      onSelect: (template: any) => {
        console.log("Đã chọn template:", template);
        editor.setComponents(template.html); // Chèn HTML vào editor
        editor.setStyle(template.css); // Chèn CSS vào editor
      },
      onAdd: (template: any) => {
        console.log("Đã thêm template mới:", template);
      },
      onEdit: (template: any) => {
        console.log("Đã chỉnh sửa template:", template);
      },
      onDelete: (template: any) => {
        console.log("Đã xóa template:", template);
      },
    });
  });
};

export default templatesPlugin;
