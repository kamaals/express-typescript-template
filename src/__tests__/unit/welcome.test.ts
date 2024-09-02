import {welcome} from "@/lib/welcome";

describe('welcome', () => {
    describe('when calling welcome with', () => {
        test('it should return ✨ Greetings! your app is up and running ✨', () => {
            expect(welcome()).toEqual('✨ Greetings! your app is up and running ✨');
        });
    });
});
