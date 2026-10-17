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

    /**
     *  Pick a random item from an array. The array is not changed.
     *
     *  @throws RangeError when the array is empty.
     */
    pickRandom<TItem>(items: readonly TItem[]) : TItem;

    /**
     *  Pick a random item from an array and remove it from the array.
     *
     *  @throws RangeError when the array is empty.
     */
    pluckRandom<TItem>(items: TItem[]) : TItem;

    /**
     *  Pick a number of distinct items from an array, in random order. The array is
     *  not changed. Like Array.prototype.slice, the count is clamped to the array length.
     */
    sliceRandom<TItem>(items: readonly TItem[], count: number) : TItem[];
};
