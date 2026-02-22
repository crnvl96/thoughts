+++
title = "Raytracer - Raylib"
date = "2026-02-07"
+++

Let's walk through _src/main.c_ – a clean raytracer using raylib.

> Check the project's source code at [Github](https://github.com/crnvl96/tracer)

## The materials

- _SphereMaterial_: Holds _Color_, _specular (0-1)_, _shininess_.
- _Sphere_: Material + _Vector3 position_ + _float radius_.

## Render Loop

Per frame, recompute all pixels (brute-force, no acceleration):

1. **Ray Generation**: For each _x,y_, _GetScreenToWorldRay_ shoots ray from camera through pixels.

2. **Intersection**:
   - Init nearest collision distance to _FLT_MAX_.
   - For each sphere: _GetRayCollisionSphere(ray, pos, radius)_.
   - Track closest hit + sphere.

3. **Miss**: _BLACK_ pixel.

## Build & Run

```bash
cmake -B build
cmake --build build
./build/Raytracer
```
