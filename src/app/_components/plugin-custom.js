/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default (editor, opts = {}) => {
  const bm = editor.BlockManager;

  // Thêm block cho Hero Section
  bm.add("mb-hero", {
    label: `
    <div style="display: flex; align-items: center;flex-direction: column; gap: 10px">
      <img src="https://pay2s.vn/wp-content/uploads/2024/10/thumbnail-logo-MBBank.jpg.webp" 
           style="width: 100px; height: auto; border-radius: 5px" />
      <span>Hero Section Custom</span>
    </div>
  `,
    category: "MB Bank Custom",
    content: `
      <section>
        <h1>Welcome to MB Bank</h1>
        <p>Ứng dụng ngân hàng của MB trên điện thoại di động, thực hiện các giao dịch tài chính, thanh toán với thao tác đơn giản, thuận tiện.</p>
         <img style="width:600px" src="https://pay2s.vn/wp-content/uploads/2024/10/thumbnail-logo-MBBank.jpg.webp"/>
      </section>
    `,
  });

  // Thêm block cho Basic
  bm.add("mb-box", {
    label: `
    <div style="display: block; position">
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"></path>
      </svg>
      <span>Box</span>
    </div>
  `,
    category: "Basic",
    content: ` 
      <div style="display: block; height: 300px; position: relative;"></div>
    `,
  });
};
