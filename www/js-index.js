let canvas = document.getElementById('game');
let width = 640;
let height = 480;

canvas.width = width;
canvas.height = height;
canvas.style.cssText = 'width:' + (width) + 'px; height:' + (height) + 'px';

let ctx = canvas.getContext('2d');
let data = ctx.getImageData(0, 0, width, height);

let scene = {};

scene.camera = {
  point: {
    x: 0,
    y: -3,
    z: 17,
  },
  fieldOfView: 45,
  vector: {
    x: 0,
    y: 1.3,
    z: 1,
  }
};

scene.lights = [
  {
    x: -20,
    y: -15,
    z: 30
  },
];

scene.objects = [
  {
    type: 'sphere',
    point: {
      x: 0,
      y: 1,
      z: 0
    },
    color: {
      x: 53,
      y: 237,
      z: 180
    },
    specular: 0.5,
    lambert: 0.2,
    ambient: 0,
    radius: 3
  },
  {
    type: 'sphere',
    point: {
      x: 4,
      y: 0,
      z: 0
    },
    color: {
      x: 255,
      y: 0,
      z: 0
    },
    specular: 0,
    lambert: 0.9,
    ambient: 0.0,
    radius: 0.75
  },
  {
    type: 'sphere',
    point: {
      x: -2.5,
      y: -1.5,
      z: 1
    },
    color: {
      x: 0,
      y: 0,
      z: 255
    },
    specular: 0,
    lambert: 0.7,
    ambient: 0.2,
    radius: 0.5,
  },
  {
    type: 'sphere',
    point: {
      x: -1.5,
      y: 1,
      z: 4.5
    },
    color: {
      x: 255,
      y: 0,
      z: 255
    },
    specular: 0,
    lambert: 0.7,
    ambient: 0.1,
    radius: 0.5
  },
  {
    type: 'plane',
    point: {
      x: 0,
      y: 4.0,
      z: 0,
    },
    normal: Vector.unitVector({
      x: 0,
      y: 1,
      z: 0
    }),
    color: {
      x: 255,
      y: 0,
      z: 255,
      type: 'checkered'
    },
    specular: 0,
    lambert: 0.5,
    ambient: 0.2,
  },
  {
    type: 'sphere',
    point: {
      x: 6,
      y: 1,
      z: 2
    },
    color: {
      x: 53,
      y: 237,
      z: 180
    },
    specular: 0.5,
    lambert: 0.2,
    ambient: 0,
    radius: 3
  },
];

function render(scene) {
  let camera = scene.camera,
      objects = scene.objects,
      lights = scene.lights;

  let eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point));

  let vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP));
  let vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector));

  let fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
      heightWidthRadio = height / width,
      halfWidth = Math.tan(fovRadians),
      halfHeight = heightWidthRadio * halfWidth,
      cameraWidth = halfWidth * 2,
      cameraHeight = halfHeight * 2,
      pixelWidth = cameraWidth / (width - 1),
      pixelHeight = cameraHeight / (height - 1);

  var index, color;
  var ray = {
    point: camera.point
  };

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var xcomp = Vector.scale(vpRight, (x * pixelWidth) - halfWidth),
          ycomp = Vector.scale(vpUp, (y * pixelHeight) - halfHeight);

      ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

      color = trace(ray, scene, 0);
      index = (x * 4) + (y * width * 4);
      data.data[index + 0] = color.x;
      data.data[index + 1] = color.y;
      data.data[index + 2] = color.z;
      data.data[index + 3] = 255;
    }
  }

  ctx.putImageData(data, 0, 0);
}

function trace(ray, scene, depth) {
  if (depth > 2) return;

  var distObject = intersectScene(ray, scene);

  if (distObject[0] === Infinity) {
    return { x: 200, y: 200, z: 200 };
  }

  var dist = distObject[0],
      object = distObject[1];

  var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

  let normal;

  if  (object.type == 'sphere') {
    normal = sphereNormal(object, pointAtTime);
  } else {
    normal = planeNormal(object, pointAtTime);
  }

  return surface(ray, scene, object, pointAtTime, normal, depth);
}

