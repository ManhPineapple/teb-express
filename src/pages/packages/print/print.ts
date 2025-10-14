export const extension = (str: string): string => {
  const arr = /\.(\w+)$/i.exec(str);
  if (arr === null || arr.length < 2) return "";
  return arr[1].toLowerCase();
};

import { fetchLabel } from "@/services/packages";

interface PrintImageOptions {
  name: string;
  specs: string[];
  replace: boolean;
  styles: string[];
}

export function printImage(
  url: string,
  options: Partial<PrintImageOptions> = {}
) {
  const defaultOptions: PrintImageOptions = {
    name: "_blank",
    specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
    replace: true,
    styles: [],
    ...options,
  };

  const { name, specs } = defaultOptions;
  const specsString = specs.length > 0 ? specs.join(",") : "";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            img {
              width: 95%;
              height: auto;
              page-break-before: avoid;
              page-break-after: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <img src="${url}">
        </div>
      </body>
    </html>
  `;

  const win = window.open("", name, specsString);
  win?.document.write(html);

  const img = new Image();
  img.src = url;
  img.onload = function () {
    setTimeout(function () {
      win?.document.close();
      win?.focus();
      win?.print();
      win?.close();
    }, 1500);
  };
}

export function printDocument(url: string) {
  let iframe = document.getElementById("print") as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement("iframe");
  }

  iframe.style.display = "none";
  iframe.src = url;
  iframe.id = "print";

  iframe.onload = () => {
    const iframeDoc =
      iframe?.contentDocument || iframe?.contentWindow?.document;
    if (iframeDoc) {
      const style = iframeDoc.createElement("style");
      style.innerHTML = `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
        }
      `;
      iframeDoc.head.appendChild(style);
    }

    setTimeout(() => {
      iframe?.contentWindow?.addEventListener("afterprint", () => {
        document.body.removeChild(iframe as Node);
      });

      iframe?.contentWindow?.focus();
      iframe?.contentWindow?.print();
    }, 500);
  };

  document.body.appendChild(iframe);
}

export async function prints(url: string) {
  if (!url) return;

  const ext = extension(url);

  if (/^http/gi.test(url)) {
    if (ext === "pdf") {
      printDocument(url);
      return;
    }

    printImage(url);
    return;
  }

  try {
    const res = await fetchLabel({url: url, type: "labels"})
    const src = (window.webkitURL || window.URL).createObjectURL(res.data);

    if (ext === "pdf") {
      printDocument(src);
    } else {
      printImage(src);
    }
  } catch (error) {
    console.error("Error printing:", error);
    // Handle error as needed
  }
}
