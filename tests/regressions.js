/**
 *  Regression tests shared by all generators: random() spread, inclusive
 *  next(min, max) and a zero seed.
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
    Combined: seed => new Combined(LCG, XORWOW, seed)
};

for (const [name, create] of Object.entries(generators)) {

    describe(`${name} regressions`, () => {

        it('random() should spread across [0, 1)', () => {

            const generator = create(42);
            const values = Array.from({ length: 1000 }, () => generator.random());

            for (const value of values) expect(value).to.be.at.least(0).and.below(1);

            expect(Math.min(...values)).to.be.below(0.1);
            expect(Math.max(...values)).to.be.above(0.9);
            expect(new Set(values).size).to.be.above(990);
        });

        it('next(min, max) should include both ends', () => {

            const generator = create(42);
            const seen = new Set();

            for (let i = 0; i < 1000; i++) {

                const value = generator.next(5, 10);
                expect(value).to.be.at.least(5).and.at.most(10);
                seen.add(value);
            }

            expect([...seen].sort((a, b) => a - b)).to.deep.equal([5, 6, 7, 8, 9, 10]);
        });

        it('should be deterministic for seed 0', () => {

            const a = create(0);
            const b = create(0);

            for (let i = 0; i < 10; i++) expect(a.random()).to.equal(b.random());
        });
    });
}
