/**
 *  A test script for the LCG implementation.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// the testing method
const expect = require('chai').expect;

// get the dependencies
const { LCG } = require('../build/index.js');

describe('LCG', () => {

    describe('.next()', () => {

        it('should generate different numbers', () => {

            // construct a generator
            const generator = new LCG();

            // generate 3 numbers
            const s1 = generator.next();
            const s2 = generator.next();
            const s3 = generator.next();

            // expect the numbers are different
            expect(s1).to.not.equal(s2).and.not.equal(s3);
        });

        it('should generate in a range', () => {

            // construct a generator
            const generator = new LCG();

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
            const generator = new LCG();

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
});
