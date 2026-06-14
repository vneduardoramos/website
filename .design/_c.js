const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  // desktop frames over the cycle
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1.5 });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  for (let i=0;i<3;i++){
    await p.screenshot({ path: `.design/clips/c-${i}.png`, clip: { x: 600, y: 80, width: 840, height: 640 } });
    if (i<2) await p.waitForTimeout(5300);
  }
  // overflow check
  const o = await p.evaluate(()=>{ const b=document.body; return { sw:b.scrollWidth, cw:b.clientWidth, overflow:b.scrollWidth>b.clientWidth+1 }; });
  console.log("1440 overflow", JSON.stringify(o));
  await ctx.close();
  // 1024
  const c2 = await b.newContext({ viewport:{width:1024,height:800}, deviceScaleFactor:1.5 });
  const p2 = await c2.newPage(); await p2.goto("http://localhost:3000/", {waitUntil:"networkidle"}); await p2.waitForTimeout(1200);
  await p2.screenshot({ path: ".design/clips/c-1024.png", clip:{x:380,y:80,width:644,height:560} });
  const o2 = await p2.evaluate(()=>({ sw:document.body.scrollWidth, cw:document.body.clientWidth }));
  console.log("1024", JSON.stringify(o2));
  await c2.close();
  await b.close(); console.log("ok");
})();
