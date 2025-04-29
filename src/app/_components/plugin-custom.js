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

  // // Thêm block cho Button
  // bm.add('destack-button', {
  //   label: 'Custom Button',
  //   category: 'Destack Components',
  //   content: `<button class="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button>`,
  // })

  // // Thêm block cho Card
  // bm.add('destack-card', {
  //   label: 'Custom Card',
  //   category: 'Destack Components',
  //   content: `
  //     <div class="shadow-lg p-5 rounded-lg">
  //       <h2>Card Title</h2>
  //       <p>Some description</p>
  //       <button class="bg-green-500 text-white px-3 py-1 rounded">Learn More</button>
  //     </div>
  //   `,
  // })
};
