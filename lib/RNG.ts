/**
 *  This is an interface for a RNG.
 */

// export the interface
export interface RNG {

    /**
     *  Generate next value within a special range of numbers. The range is inclusive.
     */
    next(start:number, end:number) : number;

    /**
     *  Generate a new random number. Any number.
     */
    next() : number;

    /**
     *  This is an additional function to make the LCG compatible with the expected output
     *  of Math.random function. The result of this function is alwasy beween 0 and 1 (0 including).
     */
    random() : number;
};
