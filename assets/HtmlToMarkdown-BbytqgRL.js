import{r as o,j as t}from"./index-Ckx5g3CE.js";import{C as w}from"./code-CA8eEfPH.js";import{U as N}from"./upload-BeZbD1lf.js";import{A as $}from"./arrow-right-BvQCXyho.js";import{D as C}from"./download-CBMF7h4P.js";import{C as k}from"./check-BPMUdwMC.js";import{C as v}from"./copy-D3GgtY91.js";function H(){const[r,i]=o.useState(""),[n,p]=o.useState(""),[u,m]=o.useState(!1),d=a=>{let e=a;return e=e.replace(/<h1[^>]*>(.*?)<\/h1>/gi,`# $1

`),e=e.replace(/<h2[^>]*>(.*?)<\/h2>/gi,`## $1

`),e=e.replace(/<h3[^>]*>(.*?)<\/h3>/gi,`### $1

`),e=e.replace(/<h4[^>]*>(.*?)<\/h4>/gi,`#### $1

`),e=e.replace(/<h5[^>]*>(.*?)<\/h5>/gi,`##### $1

`),e=e.replace(/<h6[^>]*>(.*?)<\/h6>/gi,`###### $1

`),e=e.replace(/<strong[^>]*>(.*?)<\/strong>/gi,"**$1**"),e=e.replace(/<b[^>]*>(.*?)<\/b>/gi,"**$1**"),e=e.replace(/<em[^>]*>(.*?)<\/em>/gi,"*$1*"),e=e.replace(/<i[^>]*>(.*?)<\/i>/gi,"*$1*"),e=e.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,"[$2]($1)"),e=e.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,"![$2]($1)"),e=e.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi,"![]($1)"),e=e.replace(/<li[^>]*>(.*?)<\/li>/gi,`- $1
`),e=e.replace(/<\/?ul[^>]*>/gi,`
`),e=e.replace(/<\/?ol[^>]*>/gi,`
`),e=e.replace(/<p[^>]*>(.*?)<\/p>/gi,`$1

`),e=e.replace(/<br[^>]*\/?>/gi,`
`),e=e.replace(/<code[^>]*>(.*?)<\/code>/gi,"`$1`"),e=e.replace(/<pre[^>]*>(.*?)<\/pre>/gis,"```\n$1\n```\n"),e=e.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis,(s,l)=>l.split(`
`).map(c=>`> ${c}`).join(`
`)+`

`),e=e.replace(/<hr[^>]*\/?>/gi,`
---

`),e=e.replace(/<[^>]+>/g,""),e=e.replace(/&nbsp;/g," "),e=e.replace(/&amp;/g,"&"),e=e.replace(/&lt;/g,"<"),e=e.replace(/&gt;/g,">"),e=e.replace(/&quot;/g,'"'),e=e.replace(/\n{3,}/g,`

`),e.trim()},x=()=>{r.trim()&&p(d(r))},f=a=>{var s;const e=(s=a.target.files)==null?void 0:s[0];if(e){const l=new FileReader;l.onload=c=>{var g;const h=(g=c.target)==null?void 0:g.result;i(h),p(d(h))},l.readAsText(e)}},j=async()=>{await navigator.clipboard.writeText(n),m(!0),setTimeout(()=>m(!1),2e3)},b=()=>{const a=new Blob([n],{type:"text/markdown"}),e=URL.createObjectURL(a),s=document.createElement("a");s.href=e,s.download="document.md",s.click(),URL.revokeObjectURL(e)};return t.jsx("div",{className:"space-y-6",children:t.jsxs("div",{className:"card",children:[t.jsxs("h2",{className:"text-xl font-bold mb-6 flex items-center gap-2",children:[t.jsx(w,{className:"w-6 h-6 text-purple-500"}),"HTML to Markdown"]}),t.jsxs("div",{className:"mb-4",children:[t.jsxs("div",{className:"flex items-center justify-between mb-2",children:[t.jsx("label",{className:"font-medium",children:"HTML Input"}),t.jsxs("label",{className:"text-sm text-blue-500 cursor-pointer flex items-center gap-1",children:[t.jsx(N,{className:"w-4 h-4"})," Upload File",t.jsx("input",{type:"file",accept:".html,.htm",onChange:f,className:"hidden"})]})]}),t.jsx("textarea",{value:r,onChange:a=>i(a.target.value),className:"input-field h-40 font-mono text-sm",placeholder:`<h1>Heading</h1>
<p><strong>Bold</strong> and <em>italic</em> text.</p>`})]}),t.jsxs("button",{onClick:x,className:"btn-primary w-full flex items-center justify-center gap-2 mb-4",children:[t.jsx($,{className:"w-5 h-5"})," Convert to Markdown"]}),n&&t.jsxs("div",{children:[t.jsxs("div",{className:"flex items-center justify-between mb-2",children:[t.jsx("label",{className:"font-medium",children:"Markdown Output"}),t.jsxs("div",{className:"flex gap-2",children:[t.jsx("button",{onClick:b,className:"btn-secondary p-2",children:t.jsx(C,{className:"w-4 h-4"})}),t.jsx("button",{onClick:j,className:"btn-secondary p-2",children:u?t.jsx(k,{className:"w-4 h-4 text-green-500"}):t.jsx(v,{className:"w-4 h-4"})})]})]}),t.jsx("textarea",{value:n,readOnly:!0,className:"input-field h-40 font-mono text-sm"})]})]})})}export{H as default};
