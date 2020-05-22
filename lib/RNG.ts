/**
 *  This is an interface for a RNG.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
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
};
