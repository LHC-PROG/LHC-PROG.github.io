const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=__dirname;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.gif':'image/gif','.md':'text/plain; charset=utf-8'};
function openBrowser(url){spawn('cmd.exe',['/c','start','',url],{windowsHide:true,stdio:'ignore'})}
function startPreview({open=false,port=8770}={}){
 const server=http.createServer((req,res)=>{
  let file;try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}if(!path.extname(file))file=path.join(file,'index.html')}catch{res.writeHead(400).end();return}
  fs.readFile(file,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(error?'Not found':data)});
 });
 return new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{if(open)openBrowser('http://127.0.0.1:'+port+'/');resolve(server)})});
}
module.exports={startPreview};
if(require.main===module)startPreview({open:!process.argv.includes('--no-browser')}).catch(async error=>{
 if(error.code==='EADDRINUSE'){try{const response=await fetch('http://127.0.0.1:8770/');const body=await response.text();if(body.includes('id="landscape"')||body.includes('林间漫游')){openBrowser('http://127.0.0.1:8770/');return}}catch{}}
 console.error('The local preview could not start:',error.message);process.exitCode=1;
});
