/**
 *  The output function of splitmix32. It turns an unsigned 32-bit integer into
 *  a well-mixed unsigned 32-bit integer.
 *
 *  @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#splitmix32
 */
export function splitMix(input: number) : number {

    let s = input ^ (input >>> 16);
    s = Math.imul(s, 0x21f0aaad);
    s ^= s >>> 15;
    s = Math.imul(s, 0x735a2d97);
    s ^= s >>> 15;

    return s >>> 0;
};

/**
 *  Expand a seed into a number of well-mixed unsigned 32-bit integers. When no
 *  seed is provided, a random one is picked based on Math.random().
 */
export function seedState(seed: number | null | undefined, length: number) : number[] {

    let mixer = (seed ?? Math.floor(Math.random() * 2 ** 32)) >>> 0;

    return Array.from({ length }, () => {
        mixer = (mixer + 0x9e3779b9) >>> 0;
        return splitMix(mixer);
    });
};
