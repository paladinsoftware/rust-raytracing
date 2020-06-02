mod utils;
use wasm_bindgen::prelude::*;
use std::fmt;
use web_sys::console;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Vector {
    x: f32,
    y: f32,
    z: f32,
}

#[wasm_bindgen]
impl Vector {
    pub fn up() -> Vector {
        Vector { x: 0.0, y: 1.0, z: 0.0 }
    }

    pub fn white() -> Vector {
        Vector { x: 255.0, y: 255.0, z: 255.0 }
    }

    pub fn zero() -> Vector {
        Vector { x: 0.0, y: 0.0, z: 0.0 }
    }

    pub fn subtract(&self, v: &Vector) -> Vector {
        Vector {
            x: self.x - v.x,
            y: self.y - v.y,
            z: self.z - v.z,
        }
    }

    pub fn scale(&self, t: f32) -> Vector {
        Vector {
            x: self.x * t,
            y: self.y * t,
            z: self.z * t,
        }
    }

    pub fn unit_vector(&self) -> Vector {
        self.scale(1.0 / self.length())
    }

    pub fn dot_product(&self, a: &Vector) -> f32 {
        (self.x * a.x) + (self.y * a.y) + (self.z * a.z)
    }

    pub fn length(&self) -> f32 {
        self.dot_product(&self).sqrt()
    }

    pub fn add(&self, a: &Vector) -> Vector {
        Vector { x: self.x + a.x, y: self.y + a.y, z: self.z + a.z }
    }

    pub fn add3(&self, a: &Vector, b: &Vector) -> Vector {
        Vector { x: self.x + a.x + b.x, y: self.y + a.y + b.y, z: self.z + a.z + b.z }
    }

    pub fn cross_product(&self, a: &Vector) -> Vector {
        Vector {
            x: (self.y * a.z) - (self.z * a.y),
            y: (self.z * a.x) - (self.x * a.z),
            z: (self.x * a.y) - (self.y * a.x)
        }
    }

    pub fn reflect_through(&self, normal: &Vector) -> Vector {
        let d = normal.scale(self.dot_product(normal));

        d.scale(2.0).subtract(&self)
    }
}

#[wasm_bindgen]
pub struct Camera {
    point: Vector,
    field_of_view: f32,
    vector: Vector,
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct Color {
    x: u8,
    y: u8,
    z: u8,
    checkered: bool,
    transparent: bool,
}

#[wasm_bindgen]
pub enum ObjectType {
    Plane,
    Sphere,
}

#[wasm_bindgen]
pub struct SceneObject {
    object_type: ObjectType,
    point: Vector,
    normal: Vector,
    color: Color,
    radius: f32,
    specular: f32,
    lambert: f32,
    ambient: f32
}

#[wasm_bindgen]
pub struct Scene {
    camera: Camera,
    lights: Vec<Vector>,
    objects: Vec<SceneObject>,
    width: f32,
    height: f32,
    pixels: Vec<u8>,
    planet1: f32,
    planet2: f32,
}

#[wasm_bindgen]
pub struct Ray {
    point: Vector,
    vector: Vector,
}

#[wasm_bindgen]
impl Scene {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Scene {
        Scene {
            camera: Camera {
                point: Vector {
                    x: 0.0, y: -3.0, z: 17.0
                },
                field_of_view: 45.0,
                vector: Vector {
                    x: 0.0, y: 1.3, z: 1.0
                }
            },
            lights: vec![
                Vector { x: -20.0, y: -15.0, z: 30.0 },
            ],
            objects: vec![
                SceneObject {
                    object_type: ObjectType::Sphere,
                    point: Vector { x: 0.0, y: 1.0, z: 0.0 },
                    normal: (Vector { x: 0.0, y: 1.0, z: 0.0 }).unit_vector(),
                    color: Color { x: 53, y: 237, z: 180, checkered: false, transparent: false },
                    specular: 0.5,
                    lambert: 0.2,
                    ambient: 0.0,
                    radius: 3.0,
                },
                SceneObject {
                    object_type: ObjectType::Sphere,
                    point: Vector { x: 4.0, y: 0.0, z: 0.0 },
                    normal: (Vector { x: 0.0, y: 1.0, z: 0.0 }).unit_vector(),
                    color: Color { x: 255, y: 0, z: 0, checkered: false, transparent: false },
                    specular: 0.0,
                    lambert: 0.9,
                    ambient: 0.0,
                    radius: 0.75,
                },
                SceneObject {
                    object_type: ObjectType::Sphere,
                    point: Vector { x: -2.5, y: -1.5, z: 1.0 },
                    normal: (Vector { x: 0.0, y: 1.0, z: 0.0 }).unit_vector(),
                    color: Color { x: 0, y: 0, z: 255, checkered: false, transparent: false },
                    specular: 0.0,
                    lambert: 0.7,
                    ambient: 0.2,
                    radius: 0.5,
                },
                SceneObject {
                    object_type: ObjectType::Sphere,
                    point: Vector { x: -1.5, y: 1.0, z: 4.5 },
                    normal: (Vector { x: 0.0, y: 1.0, z: 0.0 }).unit_vector(),
                    color: Color { x: 255, y: 0, z: 255, checkered: false, transparent: false },
                    specular: 0.0,
                    lambert: 0.7,
                    ambient: 0.1,
                    radius: 0.5,
                },
                SceneObject {
                    object_type: ObjectType::Plane,
                    point: Vector { x: 0.0, y: 4.0, z: 0.0 },
                    normal: (Vector { x: 0.0, y: 1.0, z: 0.0 }).unit_vector(),
                    color: Color { x: 255, y: 0, z: 255, checkered: true, transparent: false },
                    specular: 0.0,
                    lambert: 0.5,
                    ambient: 0.2,
                    radius: 0.0
                },
                SceneObject {
                    object_type: ObjectType::Sphere,
                    point: Vector { x: 6.0, y: 1.0, z: 2.0 },
                    normal: (Vector { x: 0.0, y: 1.0, z: 0.0 }).unit_vector(),
                    color: Color { x: 53, y: 237, z: 180, checkered: false, transparent: false },
                    specular: 0.5,
                    lambert: 0.2,
                    ambient: 0.0,
                    radius: 3.0,
                },
            ],
            width: 640.0,
            height: 480.0,
            pixels: vec![],
            planet1: 0.0,
            planet2: 0.0,
        }
    }

