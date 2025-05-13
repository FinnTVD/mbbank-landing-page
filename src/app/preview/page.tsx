import { CSS_DEMO, HTML_DEMO } from "@/data/data-page";

export default function page() {
  return (
    <>
      <style>{CSS_DEMO}</style>
      <body dangerouslySetInnerHTML={{ __html: HTML_DEMO }}></body>
    </>
  );
}
