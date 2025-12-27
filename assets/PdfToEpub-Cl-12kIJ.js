import{r as l,j as e,L as E}from"./index-DrWj1tgA.js";import{J as B}from"./jszip.min-Bi_8JJEF.js";import{g as D,v as L,G as F}from"./pdf-BQWzvUHG.js";import{B as R}from"./book-open-Bb_WTiAc.js";import{U as T}from"./upload-C3dpc3Xt.js";import{A as I}from"./alert-circle-CB5MyUBg.js";import{D as S}from"./download-DZ1EfTSG.js";F.workerSrc=`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${L}/pdf.worker.min.js`;function Z(){const[n,b]=l.useState(null),[p,x]=l.useState(!1),[f,i]=l.useState(""),[c,m]=l.useState(null),v=l.useRef(null),j=s=>{var o;const t=(o=s.target.files)==null?void 0:o[0];t&&(b(t),m(null),i(""))},w=async()=>{var s;if(n){x(!0),i(""),m(null);try{const t=await n.arrayBuffer(),o=await D({data:t}).promise,r=new B;r.file("mimetype","application/epub+zip"),(s=r.folder("META-INF"))==null||s.file("container.xml",`<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`);let u="",g="",h="";for(let a=1;a<=o.numPages;a++){const $=(await(await o.getPage(a)).getTextContent()).items.map(U=>U.str).join(" "),C=`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Page ${a}</title>
</head>
<body>
  <h1>Page ${a}</h1>
  <p>${$.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
</body>
</html>`,d=`page_${a}.xhtml`;r.file(d,C),u+=`<item id="page_${a}" href="${d}" media-type="application/xhtml+xml"/>
`,g+=`<itemref idref="page_${a}"/>
`,h+=`<navPoint id="navPoint-${a}" playOrder="${a}">
    <navLabel><text>Page ${a}</text></navLabel>
    <content src="${d}"/>
</navPoint>
`}const P=`<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head>
    <meta name="dtb:uid" content="urn:uuid:12345"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="${o.numPages}"/>
    <meta name="dtb:maxPageNumber" content="${o.numPages}"/>
</head>
<docTitle><text>${n.name}</text></docTitle>
<navMap>
${h}
</navMap>
</ncx>`;r.file("toc.ncx",P);const N=`<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
        <dc:title>${n.name}</dc:title>
        <dc:language>en</dc:language>
        <dc:identifier id="BookId" opf:scheme="UUID">urn:uuid:12345</dc:identifier>
        <dc:creator>Auto Generated</dc:creator>
    </metadata>
    <manifest>
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
        ${u}
    </manifest>
    <spine toc="ncx">
        ${g}
    </spine>
</package>`;r.file("content.opf",N);const k=await r.generateAsync({type:"blob"});m(k)}catch(t){console.error(t),i(t.message||"Error converting PDF to EPUB")}finally{x(!1)}}},y=()=>{if(!c)return;const s=URL.createObjectURL(c),t=document.createElement("a");t.href=s,t.download=(n==null?void 0:n.name.replace(/\.pdf$/i,""))+".epub"||"document.epub",t.click(),URL.revokeObjectURL(s)};return e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"card",children:[e.jsxs("h2",{className:"text-xl font-bold mb-6 flex items-center gap-2",children:[e.jsx(R,{className:"w-6 h-6 text-emerald-600"}),"PDF to EPUB Converter"]}),e.jsxs("label",{className:"cursor-pointer block mb-6",children:[e.jsx("input",{ref:v,type:"file",accept:".pdf",onChange:j,className:"hidden"}),e.jsx("div",{className:"flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-emerald-500 transition-colors",children:e.jsxs("div",{className:"text-center",children:[e.jsx(T,{className:"w-12 h-12 mx-auto mb-4 text-slate-400"}),e.jsx("p",{className:"text-slate-600 dark:text-slate-400",children:n?n.name:"Click to upload PDF file"})]})})]}),n&&e.jsx("button",{onClick:w,disabled:p,className:"btn-primary w-full disabled:opacity-50",children:p?e.jsxs(e.Fragment,{children:[e.jsx(E,{className:"w-5 h-5 animate-spin inline mr-2"}),"Converting..."]}):"Convert to EPUB"}),f&&e.jsxs("div",{className:"mt-4 flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl",children:[e.jsx(I,{className:"w-5 h-5"}),f]}),c&&e.jsxs("div",{className:"mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl",children:[e.jsx("h3",{className:"text-emerald-800 dark:text-emerald-200 font-medium mb-4",children:"Conversion Success!"}),e.jsxs("button",{onClick:y,className:"btn-primary w-full flex items-center justify-center gap-2",children:[e.jsx(S,{className:"w-5 h-5"}),"Download EPUB"]})]}),e.jsx("div",{className:"mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl",children:e.jsx("p",{className:"text-sm text-slate-500",children:"Note: This converter extracts text from the PDF and creates a simple EPUB. Layout and complex formatting may not be preserved."})})]})})}export{Z as default};
