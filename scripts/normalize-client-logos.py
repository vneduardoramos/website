from PIL import Image, ImageChops, ImageDraw
import os, math
P = {n:f'/tmp/clients/png/{f}' for n,f in {
  'banregio':'banregio_logo.png','laureate':'laureatelogo.png','starbucks':'starbuckslogo.png',
  'hussmann':'hussmanlogo.png','difrenosa':'difrenosalogo.png','heb':'heblogo.png','lendz':'lendz_logo.png'}.items()}
def lt(c,t): return c.point(lambda v:255 if v<t else 0)
def gt(c,t): return c.point(lambda v:255 if v>t else 0)
def AND(*m):
    r=m[0]
    for x in m[1:]: r=ImageChops.multiply(r,x)
    return r
def downscale(im,mw=1400): return im.resize((mw,round(im.height*mw/im.width)),Image.LANCZOS) if im.width>mw else im
def floodfill_white(im,th=42):
    im=im.copy(); w,h=im.size
    for sp in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]:
        p=im.getpixel(sp)
        if p[3]>0 and p[0]>235 and p[1]>235 and p[2]>235: ImageDraw.floodfill(im,sp,(255,255,255,0),thresh=th)
    return im
def proc(name):
    im=Image.open(P[name]).convert('RGBA')
    if name in ('banregio','laureate'): im=downscale(im)
    if name=='lendz': im=floodfill_white(im)
    if name=='difrenosa':
        r,g,b,a=im.split(); redness=ImageChops.subtract(r,ImageChops.lighter(g,b))
        im.putalpha(redness.point(lambda v:0 if v<38 else min(255,int((v-38)*2.2))))
    if name=='heb':
        r,g,b,a=im.split(); red=AND(gt(r,140),lt(g,110),lt(b,110)); fill=red.copy()
        for sp in [(0,0),(fill.width-1,0),(0,fill.height-1),(fill.width-1,fill.height-1)]:
            if fill.getpixel(sp)==0: ImageDraw.floodfill(fill,sp,128,thresh=10)
        im.putalpha(fill.point(lambda v:255 if v!=128 else 0))
    return im.crop(im.getbbox())
RULE={'banregio':'alpha','laureate':'black','starbucks':'alpha','hussmann':'alpha','difrenosa':'alpha','heb':'hebwhite','lendz':'alpha'}
def text_mask(im,rule):
    r,g,b,a=im.split(); A=gt(a,30)
    if rule=='alpha': return A
    if rule=='black': return AND(lt(r,80),lt(g,80),lt(b,80),A)
    if rule=='hebwhite':
        red=AND(gt(r,140),lt(g,110),lt(b,110),A); bb=red.getbbox(); white=AND(gt(r,215),gt(g,215),gt(b,215),A)
        m=Image.new('L',im.size,0)
        if bb: m.paste(white.crop(bb),bb)
        return m
def band(im,rule,is_ban):
    mask=text_mask(im,rule); bb=mask.getbbox(); x0,y0,x1,y1=bb
    col=mask.crop((x0,0,x1,mask.height)).resize((1,mask.height),Image.BOX)
    vals=[col.getpixel((0,y))/255 for y in range(mask.height)]; H=len(vals)
    capTop=y0 if is_ban else next((y for y in range(H) if vals[y]>=0.10),y0)
    baseline=next((y for y in range(H-1,-1,-1) if vals[y]>=0.30),y1)
    return capTop,baseline
# per-logo cap target: wordmarks 50, HEB normalized on its (ring-inclusive) white band to 66 -> pill stays anchor
CAPMAP={'heb':66}; DEFAULT=50; PAD=14; PADX=12
items=[]
for name in ['banregio','laureate','starbucks','hussmann','difrenosa','heb','lendz']:
    im=proc(name); ct,bl=band(im,RULE[name],name=='banregio'); s=CAPMAP.get(name,DEFAULT)/(bl-ct)
    items.append((name,im,s,bl))
Habove=max(s*bl for _,_,s,bl in items); Hbelow=max(s*(im.height-bl) for _,im,s,bl in items)
CH=math.ceil(Habove+Hbelow+2*PAD); BASE=round(PAD+Habove)
os.makedirs('/tmp/clients/norm2',exist_ok=True); metas={}
for name,im,s,bl in items:
    sc=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    cv=Image.new('RGBA',(sc.width+2*PADX,CH),(0,0,0,0)); cv.paste(sc,(PADX,round(BASE-s*bl)),sc)
    cv.save(f'/tmp/clients/norm2/{name}.png'); metas[name]=cv.size
    print(f"{name:10s} canvas={cv.size}")
print(f"CH={CH} BASE={BASE}")
order=['heb','starbucks','banregio','laureate','hussmann','lendz','difrenosa']
gap=46; tw=sum(metas[n][0] for n in order)+gap*(len(order)+1)
prev=Image.new('RGBA',(tw,CH),(255,255,255,255)); x=gap
for n in order: prev.alpha_composite(Image.open(f'/tmp/clients/norm2/{n}.png'),(x,0)); x+=metas[n][0]+gap
prev.convert('RGB').save('/tmp/clients/preview2.png'); print('preview2 saved')
