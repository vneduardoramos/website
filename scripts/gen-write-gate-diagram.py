import io, html

EN = {
  "title":"Propose, then commit: the three barriers on every calendar write",
  "desc":"A write starts with the assistant calling the tool with no approval token. Barrier one is the allowlist, checked in memory before any network call. The connector then reads the records back from Odoo and returns a proposal with a signed token that expires in fifteen minutes. A coordinator approves. Barrier two verifies the signature, the expiry, and that the operation, model, ids and values match the token. Barrier three asks for confirmation again at the moment of execution. Only then does the write reach Odoo. Any barrier failing means nothing is written.",
  "p1":"PHASE 1 · PROPOSE","p2":"PHASE 2 · COMMIT",
  "steps":[
    ("plain",None,"The assistant calls the tool",["No approval token yet. Four of the five stages hold no write tool at all."]),
    ("barrier","BARRIER 1 · GOVERNANCE","The allowlist, checked in memory. Model, field or file absent means denied.",["Never reaches the network, so nothing on the Odoo side can defeat it."]),
    ("plain",None,"The connector reads the records back from Odoo",["Current title, start, stop and attendees, so the proposal shows real values."]),
    ("plain",None,"A proposal, plus a signed token that expires in 15 minutes",["Each field as it stands against what it would become, the ids, and who gets emailed.","Nothing has been written."]),
    ("phase",None,None,None),
    ("human",None,"A person approves",["The same call, now carrying the token. This is the only way past this line."]),
    ("barrier","BARRIER 2 · TOKEN","Signature, expiry, operation, model, ids and a hash of the values.",["An approval to create cannot be spent to modify, nor record seven on record eight."]),
    ("barrier","BARRIER 3 · CONFIRMATION",None,["Asked again at the moment of execution. Not accepted means nothing happens."]),
  ],
  "outcome":"Only now does the write reach Odoo. Any barrier failing means nothing is written.",
}
ES = {
  "title":"Proponer y luego ejecutar: las tres barreras de cada escritura al calendario",
  "desc":"Una escritura empieza cuando el asistente llama a la herramienta sin token de aprobación. La barrera uno es la allowlist, verificada en memoria antes de cualquier llamada de red. El conector vuelve a leer los registros de Odoo y devuelve una propuesta con un token firmado que expira en quince minutos. Un coordinador aprueba. La barrera dos verifica la firma, la expiración y que la operación, el modelo, los ids y los valores coincidan con el token. La barrera tres pide confirmación otra vez en el momento de ejecutar. Solo entonces la escritura llega a Odoo. Si falla cualquier barrera, no se escribe nada.",
  "p1":"FASE 1 · PROPONER","p2":"FASE 2 · EJECUTAR",
  "steps":[
    ("plain",None,"El asistente llama a la herramienta",["Aún sin token de aprobación. Cuatro de las cinco etapas no tienen herramienta de escritura."]),
    ("barrier","BARRERA 1 · GOBIERNO","La allowlist, verificada en memoria. Modelo, campo o archivo ausente significa denegado.",["Nunca llega a la red, así que nada del lado de Odoo puede vencerla."]),
    ("plain",None,"El conector vuelve a leer los registros de Odoo",["Título, inicio, fin y asistentes actuales, para que la propuesta muestre valores reales."]),
    ("plain",None,"Una propuesta, más un token firmado que expira en 15 minutos",["Cada campo como está frente a lo que sería, los ids y a quién se notifica.","Todavía no se ha escrito nada."]),
    ("phase",None,None,None),
    ("human",None,"Una persona aprueba",["La misma llamada, ahora con el token. Es la única forma de pasar esta línea."]),
    ("barrier","BARRERA 2 · TOKEN","Firma, expiración, operación, modelo, ids y un hash de los valores.",["Una aprobación para crear no se gasta en modificar, ni la del registro siete en el ocho."]),
    ("barrier","BARRERA 3 · CONFIRMACIÓN",None,["Se pide otra vez al ejecutar. Si no se acepta, no pasa nada."]),
  ],
  "outcome":"Solo ahora la escritura llega a Odoo. Si falla cualquier barrera, no se escribe nada.",
}

