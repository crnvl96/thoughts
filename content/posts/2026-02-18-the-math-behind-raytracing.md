+++
title = "The math behind ray tracing"
date = "2026-02-18"
draft = true
[params]
  math = true
+++

In a previous raytracing project, we had to deal basically with two math operations:

1. Drawing circles in the screen
2. How to propagate traces throughout the screen

Let's examine in detail how each of these operations were done.

## Circles

Consider the following code:

```c
struct Circle {
  double x;
  double y;
  double r;
};
```

This sctucture covers the most essencial parameters we need to perform math operations with circles.

```c
void FillCircle(SDL_Surface *surface, struct Circle circle, Uint32 color) {
  double radius_squared = pow(circle.r, 2);

  for (double x = circle.x - circle.r; x <= circle.x + circle.r; x++) {
    for (double y = circle.y - circle.r; y <= circle.y + circle.r; y++) {
      double distance_squared = pow(x - circle.x, 2) + pow(y - circle.y, 2);

      if (distance_squared < radius_squared) {
        SDL_Rect pixel = (SDL_Rect){x, y, 1, 1};
        SDL_FillRect(surface, &pixel, color);
      }
    }
  }
}
```

First of all, is important to know that the equation that describes a circle is:

![The circle equation](/img/circle-equation.png)
