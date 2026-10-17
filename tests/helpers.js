/**
 *  Tests for the array helpers shared by all generators: pickRandom(),
 *  pluckRandom() and sliceRandom().
 */

// the testing method
const expect = require('chai').expect;

// get the dependencies
const { LCG, MWC, XORWOW, SFC32, Xoshiro128, Combined } = require('../build/index.js');

const generators = {
    LCG: seed => new LCG(seed),
    MWC: seed => new MWC(seed),
    XORWOW: seed => new XORWOW(seed),
    SFC32: seed => new SFC32(seed),
    Xoshiro128: seed => new Xoshiro128(seed),
    Combined: seed => new Combined(SFC32, Xoshiro128, seed)
};

const items = ['a', 'b', 'c', 'd', 'e', 'f'];

for (const [name, create] of Object.entries(generators)) {

    describe(`${name} array helpers`, () => {

        describe('.pickRandom()', () => {

            it('should pick every item and leave the array unchanged', () => {

                const generator = create(42);
                const input = [...items];
                const seen = new Set();

                for (let i = 0; i < 500; i++) seen.add(generator.pickRandom(input));

                expect([...seen].sort()).to.deep.equal(items);
                expect(input).to.deep.equal(items);
            });

            it('should be deterministic for a seed', () => {

                const a = create(42);
                const b = create(42);

                for (let i = 0; i < 20; i++) expect(a.pickRandom(items)).to.equal(b.pickRandom(items));
            });

            it('should throw for an empty array', () => {

                expect(() => create(42).pickRandom([])).to.throw(RangeError);
            });
        });

        describe('.pluckRandom()', () => {

            it('should remove the picked item from the array', () => {

                const generator = create(42);
                const input = [...items];

                const item = generator.pluckRandom(input);

                expect(items).to.include(item);
                expect(input).to.have.length(items.length - 1);
                expect(input).to.not.include(item);
            });

            it('should pluck every item exactly once until empty', () => {

                const generator = create(42);
                const input = [...items];
                const plucked = [];

                while (input.length) plucked.push(generator.pluckRandom(input));

                expect([...plucked].sort()).to.deep.equal(items);
            });

            it('should throw for an empty array', () => {

                expect(() => create(42).pluckRandom([])).to.throw(RangeError);
            });
        });

        describe('.sliceRandom()', () => {

            it('should pick the requested number of distinct items', () => {

                const generator = create(42);

                for (let i = 0; i < 50; i++) {

                    const slice = generator.sliceRandom(items, 3);

                    expect(slice).to.have.length(3);
                    expect(new Set(slice).size).to.equal(3);
                    slice.forEach(item => expect(items).to.include(item));
                }
            });

            it('should leave the array unchanged', () => {

                const input = [...items];
                create(42).sliceRandom(input, 4);

                expect(input).to.deep.equal(items);
            });

            it('should clamp the count to the array length', () => {

                const generator = create(42);

                expect([...generator.sliceRandom(items, 100)].sort()).to.deep.equal(items);
                expect(generator.sliceRandom(items, 0)).to.deep.equal([]);
                expect(generator.sliceRandom(items, -1)).to.deep.equal([]);
                expect(generator.sliceRandom([], 3)).to.deep.equal([]);
            });

            it('should put every item in every position about equally often', () => {

                const generator = create(42);
                const counts = items.map(() => items.map(() => 0));

                for (let i = 0; i < 6000; i++) {

                    generator.sliceRandom(items, items.length).forEach((item, position) => counts[position][items.indexOf(item)]++);
                }

                // each item expects 1000 hits per position; 6 standard deviations is about 175
                counts.forEach(row => row.forEach(count => expect(count).to.be.within(825, 1175)));
            });
        });
    });
}
