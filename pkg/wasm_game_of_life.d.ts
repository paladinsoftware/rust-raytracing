/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_panic_hook(): void;
/**
*/
export enum ObjectType {
  Plane,
  Sphere,
}
/**
*/
export class Camera {
  free(): void;
}
/**
*/
export class Color {
  free(): void;
}
/**
*/
export class Ray {
  free(): void;
}
/**
*/
export class Scene {
  free(): void;
/**
*/
  constructor();
/**
* @returns {number} 
*/
  pixels(): number;
/**
*/
  tick(): void;
/**
*/
  render(): void;
}
/**
*/
export class SceneObject {
  free(): void;
}
/**
*/
export class Vector {
  free(): void;
/**
* @returns {Vector} 
*/
  static up(): Vector;
/**
* @returns {Vector} 
*/
  static white(): Vector;
/**
* @returns {Vector} 
*/
  static zero(): Vector;
/**
* @param {Vector} v 
* @returns {Vector} 
*/
  subtract(v: Vector): Vector;
/**
* @param {number} t 
* @returns {Vector} 
*/
  scale(t: number): Vector;
/**
* @returns {Vector} 
*/
  unit_vector(): Vector;
/**
* @param {Vector} a 
* @returns {number} 
*/
  dot_product(a: Vector): number;
/**
* @returns {number} 
*/
  length(): number;
/**
* @param {Vector} a 
* @returns {Vector} 
*/
  add(a: Vector): Vector;
/**
* @param {Vector} a 
* @param {Vector} b 
* @returns {Vector} 
*/
  add3(a: Vector, b: Vector): Vector;
/**
* @param {Vector} a 
* @returns {Vector} 
*/
  cross_product(a: Vector): Vector;
/**
* @param {Vector} normal 
* @returns {Vector} 
*/
  reflect_through(normal: Vector): Vector;
}
