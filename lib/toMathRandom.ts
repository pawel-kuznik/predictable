/**
 *  A function to convert an input of any number into a output that would be
 *  given by Math.random: a range of [0, 1).
 */
export function toMathRandom(input: number) : number {

    const one = input % Math.pow(2, 32);
    if (Number.isNaN(one)) console.log('one is NaN', input);

    const two = one % Math.pow(2, 32);
    if (Number.isNaN(two)) console.log('two is NaN', input);

    return Math.abs(input) % Number.MAX_SAFE_INTEGER / Number.MAX_SAFE_INTEGER;
};