function intersectScene(ray, scene) {
  var closest = [Infinity, null];

  for (var i = 0; i < scene.objects.length; i++) {
    var object = scene.objects[i];

    if(object.type == 'sphere') {
      var dist = sphereIntersection(object, ray);

      if (dist !== undefined && dist < closest[0]){
        closest = [dist, object];
      }
    } else {
      var dist = planeIntersection(object, ray);

      if (dist !== undefined && dist < closest[0]){
        closest = [dist, object];
      }
    }
  }

  return closest;
}

function planeIntersection(plane, ray) {
  var d_dor_n = Vector.dotProduct(ray.vector, plane.normal);

  if(Math.abs(d_dor_n) <= 0.15) {
    return;
  } else {
    var dist = Vector.dotProduct(plane.point, plane.normal) - Vector.dotProduct(ray.point, plane.normal);
    var dist = Vector.dotProduct(
      Vector.subtract(plane.point, ray.point),
      plane.normal
    );

    if(dist > 0.0001) {
      return dist / d_dor_n;
    }
  }
}

function sphereIntersection(sphere, ray) {
  var eyeToCenter = Vector.subtract(sphere.point, ray.point),
      v = Vector.dotProduct(eyeToCenter, ray.vector),
      eoDot = Vector.dotProduct(eyeToCenter, eyeToCenter),
      discriminant = (sphere.radius * sphere.radius) - eoDot + (v * v);

  if (discriminant < 0) {
    return
  } else {
    return v - Math.sqrt(discriminant);
  }
}

function sphereNormal(sphere, pos) {
  return Vector.unitVector(Vector.subtract(pos, sphere.point));
}

function planeNormal(plane, pos) {
  return Vector.unitVector(
    Vector.subtract(
      Vector.ZERO,
      Vector.reflectThrough(pos, plane.normal)
    )
  );
  // return Vector.subtract(pos, plane.normal);
}

function surface(ray, scene, object, pointAtTime, normal, depth) {
  var b = object.color,
      c = Vector.ZERO,
      lambertAmount = 0;

  if (b.type == 'checkered') {
    let square = Math.floor(pointAtTime.x) + Math.floor(pointAtTime.z);

    if (square % 2 == 0) {
      b.x = b.y = b.z = 0;
    } else {
      b.x = b.y = b.z = 255;
    }
  }

  if (object.lambert) {
    for (var i = 0; i < scene.lights.length; i++) {
      var lightPoint = scene.lights[i];

      if (!isLightVisible(pointAtTime, scene, lightPoint)) continue;

      var contribution = Vector.dotProduct(Vector.unitVector(Vector.subtract(lightPoint, pointAtTime)), normal);

      if (contribution > 0) lambertAmount += contribution;
    }
  }

  if (object.specular) {
    var reflectedRay = {
      point: pointAtTime,
      vector: Vector.reflectThrough(ray.vector, normal)
    };

    var reflectedColor = trace(reflectedRay, scene, ++depth);

    if (reflectedColor) {
      c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
    }
  }

  lambertAmount = Math.min(1, lambertAmount);

  return Vector.add3(c,
                     Vector.scale(b, lambertAmount * object.lambert),
                     Vector.scale(b, object.ambient)
                    );
}

function isLightVisible(pt, scene, light) {
  var distObject = intersectScene({
    point: pt,
    vector: Vector.unitVector(Vector.subtract(pt, light))
  }, scene);

  return distObject[0] > -0.005;
}

var planet1 = 0,
    planet2 = 0;

var lastTick;

var fps = document.getElementById('fps');

function tick() {
  planet1 += 0.15 * 2;
  planet2 += 0.075 * 2;

  scene.objects[1].point.x = Math.sin(planet1) * 4.5;
  scene.objects[1].point.z = (Math.cos(planet1) * 4.5);

  scene.objects[2].point.x = Math.sin(planet2) * 3.5;
  scene.objects[2].point.z = + (Math.cos(planet2) * 3.5);

  render(scene);

  requestAnimationFrame(tick);

  if (lastTick) {
    fps.textContent = 1000 / (Date.now() - lastTick) + ' FPS';
  }

  lastTick = Date.now();
}

render(scene);

tick();
