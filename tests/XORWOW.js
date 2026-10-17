/**
 *  A test script for the XORWOW implementation.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// the testing method
const expect = require('chai').expect;

// get the dependencies
const { XORWOW } = require('../build/index.js');

describe('XORWOW', () => {

    describe('.next()', () => {

        it('should generate different numbers', () => {

            // construct a generator
            const generator = new XORWOW();

            // generate 3 numbers
            const s1 = generator.next();
            const s2 = generator.next();
            const s3 = generator.next();

            // expect the numbers are different
            expect(s1).to.not.equal(s2).and.not.equal(s3);
        });

        it('should generate in a range', () => {

            // construct a generator
            const generator = new XORWOW();

            // generate 3 numbers
            const s1 = generator.next(5, 10);
            const s2 = generator.next(5, 10);
            const s3 = generator.next(5, 10);

            // expect the numbers are different
            expect(s1).to.be.least(5).and.most(10);
            expect(s2).to.be.least(5).and.most(10);
            expect(s3).to.be.least(5).and.most(10);
        });

        it('should generate numbers fast', () => {

            // we want the generator to be reasonably fast. To detect regressions
            // we want to generate a lot of numbers and make sure we can do it
            // in reasonable time. This test case is limited to 10miliseconds
            // and we will try to generator 10k random numbers. One random number
            // per a milisecond sounds good enough.
            const generator = new XORWOW();

            // 10k numbers
            let count = 10000;

            while(count) {

                // generate number
                generator.next();

                // dec counter
                count--;
            }

            // superficial
            expect(count).to.be.equal(0);
        }).timeout(10);
    });

    describe('seeding', () => {

        const sequence = (generator) => Array.from({ length: 10 }, () => generator.next());

        it('should repeat the sequence for the same seed', () => {

            expect(sequence(new XORWOW(1234))).to.deep.equal(sequence(new XORWOW(1234)));
        });

        it('should give unrelated sequences for adjacent seeds', () => {

            const a = sequence(new XORWOW(1));
            const b = sequence(new XORWOW(2));

            a.forEach((value, index) => expect(value).to.not.equal(b[index]));
        });

        it('should pick different random seeds when unseeded', () => {

            expect(sequence(new XORWOW())).to.not.deep.equal(sequence(new XORWOW()));
        });

        it('should produce uint32 values from the first call', () => {

            const generator = new XORWOW(0);

            for (let i = 0; i < 1000; i++) {

                const value = generator.next();
                expect(Number.isInteger(value)).to.equal(true);
                expect(value).to.be.at.least(0).and.below(2 ** 32);
            }
        });
    });

    describe('.random()', () => {

        it('should always generate numbers in [0, 1) range', () => {

            const generator = new XORWOW();

            let count = 1000;

            while(count) {

                const result = generator.random();
                expect(result).to.be.greaterThanOrEqual(0).and.lessThan(1);

                count--;
            }
        });

        it('should not generate same values', () => {

            const generator = new XORWOW();

            let count = 100;

            const values = [];

            while(count) {

                const result = generator.random();
                values.push(result);

                expect(values.reduce((prev, curr) => prev + (curr === result ? 1 : 0), 0)).to.equal(1);

                count--;
            }
        });
    });
});
