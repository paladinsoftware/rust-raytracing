/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function init_panic_hook(): void;
export function __wbg_vector_free(a: number): void;
export function vector_up(): number;
export function vector_white(): number;
export function vector_zero(): number;
export function vector_subtract(a: number, b: number): number;
export function vector_scale(a: number, b: number): number;
export function vector_unit_vector(a: number): number;
export function vector_dot_product(a: number, b: number): number;
export function vector_length(a: number): number;
export function vector_add(a: number, b: number): number;
export function vector_add3(a: number, b: number, c: number): number;
export function vector_cross_product(a: number, b: number): number;
export function vector_reflect_through(a: number, b: number): number;
export function __wbg_camera_free(a: number): void;
export function __wbg_color_free(a: number): void;
export function __wbg_sceneobject_free(a: number): void;
export function __wbg_scene_free(a: number): void;
export function __wbg_ray_free(a: number): void;
export function scene_new(): number;
export function scene_pixels(a: number): number;
export function scene_tick(a: number): void;
export function scene_render(a: number): void;
export function __wbindgen_free(a: number, b: number): void;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