    pub fn pixels(&self) -> *const u8 {
        self.pixels.as_ptr()
    }

    pub fn tick(&mut self) {
        self.planet1 += 0.15 * 2.0;
        self.planet2 += 0.075 * 2.0;

        self.objects[1].point.x = self.planet1.sin() * 4.5;
        self.objects[1].point.z = self.planet1.cos() * 4.5;

        self.objects[2].point.x = self.planet2.sin() * 3.5;
        self.objects[2].point.z = self.planet2.cos() * 3.5;
    }

    pub fn render(&mut self) {
        self.tick();

        let camera = &self.camera;
        let objects = &self.objects;
        let lights = &self.lights;

        let mut next = Vec::with_capacity(640 * 480 * 3);

        let eye_vector = camera.vector.subtract(&camera.point).unit_vector();
        let vp_right = eye_vector.cross_product(&Vector::up()).unit_vector();
        let vp_up = vp_right.cross_product(&eye_vector).unit_vector();

        let fov_radians = std::f32::consts::PI * (camera.field_of_view / 2.0) / 180.0;
        let height_width_radio = self.height / self.width;
        let half_width = fov_radians.tan();
        let half_height = height_width_radio * half_width;
        let camera_width = half_width * 2.0;
        let camera_height = half_height * 2.0;
        let pixel_width = camera_width / (self.width - 1.0);
        let pixel_height = camera_width / (self.width - 1.0);

        let mut ray;

        for y in 0..(self.height as i32) {
            for x in 0..(self.width as i32) {
                let xcomp = vp_right.scale(((x as f32) * pixel_width) - half_width);
                let ycomp = vp_up.scale(((y as f32) * pixel_height) - half_height);

                ray = Ray {
                    point: camera.point,
                    vector: eye_vector.add3(&xcomp, &ycomp).unit_vector(),
                };

                let color = trace(&ray, &self, 0);

                next.push(color.x);
                next.push(color.y);
                next.push(color.z);
            }
        }

        self.pixels = next;
    }
}

fn plane_intersect(plane: &SceneObject, ray: &Ray) -> Option<f32> {
    let d_dor_n = ray.vector.dot_product(&plane.normal);

    if (d_dor_n.abs() <= 0.15) {
        return None;
    }

    let dist = plane.point.dot_product(&plane.normal) - ray.point.dot_product(&plane.normal);
    let dist = plane.point.subtract(&ray.point).dot_product(&plane.normal);

    if (dist > 0.001) {
        return Some(dist / d_dor_n);
    } else {
        return None;
    }
}

fn sphere_intersect(sphere: &SceneObject, ray: &Ray) -> Option<f32> {
    let eye_to_center = sphere.point.subtract(&ray.point);
    let v = eye_to_center.dot_product(&ray.vector);
    let eo_dot = eye_to_center.dot_product(&eye_to_center);
    let discriminant = (sphere.radius * sphere.radius) - eo_dot + (v * v);

    if discriminant < 0.0 {
        return None;
    } else {
        return Some(v - discriminant.sqrt());
    }
}

fn intersect_scene<'a>(ray: &Ray, scene: &'a Scene) -> (f32, Option<&'a SceneObject>) {
    let mut closestDistance = std::f32::INFINITY;
    let mut closestObject = None;

    for object in &scene.objects {
        match object.object_type {
            ObjectType::Sphere => {
                let dist = sphere_intersect(&object, &ray);

                match dist {
                    Some(dist) if dist < closestDistance => {
                        closestDistance = dist;
                        closestObject = Some(object);
                    },
                    _ => {}
                }
            },
            ObjectType::Plane => {
                let dist = plane_intersect(&object, &ray);

                match dist {
                    Some(dist) if dist < closestDistance => {
                        closestDistance = dist;
                        closestObject = Some(object);
                    },
                    _ => {}
                }
            },
        }
    }

    (closestDistance, closestObject)
}

