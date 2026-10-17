import { BaseRNG } from "./BaseRNG";
import { seedState } from "./splitMix";

/**
 *  This is an implementation of Small Fast Chaotic (SFC32) generator by Chris Doty-Humphrey.
 *  It has 128 bits of state (three chaotic words and a counter), which guarantees a period
 *  of at least 2^32 and gives about 2^127 on average. It passes PractRand and TestU01 BigCrush
 *  and only needs 32-bit integer operations, so it's very fast in JavaScript.
 *
 *  WATCH OUT: DO NOT USE IT FOR CRYPTO !!! THIS IS IDIOTICALLY UNSAFE FOR CRYPTO !!!
 *
 *  @see https://pracrand.sourceforge.net/RNG_engines.txt
 */
export class SFC32 extends BaseRNG {

    /**
     *  The state words a, b, c and the counter.
     */
    private _state: number[];

    /**
     *  The constructor for the class.
     *
     *  @param seed     An integer seed. Only its lowest 32 bits are used. When not
     *                  provided, a random seed is picked based on Math.random().
     */
    constructor(seed: number | null = null) {

        super();

        // fill the whole state with well-mixed values from splitmix32
        this._state = seedState(seed, 4);
    }

    /**
     *  Create a generator from a state previously read with the state getter.
     */
    static fromState(state: number[]) : SFC32 {

        if (state.length !== 4) throw new Error('SFC32 state must have 4 words');

        const generator = new SFC32(0);
        generator._state = state.map(value => value >>> 0);
        return generator;
    }

    /**
     *  Get a copy of the current state. It can be used to restore the generator later.
     */
    get state() : number[] { return [...this._state]; }

    /**
     *  Generate a new number with this algorithm. When not supplied any parameters
     *  the generated number is an integer in [0, 2^32). When supplied start and end,
     *  the result will be in the inclusive range.
     */
    next(start: number, end: number): number;
    next(): number;
    next(...params: any): number {

        if (params.length > 0) return params[0] + Math.floor(this.random() * (params[1] - params[0] + 1));

        const s = this._state;
        const b = s[1];
        const c = s[2];

        const result = (s[0] + b + s[3]) >>> 0;

        s[0] = (b ^ (b >>> 9)) >>> 0;
        s[1] = (c + (c << 3)) >>> 0;
        s[2] = (((c << 21) | (c >>> 11)) + result) >>> 0;
        s[3] = (s[3] + 1) >>> 0;

        return result;
    }

    /**
     *  Generate random number in a bracket of [0, 1).
     */
    random(): number {
        return this.next() / 2 ** 32;
    }
};
