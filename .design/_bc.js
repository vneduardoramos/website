const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 })).newPage();
  await p.goto("http://localhost:3000/industries/healthcare", { waitUntil:"networkidle" });
  await p.waitForTimeout(700);
  await p.screenshot({ path:".design/clips/bc-industry.png", clip:{x:0,y:60,width:900,height:240} });
  await b.close(); console.log("ok");
})();
