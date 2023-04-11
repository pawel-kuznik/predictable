/**
 *  This is a quick function to generate an uuid based on our predicatable
 *  random number generator.
 */

// import the dependency
import { RNG } from "./RNG";

// export the function
export function uuid4(random:RNG) {

    // this is a slightly modified solution from StackOverflow
    // @see https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c:string) => {

        // do magic
        let r = random.next(0, 15) | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

        // return the character
        return v.toString(16);
    });
};
