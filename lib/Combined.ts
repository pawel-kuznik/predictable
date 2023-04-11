import { RNG } from "./RNG";
import { toMathRandom } from "./toMathRandom";

/**
 *  This is a class that allows to combine results of two random number generators.
 */
export class Combined implements RNG {

    private _rng1: RNG;
    private _rng2: RNG;

    constructor(RNG1: new (seed?: number) => RNG, RNG2: new (seed?: number) => RNG, seed?: number) {

        const actualSeed = seed ? seed : Math.random();

        this._rng1 = new RNG1(actualSeed);
        this._rng2 = new RNG2(actualSeed);
    }

    /**
     *  Generate a new number with this algorithm. When not supplied any parameters
     *  the generated number can be any number that platform can hold in number type.
     *  When supplied start and end, the result will be clamped.
     */
    next(start: number, end: number): number;
    next(): number;
    next(...params: any): number {
        
        const result1 = Math.max(Number.MAX_SAFE_INTEGER / 2, this._rng1.next());
        const result2 = Math.max(Number.MAX_SAFE_INTEGER / 2, this._rng2.next());

        const result = result1 + result2;

        if (params.length > 0) params[0] + Math.floor(result % (params[1] - params[0]));
        return result;
    }

    /**
     *  Generate random number in a bracket of [0, 1)
     */
    random(): number {
        return toMathRandom(this.next());
    }
};