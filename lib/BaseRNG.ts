import { RNG } from "./RNG";

/**
 *  A base class for generators. A generator only needs to implement next()
 *  and random(), and gets the helper methods of the RNG interface from here.
 */
export abstract class BaseRNG implements RNG {

    /**
     *  Generate next value within a special range of numbers. The range is inclusive.
     */
    abstract next(start: number, end: number): number;

    /**
     *  Generate a new random number.
     */
    abstract next(): number;

    /**
     *  Generate random number in a bracket of [0, 1).
     */
    abstract random(): number;

    /**
     *  Pick a random item from an array. The array is not changed.
     *
     *  @throws RangeError when the array is empty.
     */
    pickRandom<TItem>(items: readonly TItem[]) : TItem {

        if (items.length === 0) throw new RangeError('Cannot pick an item from an empty array');

        return items[this.next(0, items.length - 1)];
    }

    /**
     *  Pick a random item from an array and remove it from the array.
     *
     *  @throws RangeError when the array is empty.
     */
    pluckRandom<TItem>(items: TItem[]) : TItem {

        if (items.length === 0) throw new RangeError('Cannot pluck an item from an empty array');

        return items.splice(this.next(0, items.length - 1), 1)[0];
    }

    /**
     *  Pick a number of distinct items from an array, in random order. The array is
     *  not changed. Like Array.prototype.slice, the count is clamped to the array length.
     */
    sliceRandom<TItem>(items: readonly TItem[], count: number) : TItem[] {

        const result = [...items];
        const size = Math.max(0, Math.min(Math.floor(count), result.length));

        // a partial Fisher-Yates shuffle: only the first `size` positions are shuffled
        for (let i = 0; i < size; i++) {

            const j = this.next(i, result.length - 1);
            [result[i], result[j]] = [result[j], result[i]];
        }

        result.length = size;
        return result;
    }
};
