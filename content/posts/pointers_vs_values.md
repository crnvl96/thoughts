+++
date = '2025-09-27'
draft = true
title = 'Go Pointers'
+++

# Pointers vs. Values in Go: Tradeoffs and Guidelines

In the `picker.go` code, both `Item` and `model` structs use pointer receivers for their methods (e.g., `func (i *Item) Title() string`). This is driven by the framework requirements (Bubbletea expects a `*model` for the program) and interface compliance (`list.Item` expects methods on `*Item`). However, the tradeoffs and guidelines for pointers vs. values in Go are as follows:

## Tradeoffs of Using Pointers vs. Values

### Advantages of Pointers:
- **Modification of the receiver:** Pointer receivers allow methods to modify the original struct's fields. Value receivers work on a copy, so changes are lost.
- **Efficiency for large structs:** Passing a pointer avoids copying the entire struct (which can be expensive for large data). This is especially relevant for structs with many fields or embedded data.
- **Interface compliance:** Some interfaces (like `list.Item` here) require pointer receivers to ensure the method can access or modify the underlying data without copying.
- **Nil safety in some cases:** Pointers can represent "absence" (nil), which is useful for optional or uninitialized structs.
- **Consistency:** If any method on a type uses a pointer receiver (e.g., to modify state), all methods should use pointers to avoid confusion and ensure the type behaves uniformly.

### Disadvantages of Pointers:
- **Nil panics:** Dereferencing a nil pointer causes a runtime panic, which can crash the program if not handled (e.g., via checks or initialization).
- **Slight overhead:** Pointers add a small memory and indirection cost compared to direct values.
- **Concurrency risks:** Shared pointers can lead to race conditions in concurrent code if not protected (e.g., with mutexes), as multiple goroutines might modify the same data.
- **Less safe for small structs:** For tiny structs (e.g., with just a few int fields), copying is often faster and safer than indirection.
- **Immutability loss:** Values promote immutability by default, while pointers allow accidental mutation.

### Advantages of Values:
- **Safety and simplicity:** No nil panics, and methods can't accidentally modify the original data (promotes immutability).
- **Performance for small data:** Copying small structs (e.g., primitives or simple aggregates) is often cheaper than pointer indirection.
- **Thread safety:** Values are inherently safe in concurrent contexts since each call gets a copy.

### Disadvantages of Values:
- **No modification:** Methods can't change the original struct; they must return updated copies.
- **Inefficiency for large data:** Copying large structs wastes memory and CPU, especially in loops or recursive calls.
- **Interface limitations:** Some APIs (like Bubbletea's `tea.Model`) require pointers to allow state changes across calls.

## General Guidelines for Using Pointers vs. Values
- **Use pointers when:**
  - The method needs to modify the receiver's fields (e.g., updating state in a model).
  - The struct is large (rule of thumb: >1-2 words in size, or contains slices/maps/channels).
  - Required by an interface or framework (as in this code).
  - The struct might be nil or optional (e.g., error handling).
  - For consistency: If any method on the type uses a pointer, use pointers for all methods to avoid mixing semantics.

- **Use values when:**
  - The struct is small and immutable (e.g., coordinates, simple configs).
  - Methods don't need to modify the receiver (e.g., getters like `Title()` or `Description()`).
  - You want to ensure thread safety without locks (each call gets a safe copy).
  - The type is a primitive or basic aggregate (e.g., `time.Time` often uses values for simplicity).

- **Receiver rules (from Effective Go):**
  - Value receivers: Can be called on both values and pointers (Go auto-dereferences).
  - Pointer receivers: Can only be called on pointers (Go auto-takes address for addressable values, like variables).
  - If in doubt, profile performance—pointers aren't always faster (e.g., small structs copy quickly).

In `picker.go`, pointers are appropriate due to Bubbletea's design and the need for stateful updates. If the structs were smaller and immutable, values might suffice, but the current setup avoids unnecessary copying and ensures mutability. For more details, see the "Pointers vs. Values" section in Effective Go.
