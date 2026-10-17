import { BaseRNG } from "./BaseRNG";
import { seedState } from "./splitMix";

/**
 *  This is an implementation of shift-register generator.
 * 
 *  WATCH OUT: DO NOT USE IT FOR CRYPTO !!! THIS IS IDIOTICALLY UNSAFE FOR CRYPTO !!!
 * 
 *  @see https://en.wikipedia.org/wiki/Xorshift
 */
export class XORWOW extends BaseRNG {

    private _state: number[];

    private _counter: number = 0;

    /**
     *  The constructor for the class.
     *
     *  @param seed     An integer seed. Only its lowest 32 bits are used. When not
     *                  provided, a random seed is picked based on Math.random().
     */
    constructor(seed: number | null = null) {

        super();

        // fill the whole state with well-mixed values from splitmix32
        this._state = seedState(seed, 5);

        // an all-zero xorshift state never changes, so make sure it can't happen
        if (this._state.every(value => value === 0)) this._state[0] = 1;
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

        let t = this._state[4];

        let s = this._state[0];
        this._state[4] = this._state[3];
        this._state[3] = this._state[2];
        this._state[2] = this._state[1];
        this._state[1] = this._state[0];

        t ^= t >>> 2;
        t ^= t << 1;
        t ^= s ^ (s << 4);

        this._state[0] = t >>> 0;
        this._counter = (this._counter + 362437) >>> 0;

        // the result is an unsigned 32-bit integer
        return (t + this._counter) >>> 0;
    }

    /**
     *  Generate random number in a bracket of [0, 1).
     */
    random(): number {
        return this.next() / 2 ** 32;
    }
};
