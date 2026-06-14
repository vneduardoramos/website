const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2 })).newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.evaluate(()=>window.scrollTo(0, 430));
  await p.waitForTimeout(500);
  await p.screenshot({ path: ".design/clips/c-m.png" });
  const o = await p.evaluate(()=>({ sw:document.body.scrollWidth, cw:document.body.clientWidth, overflow: document.body.scrollWidth>document.body.clientWidth+1 }));
  console.log("mobile", JSON.stringify(o));
  await b.close();
})();
