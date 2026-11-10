export type MapView={x:number;y:number;w:number;h:number};
export type MapSize={w:number;h:number};
export type MapMemory={line:string;view:MapView;size:MapSize;poleFocusRequest?:number};
/** Preserve map center and world units per screen pixel across opening/closing a sheet. */
export function resizeMapView(view:MapView,before:MapSize,after:MapSize):MapView{
 const scale=view.w/before.w,w=after.w*scale,h=after.h*scale;
 return {x:view.x+(view.w-w)/2,y:view.y+(view.h-h)/2,w,h};
}
