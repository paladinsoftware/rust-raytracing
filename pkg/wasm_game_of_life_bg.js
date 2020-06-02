import * as wasm from './wasm_game_of_life_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
*/
export function init_panic_hook() {
    wasm.init_panic_hook();
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
*/
export const ObjectType = Object.freeze({ Plane:0,Sphere:1, });
/**
*/
export class Camera {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_camera_free(ptr);
    }
}
/**
*/
export class Color {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_color_free(ptr);
    }
}
/**
*/
export class Ray {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_ray_free(ptr);
    }
}
/**
*/
export class Scene {

    static __wrap(ptr) {
        const obj = Object.create(Scene.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_scene_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.scene_new();
        return Scene.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    pixels() {
        var ret = wasm.scene_pixels(this.ptr);
        return ret;
    }
    /**
    */
    tick() {
        wasm.scene_tick(this.ptr);
    }
    /**
    */
    render() {
        wasm.scene_render(this.ptr);
    }
}
/**
*/
export class SceneObject {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_sceneobject_free(ptr);
    }
}
/**
*/
export class Vector {

    static __wrap(ptr) {
        const obj = Object.create(Vector.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vector_free(ptr);
    }
    /**
    * @returns {Vector}
    */
    static up() {
        var ret = wasm.vector_up();
        return Vector.__wrap(ret);
    }
    /**
    * @returns {Vector}
    */
    static white() {
        var ret = wasm.vector_white();
        return Vector.__wrap(ret);
    }
    /**
    * @returns {Vector}
    */
    static zero() {
        var ret = wasm.vector_zero();
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} v
    * @returns {Vector}
    */
    subtract(v) {
        _assertClass(v, Vector);
        var ret = wasm.vector_subtract(this.ptr, v.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {number} t
    * @returns {Vector}
    */
    scale(t) {
        var ret = wasm.vector_scale(this.ptr, t);
        return Vector.__wrap(ret);
    }
    /**
    * @returns {Vector}
    */
    unit_vector() {
        var ret = wasm.vector_unit_vector(this.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} a
    * @returns {number}
    */
    dot_product(a) {
        _assertClass(a, Vector);
        var ret = wasm.vector_dot_product(this.ptr, a.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    length() {
        var ret = wasm.vector_length(this.ptr);
        return ret;
    }
    /**
    * @param {Vector} a
    * @returns {Vector}
    */
    add(a) {
        _assertClass(a, Vector);
        var ret = wasm.vector_add(this.ptr, a.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} a
    * @param {Vector} b
    * @returns {Vector}
    */
    add3(a, b) {
        _assertClass(a, Vector);
        _assertClass(b, Vector);
        var ret = wasm.vector_add3(this.ptr, a.ptr, b.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} a
    * @returns {Vector}
    */
    cross_product(a) {
        _assertClass(a, Vector);
        var ret = wasm.vector_cross_product(this.ptr, a.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} normal
    * @returns {Vector}
    */
    reflect_through(normal) {
        _assertClass(normal, Vector);
        var ret = wasm.vector_reflect_through(this.ptr, normal.ptr);
        return Vector.__wrap(ret);
    }
}

export const __wbg_new_59cb74e423758ede = function() {
    var ret = new Error();
    return addHeapObject(ret);
};

export const __wbg_stack_558ba5917b466edd = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

