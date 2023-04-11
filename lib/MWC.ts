import { RNG } from "./RNG";
import { toMathRandom } from "./toMathRandom";
/**
 *  This is an implementation of Multiply With Carry (MWC) pseudo-random number generator.
 *  This is a lightweight algorithm that might be useful when dealing with games and and so on.
 * 
 *  WATCH OUT: DO NOT USE IT FOR CRYPTO !!! THIS IS IDIOTICALLY UNSAFE FOR CRYPTO !!!
 * 
 *  This algorithm has a period length of approximately 2^127
 * 
 *  @see https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator#Complementary-multiply-with-carry_generators
 * 
 *  DO NOT USER THIS ONE. IT'S BROKEN IN SOME CASES. I AM KEEPING IT HERE SO I CAN FIX IT LATER.
 */
export class MWC implements RNG {

    private _MWC: number = Number.MAX_SAFE_INTEGER;
    private _x: number;
    private _c: number = 1;

    /**
     * The constructor for the class.
     * 
     *  @param seed     The seed must be a number between 0 and 0xff3a275c007b8ee6.
     */
    constructor(seed:number|null = null) {

        const actualSeed = seed ? seed : Math.floor(1000 * Math.random() % 1000); 

        this._x = actualSeed;
        this._c = actualSeed;
    }

    /**
     *  Generate a new number with this algorithm. When not supplied any parameters
     *  the generated number can be any number that platform can hold in number type.
     *  When supplied start and end, the result will be clamped.
     */
    next(start: number, end: number): number;
    next(): number;
    next(...params:any) : number {

        const oldX = this._x;
        const oldC = this._c;

        const t: bigint = BigInt(this._MWC) * BigInt(this._x) + BigInt(this._c);
        this._c = Number(t >> 64n);
        this._x = Math.min(Number.MAX_SAFE_INTEGER, Number(t));

        const result = this._x;

        if (!Number.isFinite(result)) {
            console.log('result is infinity', oldX, oldC, this._x, this._c, t);

            throw Error('wtf');
        }

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
