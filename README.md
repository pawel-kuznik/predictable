# predictable

Seeded, stable random number generators for JavaScript and TypeScript.

Every generator here is deterministic: the same seed always produces the same
sequence, on every platform and in every release. That makes them useful
wherever results must look random to a person but be reproducible by a machine,
such as procedural generation, game replays, simulations and tests.

> **Do not use any of these for cryptography, passwords or tokens.** They are
> fast and predictable by design. Use `crypto.getRandomValues()` instead.

## Installation

```sh
npm install @pawel-kuznik/predictable
```

## Usage

```ts
import { SFC32 } from "@pawel-kuznik/predictable";

const rng = new SFC32(42);   // omit the seed to pick a random one

rng.random();      // float in [0, 1), a drop-in for Math.random()
rng.next(1, 6);    // integer in [1, 6], both ends included
rng.next();        // raw output of the generator
```

All generators implement the same `RNG` interface, so they can be swapped
without changing the calling code.

### Picking from arrays

```ts
const loot = ["sword", "shield", "potion", "gold"];

rng.pickRandom(loot);      // one random item; loot is unchanged
rng.pluckRandom(loot);     // one random item, removed from loot
rng.sliceRandom(loot, 2);  // two distinct items in random order; loot is unchanged
```

`pickRandom` and `pluckRandom` throw a `RangeError` on an empty array.
`sliceRandom` returns at most as many items as the array has, like
`Array.prototype.slice`.

To write your own generator, extend `BaseRNG` and implement `next()` and
`random()`; the array helpers come with it.

## Generators

| Generator | Speed | What it is |
|---|---|---|
| `SFC32` | ★★★ ~90 M/s | Small Fast Chaotic generator. 128-bit state and excellent statistical quality. **The recommended default.** |
| `Xoshiro128` | ★★☆ ~65 M/s | xoshiro128\*\*, a widely used and well-studied generator with a 2¹²⁸ − 1 period. Choose it when you need to match other implementations. |
| `XORWOW` | ★★★ ~90 M/s | Xorshift with an added counter, the generator used by NVIDIA's cuRAND. Fast, but weaker statistically than the two above. |
| `LCG` | ★★☆ ~45 M/s | Linear congruential generator with GCC constants. Simple and classic, but values fall into visible patterns when plotted in 2D or 3D, so avoid it for terrain or noise. |
| `MWC` | ★☆☆ ~7 M/s | Multiply-with-carry with a 2¹²⁷ period. Slow, because it relies on 64-bit `BigInt` arithmetic. |
| `Combined` | depends | Combines two generators, e.g. `new Combined(SFC32, Xoshiro128, seed)`. About as fast as its two parts together. |

Speeds are `random()` calls per second, measured on Node.js 24 with an
AMD Ryzen 7 3800X. For comparison, `Math.random()` runs at about 65 M/s there.
Absolute numbers depend on the machine; the ratios between generators hold up
better.

## Saving and restoring state

`SFC32` and `Xoshiro128` can save their position in a sequence and continue
from it later, for example from a saved game:

```ts
const saved = rng.state;               // array of numbers, safe to store as JSON
const restored = SFC32.fromState(saved);
```

## UUIDs

`uuid4(rng)` generates a version 4 UUID from any generator, so the same seed
gives the same UUIDs:

```ts
import { SFC32, uuid4 } from "@pawel-kuznik/predictable";

uuid4(new SFC32(42));
```

## License

ISC
