/**
 *  This is an implementation of Linear Congruential Generator (LCG) with GCC constants.
 *  This algorithm generates a sequence of numbers that seem random, but are
 *  in fact computated based on the previous numbers.
 *
 *  This "randomness" is useful when desining games. Some aspects should appear
 *  random to a human, but be completely deterministic for a machine.
 * 
 *  Keep in mind that this algorithm does very poorly in spectral test. Meaning that
 *  when results would be plotted in a 2 or more dimensions the results will form lines.
 *  This pretty much excludes this algorithm for 2D or 3D terrain generation.
 *
 *  WATCH OUT: DO NOT USE IT FOR CRYPTO!!! THIS IS IDIOTICALLY UNSAFE FOR CRYPTO!!!
 *
 *  @see        https://en.wikipedia.org/wiki/Linear_congruential_generator
 */

// the dependency
import { BaseRNG } from "./BaseRNG";

// export the class
export class LCG extends BaseRNG {

    /**
     *  The GCC constants. They are needed for it to work. It's somewhat magic.
     *  At the time of implementing this algorithm, I the author of this specific
     *  implementation, have no clue if they are good or not. I picked them
     *  cause GCC compiler uses them. It might be they are complete crap.
     */
    private readonly _m:number = 0x80000000; // 2**31;
    private readonly _a:number = 1103515245;
    private readonly _c:number = 12345;

    /**
     *  The original seed that we want to use for this instance. It can be
     *  retrieved by getter
     */
    private readonly _seed:number;

    /**
     *  The currently generated number.
     */
    private _current:number;

    /**
     *  The constructor for the class
     *
     *  @param  seed    the seed should be a number that would act as a randomness
     *                  seed. Means that it will be used to generate each "random"
     *                  number from this instance.
     *
     *                  If null provide it will pick a random number based on Math.random().
     */
    constructor(seed:number|null = null) {

        super();

        // assign seed
        this._seed = seed ?? Math.floor(Math.random() * (this._m - 1));

        // assign first state. It's first "generated" number. It's seed.
        this._current = this._seed;
    }

    /**
     *  Get access to the original seed.
     */
    get seed() : number { return this._seed; }

    /**
     *  This is an additional function to make the LCG compatible with the expected output
     *  of Math.random function. The result of this function is alwasy beween 0 and 1 (0 including).
     */
    random() : number {
        return this.next() / this._m;
    }

    /**
     *  Generate next value within a special range of numbers. The range is inclusive.
     */
    next(start:number, end:number) : number;

    /**
     *  Generate a new random number. Any number.
     */
    next() : number;

    // implementation
    next(...params:any) : number {

        // should we make sure the next value is in certain range? Scaling a
        // float in [0, 1) is better than modulo of the state, as the low bits
        // of an LCG are not very random.
        // @see https://en.wikipedia.org/wiki/Linear_congruential_generator
        if (params.length > 0) return params[0] + Math.floor(this.random() * (params[1] - params[0] + 1));

        // generate new state
        this._current = (this._a * this._current + this._c) % this._m;

        // return current state
        return this._current;
    }
};
