+++
title = "Raytracer - SDL"
date = "2026-01-13"
+++

# Building a 2D Raytracer in 150 Lines of C

A real-time 2D simulation where a point light source emits rays in all directions. When these rays hit an obstacle, they stop.
The area behind the obstacle receives no light.

Here's what the simulation does:

- A white circle acts as a light source, emitting yellow rays
- Another white circle acts as an obstacle that blocks light
- The obstacle bounces up and down automatically
- You can drag the light source around with your mouse to see how shadows change in real-time

# The Foundation

Every raytracer needs to represent two fundamental concepts: shapes and rays.

# Shapes

```c
struct Circle {
  double x;      // Center x-coordinate
  double y;      // Center y-coordinate
  double r;      // Radius
};
```

# Rays

```c
struct Ray {
  double x_start;   // Where the ray begins (x)
  double y_start;   // Where the ray begins (y)
  double angle;     // Direction in radians
};
```

Notice something interesting here: we don't store where the ray ends. That's because we don't really know.
The ray will travel until it hits something or leaves the screen.
We only need to know where it starts and which direction it's pointing.

# Drawing Circles

```c
void FillCircle(SDL_Surface *surface, struct Circle circle, Uint32 color) {
  double r_squared = pow(circle.r, 2);

  for (int x = circle.x - circle.r; x < circle.x + circle.r; x++) {
    for (int y = circle.y - circle.r; y < circle.y + circle.r; y++) {
      double distance_squared = pow(x - circle.x, 2) + pow(y - circle.y, 2);
      if (distance_squared < r_squared) {
        // This pixel is inside the circle — fill it!
        SDL_Rect rect = {x, y, 1, 1};
        SDL_FillRect(surface, &rect, color);
      }
    }
  }
}
```

# Generating Rays

```c
#define RAYS_NUMBER 500

void generate_rays(struct Circle circle, struct Ray rays[RAYS_NUMBER]) {
  for (int i = 0; i < RAYS_NUMBER; i++) {
    double angle = ((double)i / RAYS_NUMBER) * 2 * M_PI;

    rays[i].x_start = circle.x;
    rays[i].y_start = circle.y;
    rays[i].angle = angle;
  }
}
```

For each ray, we need to:

1. Start at the light source
2. Move forward, step by step
3. Check if we've hit something
4. Draw a pixel at each step (until we hit something)

```c
void FillRays(SDL_Surface *surface, struct Ray rays[RAYS_NUMBER],
              Uint32 color, Uint32 blur_color, struct Circle object) {

  double step = 1.0;  // Move 1 pixel at a time
  double object_r_squared = pow(object.r, 2);

  for (int i = 0; i < RAYS_NUMBER; i++) {
    struct Ray ray = rays[i];

    double x_draw = ray.x_start;
    double y_draw = ray.y_start;

    // March the ray forward until it hits something
    while (1) {
      // Move one step in the ray's direction
      x_draw += step * cos(ray.angle);
      y_draw += step * sin(ray.angle);

      // Did we leave the screen?
      if (x_draw < 0 || x_draw > WIDTH || y_draw < 0 || y_draw > HEIGHT) {
        break;
      }

      // Did we hit the obstacle?
      double distance_squared = pow(x_draw - object.x, 2) +
                                pow(y_draw - object.y, 2);
      if (distance_squared < object_r_squared) {
        break;  // Stop! We hit something.
      }

      // Draw the ray at this position
      SDL_Rect ray_rect = {x_draw, y_draw, RAY_THICKNESS, RAY_THICKNESS};
      SDL_FillRect(surface, &ray_rect, color);
    }
  }
}
```

# Running the Project

Building and running is straightforward:

```bash
mkdir build && cd build
cmake ..
make
./raytracing
```
