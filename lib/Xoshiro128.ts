import { BaseRNG } from "./BaseRNG";
import { seedState } from "./splitMix";

/**
 *  This is an implementation of xoshiro128** generator by David Blackman and Sebastiano Vigna.
 *  It has 128 bits of state and a period of 2^128 - 1. It passes TestU01 BigCrush and only
 *  needs 32-bit integer operations, so it's very fast in JavaScript.
 *
 *  WATCH OUT: DO NOT USE IT FOR CRYPTO !!! THIS IS IDIOTICALLY UNSAFE FOR CRYPTO !!!
 *
 *  @see https://prng.di.unimi.it/xoshiro128starstar.c
 */
export class Xoshiro128 extends BaseRNG {

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

        // an all-zero state never changes, so make sure it can't happen
        if (this._state.every(value => value === 0)) this._state[0] = 1;
    }

    /**
     *  Create a generator from a state previously read with the state getter.
     */
    static fromState(state: number[]) : Xoshiro128 {

        if (state.length !== 4) throw new Error('Xoshiro128 state must have 4 words');
        if (state.every(value => (value >>> 0) === 0)) throw new Error('Xoshiro128 state must not be all zeros');

        const generator = new Xoshiro128(0);
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

        const result = Math.imul(rotl(Math.imul(s[1], 5), 7), 9) >>> 0;
        const t = s[1] << 9;

        s[2] ^= s[0];
        s[3] ^= s[1];
        s[1] ^= s[2];
        s[0] ^= s[3];
        s[2] ^= t;
        s[3] = rotl(s[3], 11);

        for (let i = 0; i < 4; i++) s[i] >>>= 0;

        return result;
    }

    /**
     *  Generate random number in a bracket of [0, 1).
     */
    random(): number {
        return this.next() / 2 ** 32;
    }
};

/**
 *  Rotate a 32-bit integer left by k bits.
 */
function rotl(x: number, k: number) : number {
    return (x << k) | (x >>> (32 - k));
};
