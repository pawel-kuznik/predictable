import { RNG } from "./RNG";
import { BaseRNG } from "./BaseRNG";

/**
 *  This is a class that allows to combine results of two random number generators.
 */
export class Combined extends BaseRNG {

    private _rng1: RNG;
    private _rng2: RNG;

    constructor(RNG1: new (seed?: number) => RNG, RNG2: new (seed?: number) => RNG, seed?: number) {

        super();

        const actualSeed = seed ?? Math.floor(Math.random() * 0x7fffffff);

        this._rng1 = new RNG1(actualSeed);
        this._rng2 = new RNG2(actualSeed);
    }

    /**
     *  Generate a new number with this algorithm. When not supplied any parameters
     *  the generated number is an integer in [0, 2^32). When supplied start and end,
     *  the result will be in the inclusive range.
     */
    next(start: number, end: number): number;
    next(): number;
    next(...params: any): number {

        if (params.length > 0) return params[0] + Math.floor(this.random() * (params[1] - params[0] + 1));
        return Math.floor(this.random() * 2 ** 32);
    }

    /**
     *  Generate random number in a bracket of [0, 1). The sum of the two results
     *  modulo 1 is uniform when at least one of the generators is uniform.
     */
    random(): number {
        return (this._rng1.random() + this._rng2.random()) % 1;
    }
};