fn trace(ray: &Ray, scene: &Scene, depth: u8) -> Color {
    if (depth > 2 ) {
        return Color { x: 0, y: 0, z: 0, checkered: false, transparent: true }
    }

    let (dist, object) = intersect_scene(&ray, &scene);

    if dist == std::f32::INFINITY {
        return Color { x: 200, y: 200, z: 200, checkered: false, transparent: false }
    }

    let point_at_time = ray.point.add(&ray.vector.scale(dist));

    let normal = match object.unwrap().object_type {
        ObjectType::Sphere => sphere_normal(object.unwrap(), &point_at_time),
        ObjectType::Plane => plane_normal(object.unwrap(), &point_at_time),
    };

    surface(&ray, &scene, &object.unwrap(), &point_at_time, &normal, depth)
}

fn sphere_normal(sphere: &SceneObject, pos: &Vector) -> Vector {
    pos.subtract(&sphere.point).unit_vector()
}

fn plane_normal(plane: &SceneObject, pos: &Vector) -> Vector {
    let v = Vector { x: 0.0, y: 0.0, z: 0.0 };

    v.subtract(&pos.reflect_through(&plane.normal)).unit_vector()
}

fn surface(ray: &Ray, scene: &Scene, object: &SceneObject, point_at_time: &Vector, normal: &Vector, depth: u8) -> Color {
    let mut b = object.color.clone();
    let mut lambert_amount = 0.0;
    let mut c = Vector { x: 0.0, y: 0.0, z: 0.0 };

    if (b.checkered) {
        let square = (point_at_time.x.floor() + point_at_time.z.floor()) as i32;

        if square % 2 == 0 {
            b.x = 0;
            b.y = 0;
            b.z = 0;
        } else {
            b.x = 255;
            b.y = 255;
            b.z = 255;
        }
    }

    if (object.lambert > 0.0) {
        for light in &scene.lights {
            if (light_visible(&point_at_time, &scene, &light)) {
                let contribution = light
                    .subtract(&point_at_time)
                    .unit_vector()
                    .dot_product(&normal);

                if contribution > 0.0 {
                    lambert_amount += contribution;
                }
            }
        }
    }

    if (object.specular > 0.0) {
        let reflected_ray = Ray {
            point: *point_at_time,
            vector: ray.vector.reflect_through(&normal)
        };

        let depth = depth + 1;

        let reflected_color = trace(&reflected_ray, &scene, depth);

        if (!reflected_color.transparent) {
            c = c.add(&color_to_vector(&reflected_color).scale(object.specular));
        }
    }

    if (lambert_amount > 1.0) {
        lambert_amount = 1.0
    }

    let amb = &object.ambient;

    let base_color = color_to_vector(&b);

    vector_to_color(
        &c.add3(
            &base_color.scale(lambert_amount * object.lambert),
            &base_color.scale(object.ambient),
        )
    )
}

fn color_to_vector(color: &Color) -> Vector {
    Vector { x: color.x as f32, y: color.y as f32, z: color.z as f32 }
}

fn vector_to_color(vector: &Vector) -> Color {
    Color { x: vector.x as u8, y: vector.y as u8, z: vector.z as u8, checkered: false, transparent: false }
}

fn light_visible(point_at_time: &Vector, scene: &Scene, light: &Vector) -> bool {
    let ray = Ray {
      point: *point_at_time,
      vector: point_at_time.subtract(&light).unit_vector()
    };

    let (distance, _) = intersect_scene(&ray, &scene);

    distance > -0.005
}
