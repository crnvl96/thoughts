+++
title = "Raytracer - Raylib"
date = "2026-02-07"
+++

Let's walk through `src/main.c` – a clean raytracer using raylib.

> Check the project's source code at [Github](https://github.com/crnvl96/tracer)

## The materials

- `SphereMaterial`: Holds `Color`, `specular` (0-1), `shininess`.
- `Sphere`: Material + `Vector3 position` + `float radius`.

## Render Loop

Per frame, recompute all pixels (brute-force, no acceleration):

1. **Ray Generation**: For each `x,y`, `GetScreenToWorldRay` shoots ray from camera through pixels.

2. **Intersection**:
   - Init nearest collision distance to `FLT_MAX`.
   - For each sphere: `GetRayCollisionSphere(ray, pos, radius)`.
   - Track closest hit + sphere.

3. **Miss**: `BLACK` pixel.

## Build & Run

```bash
cmake -B build
cmake --build build
./build/Raytracer
```
