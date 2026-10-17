import { BaseRNG } from "./BaseRNG";
/**
 *  This is an implementation of Multiply With Carry (MWC) pseudo-random number generator.
 *  This is a lightweight algorithm that might be useful when dealing with games and and so on.
 *
 *  WATCH OUT: DO NOT USE IT FOR CRYPTO !!! THIS IS IDIOTICALLY UNSAFE FOR CRYPTO !!!
 *
 *  This is a lag-1 MWC with base 2^64. It has a period length of approximately 2^127
 *
 *  @see https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator#Complementary-multiply-with-carry_generators
 */
export class MWC extends BaseRNG {

    private readonly _a: bigint = 0xff3a275c007b8ee6n;
    private readonly _mask: bigint = 0xffffffffffffffffn;
    private _x: bigint;
    private _c: bigint = 1n;

    /**
     * The constructor for the class.
     *
     *  @param seed     The seed must be a number between 0 and 0xff3a275c007b8ee6.
     */
    constructor(seed:number|null = null) {

        super();

        const actualSeed = seed ?? Math.random() * Number.MAX_SAFE_INTEGER;

        this._x = BigInt(Math.floor(Math.abs(actualSeed)));
    }

    /**
     *  Generate a new number with this algorithm. When not supplied any parameters
     *  the generated number is an integer in [0, 2^53). When supplied start and end,
     *  the result will be in the inclusive range.
     */
    next(start: number, end: number): number;
    next(): number;
    next(...params:any) : number {

        if (params.length > 0) return params[0] + Math.floor(this.random() * (params[1] - params[0] + 1));

        const t = this._a * this._x + this._c;
        this._c = t >> 64n;
        this._x = t & this._mask;

        // keep the top 53 bits, so the result is a safe integer
        return Number(this._x >> 11n);
    }

    /**
     *  Generate random number in a bracket of [0, 1).
     */
    random(): number {
        return this.next() / 2 ** 53;
    }
};
