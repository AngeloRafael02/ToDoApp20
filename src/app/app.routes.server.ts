import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path:'**', renderMode: RenderMode.Client },
  { path:'Status/:status', renderMode:RenderMode.Server},
  { path:'Error', renderMode:RenderMode.Prerender}
];
