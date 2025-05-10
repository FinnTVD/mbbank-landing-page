/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default (editor: any, opts = {}) => {
  const options = {
    modalTitle: 'Chọn mẫu trang',
    templates: [
      {
        id: "template1",
        name: "Trang chủ MB Bank",
        category: "Trang chủ",
        thumbnail: "https://picsum.photos/id/1/200/300",
        html: `
          <div class="header">
            <div class="logo">
              <img src="/mbbank/Logo_MB_new.png" alt="MB Bank Logo" />
            </div>
            <div class="nav">
              <a href="#">Trang chủ</a>
              <a href="#">Dịch vụ</a>
              <a href="#">Liên hệ</a>
            </div>
          </div>
          <div class="hero">
            <h1>Ngân hàng MB - Đồng hành cùng thành công</h1>
            <p>Giải pháp tài chính toàn diện cho cá nhân và doanh nghiệp</p>
            <button>Tìm hiểu thêm</button>
          </div>
        `,
        css: `
          .header {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            background-color: #fff;
          }
          .logo img {
            height: 40px;
          }
          .nav {
            display: flex;
            gap: 20px;
          }
          .nav a {
            text-decoration: none;
            color: #333;
          }
          .hero {
            text-align: center;
            padding: 100px 20px;
            background-color: #f5f5f5;
          }
          .hero h1 {
            font-size: 36px;
            margin-bottom: 20px;
          }
          .hero p {
            font-size: 18px;
            margin-bottom: 30px;
          }
          .hero button {
            padding: 12px 24px;
            background-color: #1e88e5;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `
      }
    ],
    ...opts
  };

  // Thêm command để mở modal templates
  editor.Commands.add('open-templates', {
    run(editor: any) {
      // Tạo và hiển thị modal
      const modal = editor.Modal;
      modal.setTitle(options.modalTitle);

      // Tạo container cho templates
      let content = '<div class="templates-container" style="display: flex; flex-wrap: wrap; gap: 20px; padding: 20px;">';

      // Kiểm tra xem có templates không
      if (options.templates && options.templates.length > 0) {
        // Thêm các templates vào container
        options.templates.forEach((template: any) => {
          content += `
            <div class="template-card" style="width: 200px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; cursor: pointer; margin-bottom: 20px;" data-template-id="${template.id}">
              <div class="template-image" style="height: 150px; overflow: hidden; background-color: #f5f5f5;">
                ${template.thumbnail ? `<img src="${template.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;">` :
              '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">Không có ảnh</div>'}
              </div>
              <div class="template-info" style="padding: 10px;">
                <div class="template-name" style="font-weight: bold; margin-bottom: 5px;">${template.name}</div>
                ${template.category ? `<div class="template-category" style="font-size: 12px; color: #fff;">${template.category}</div>` : ''}
              </div>
            </div>
          `;
        });
      } else {
        content += '<div style="padding: 20px; text-align: center;">Không có mẫu trang nào</div>';
      }

      content += '</div>';

      // Thêm container vào modal
      modal.setContent(content);

      // Hiển thị modal
      modal.open();

      // Xử lý sự kiện click vào template
      setTimeout(() => {
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach((card: Element) => {
          card.addEventListener('click', () => {
            const templateId = (card as HTMLElement).getAttribute('data-template-id');
            const template = options.templates.find((t: any) => t.id === templateId);

            if (template) {
              // Thêm nội dung template vào editor
              editor.setComponents(template.html);
              editor.setStyle(template.css);
              modal.close();
            }
          });
        });
      }, 100);
    }
  });
}