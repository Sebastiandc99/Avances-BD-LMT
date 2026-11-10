#!/usr/bin/env python3
"""Rebuild the fixed raster and affine pixel calibration from the supplied CAD inventory/PDF.
Usage: python docs/prepare-map.py --inventory ../outputs/Avances_BD_LMT_inventario_previo.json --pdf '../upload/Traza LMT.pdf'
The transformation aligns two representations of one engineering plan, not an independent survey.
"""
import argparse, hashlib, io, json, math
from pathlib import Path
import fitz
import numpy as np
from PIL import Image, ImageDraw

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--inventory', required=True)
    parser.add_argument('--pdf', required=True)
    parser.add_argument('--width',type=int,default=4000)
    args=parser.parse_args()
    root=Path(__file__).resolve().parent.parent
    out=root/'public'/'assets';out.mkdir(parents=True,exist_ok=True)
    docs=root/'docs';docs.mkdir(exist_ok=True)
    inv=json.loads(Path(args.inventory).read_text())
    doc=fitz.open(args.pdf);page=doc[0]
    assert len(doc)==1
    images=page.get_images()
    assert len(images)==1
    xref=images[0][0]
    embedded=doc.extract_image(xref)
    image=Image.open(io.BytesIO(embedded['image'])).convert('RGB')
    native=list(image.size)
    w=args.width;h=round(image.height*w/image.width)
    image=image.resize((w,h),Image.Resampling.LANCZOS)
    image.save(out/'traza.webp',format='WEBP',quality=88,method=6)
    box=page.get_image_rects(xref)[0]
    paths=[d for d in page.get_drawings() if d['color'] and np.allclose(d['color'],[1,0,1])]
    # Paths were read from the supplied PDF. Full series mapping cross-checked by
    # each path's segment count, endpoints, bends, and all consecutive span lengths.
    series=[
        [f'L-{i:03}' for i in range(1,22)],
        [f'L-{i:03}' for i in range(33,167)],
        [f'L-{i:03}' for i in range(172,165,-1)],
        [f'L-{i:03}' for i in range(172,220)],
        [f'FP-{i:03}' for i in range(1,19)],
        [f'L-{i:03}' for i in range(21,34)],
    ]
    by={p['id']:p for p in inv['piquetes']}
    observations=[];span_pairs=[]
    assert len(paths)==len(series)
    for path,ids in zip(paths,series):
        items=path['items'];assert all(item[0]=='l' for item in items)
        assert len(ids)==len(items)+1
        points=[items[0][1]]+[item[2] for item in items]
        for a,b in zip(items,items[1:]):
            assert math.dist(a[2],b[1])<0.001
        for pid,pdf in zip(ids,points):
            cad=by[pid]
            pixel=[(pdf.x-box.x0)*w/box.width,(pdf.y-box.y0)*h/box.height]
            observations.append([pid,cad['x_este_m'],cad['y_norte_m'],*pixel])
        span_pairs += [frozenset(p) for p in zip(ids,ids[1:])]
    expected=[frozenset([v['desde'],v['hasta']]) for v in inv['vanos']]
    assert len(span_pairs)==235 and len(set(span_pairs))==235
    assert set(span_pairs)==set(expected)
    assert set(o[0] for o in observations)==set(by)
    # Centre input values for stable least-squares solve.
    origin=np.mean([[o[1],o[2]] for o in observations],axis=0)
    cad=np.array([[o[1],o[2]] for o in observations]);pixels=np.array([[o[3],o[4]] for o in observations])
    a=np.column_stack([cad-origin,np.ones(len(cad))])
    transform=np.linalg.lstsq(a,pixels,rcond=None)[0]
    predicted=a@transform
    residual_px=np.linalg.norm(predicted-pixels,axis=1)
    back=(pixels-transform[2])@np.linalg.inv(transform[:2])+origin
    residual_m=np.linalg.norm(back-cad,axis=1)
    assert residual_m.max()<2
    def pixel(c):return (np.array([c['x_este_m']-origin[0],c['y_norte_m']-origin[1],1])@transform).tolist()
    for p in inv['piquetes']:
        p['pixel']=[round(v,5) for v in pixel(p)]
        assert 0<=p['pixel'][0]<=w and 0<=p['pixel'][1]<=h
    cal={
        'method':'Affine least squares from all 237 CAD pole positions to 241 PDF path vertices; 235 exact span ID pairs checked.',
        'input_origin_m':origin.tolist(),
        'matrix_rows_easting_northing_constant':transform.tolist(),
        'formula':'[pixel_x,pixel_y] = [easting-origin_E,northing-origin_N,1] @ matrix',
        'observations':len(observations),'unique_poles':len(by),'spans_checked':len(expected),
        'rms_m':float(np.sqrt(np.mean(residual_m**2))),'max_m':float(residual_m.max()),
        'rms_px':float(np.sqrt(np.mean(residual_px**2))),'max_px':float(residual_px.max()),
        'image_rect_pdf':[box.x0,box.y0,box.x1,box.y1],
        'source_pdf_sha256':hashlib.sha256(Path(args.pdf).read_bytes()).hexdigest(),
        'source_cad_sha256':inv['fuente_geometria']['sha256'],
        'note':'Alignment of two representations of the same plan. It is not an independent accuracy verification against terrain; datum and orthophoto ground-control validation remain pending.',
        'path_id_series':series,
    }
    inv['image']={'width':w,'height':h,'url':'./assets/traza.webp','nativeWidth':native[0],'nativeHeight':native[1], 'bounds':[[0,0],[h,w]],'coordinateSystem':'image pixels; x right, y down','source':'Embedded satellite raster supplied by the user in Traza LMT.pdf','calibration':cal}
    inv['mapNote']='Fondo provisional aportado por el usuario. Geometría extraída del DWG y alineada al PDF; ajuste geográfico al terreno pendiente de validar.'
    (out/'inventory.json').write_text(json.dumps(inv,ensure_ascii=False,separators=(',',':')))
    (docs/'calibration.json').write_text(json.dumps(cal,ensure_ascii=False,indent=2))
    # QA overlay includes only trace geometry and labels (not a deliverable).
    preview=image.copy();draw=ImageDraw.Draw(preview)
    for v in inv['vanos']:
        draw.line([tuple(by[v['desde']]['pixel']),tuple(by[v['hasta']]['pixel'])],fill='#ff00ff' if v['linea']=='larga' else '#00ffff',width=4)
    for p in inv['piquetes']:
        x,y=p['pixel'];draw.ellipse((x-2,y-2,x+2,y+2),fill='yellow')
        if int(p['rotulo'].replace('FP',''))%20==0 or p['linea']=='corta':draw.text((x+5,y),p['rotulo'],fill='cyan')
    preview.thumbnail((1200,1500));preview.save(docs/'calibration-preview.png')
    print(json.dumps({'imageSize':[w,h],'imageBytes':(out/'traza.webp').stat().st_size,'calibration':{k:cal[k] for k in ['observations','unique_poles','spans_checked','rms_m','max_m','rms_px','max_px']}},indent=2))

if __name__=='__main__':main()
