import { RNG } from "./RNG";
import { toMathRandom } from "./toMathRandom";

/**
 *  This is an implementation of shift-register generator.
 * 
 *  WATCH OUT: DO NOT USE IT FOR CRYPTO !!! THIS IS IDIOTICALLY UNSAFE FOR CRYPTO !!!
 * 
 *  @see https://en.wikipedia.org/wiki/Xorshift
 */
export class XORWOW implements RNG {

    private _state: number[] = [
        0,
        0,
        0,
        0,
        0
    ];

    private _counter: number = 0;

    constructor(seed: number | undefined) {

        const actualSeed = seed ? seed : Math.random();

        const t1 = splitMix(actualSeed);
        this._state[0] = t1;
        this._state[1] = t1 >> 32;

        const t2 = splitMix(this._state[0]);
        this._state[2] = t2;
        this._state[3] = t2 >> 32;
    }

    /**
     *  Generate a new number with this algorithm. When not supplied any parameters
     *  the generated number can be any number that platform can hold in number type.
     *  When supplied start and end, the result will be clamped.
     */
    next(start: number, end: number): number;
    next(): number;
    next(...params: any): number {
        
        let t = this._state[4];

        let s = this._state[0];
        this._state[4] = this._state[3];
        this._state[3] = this._state[2];
        this._state[2] = this._state[1];
        this._state[1] = this._state[0];

        t ^= t >> 2;
        t ^= t << 1;
        t ^= s ^ (s << 4);

        this._state[0] = t;
        this._counter += 362437;

        const result = t + this._counter;

        if (params.length > 0) return params[0] + Math.floor(result % (params[1] - params[0]));
        return result;
    }

    /**
     *  Generate random number in a bracket of [0, 1).
     */
    random(): number {
        return toMathRandom(this.next());
    }
};

/**
 *  A quick implementation of splitmix32
 */
function splitMix(input: number) : number {

    let s = input + 1346269;
    s ^= s >> 16;
    s *= 0x85ebca6b;
    s ^= s >> 13;
    s *= 0xc2b2ae35;
    s ^= s >> 16;

    return s;
};