W, X, BW = 720, 34, 652
INK, MUT, BOR, SURF, ROYAL, DEEP, WARM = "#0F2530","#546C7E","#E0EBF4","#F6FAFD","#2C53C8","#0B6E99","#B45309"
e = lambda s: html.escape(s, quote=False)

def build(D):
    o, y = [], 46
    o.append(f'<text x="{X}" y="30" font-size="11" font-weight="700" letter-spacing="1.6" fill="{DEEP}">{e(D["p1"])}</text>')
    for kind, eyebrow, head, subs in D["steps"]:
        if kind == "phase":
            y += 14
            o.append(f'<text x="{X}" y="{y+10}" font-size="11" font-weight="700" letter-spacing="1.6" fill="{DEEP}">{e(D["p2"])}</text>')
            y += 20
            o.append(f'<line x1="{X}" y1="{y}" x2="{X+BW}" y2="{y}" stroke="{BOR}" stroke-width="1" stroke-dasharray="4 4"/>')
            y += 18
            continue
        pad_top, line_h = 24, 19
        n_lines = (1 if eyebrow else 0) + (1 if head else 0) + len(subs)
        h = pad_top + (n_lines - 1) * line_h + 20
        stroke, sw = (ROYAL, 2) if kind == "barrier" else ((WARM, 2) if kind == "human" else (BOR, 1))
        fill = SURF if kind == "plain" else "#FFFFFF"
        o.append(f'<rect x="{X}" y="{y}" width="{BW}" height="{h}" rx="10" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
        if kind in ("barrier","human"):
            o.append(f'<rect x="{X}" y="{y}" width="6" height="{h}" rx="3" fill="{stroke}"/>')
        ty, tx = y + pad_top, X + 24
        if eyebrow:
            o.append(f'<text x="{tx}" y="{ty}" font-size="11" font-weight="700" letter-spacing="1.2" fill="{ROYAL}">{e(eyebrow)}</text>'); ty += line_h
        if head:
            col, fs, fw = (WARM,14,"700") if kind=="human" else (INK,13.5 if eyebrow else 14,"600")
            o.append(f'<text x="{tx}" y="{ty}" font-size="{fs}" font-weight="{fw}" fill="{col}">{e(head)}</text>'); ty += line_h
        for sline in subs:
            o.append(f'<text x="{tx}" y="{ty}" font-size="12.5" fill="{MUT}">{e(sline)}</text>'); ty += line_h
        y += h
        if (kind, eyebrow) != ("barrier", D["steps"][-1][1]):
            o.append(f'<line x1="{X+BW//2}" y1="{y+2}" x2="{X+BW//2}" y2="{y+18}" stroke="{MUT}" stroke-width="1.5" marker-end="url(#wg-arrow)"/>')
            y += 20
    o.append(f'<text x="{X+BW//2}" y="{y+26}" font-size="12.5" font-weight="600" fill="{INK}" text-anchor="middle">{e(D["outcome"])}</text>')
    H = y + 46
    head = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
            f'aria-labelledby="wg-title wg-desc" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">\n'
            f'  <title id="wg-title">{e(D["title"])}</title>\n  <desc id="wg-desc">{e(D["desc"])}</desc>\n'
            f'  <defs><marker id="wg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
            f'<path d="M0 0 L10 5 L0 10 z" fill="{MUT}"/></marker></defs>\n  <rect width="{W}" height="{H}" fill="#FFFFFF"/>\n  ')
    return head + "\n  ".join(o) + "\n</svg>\n"

for D, path in [(EN,"public/assets/images/cases/magnolia-doors-write-gate.svg"),
                (ES,"public/assets/images/cases/magnolia-doors-write-gate.es.svg")]:
    io.open(path,"w",encoding="utf-8").write(build(D)); print("wrote", path)
